import json
import requests
import aioschedule as schedule
import asyncio
import time
from datetime import datetime, timedelta
import random
import environ

# from create_bot import bot

from aiogram import types, F, Router
from aiogram.enums.content_type import ContentType
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.fsm.state import State, StatesGroup
from baichat_py import Completion
from aiogram.filters import Command, CommandStart

from markups import (
    web_markup,
    admin_markup,
    pay_markup,
    show_spec_markup,
    pay_choice_markup,
    submited_markup,
)
from calendar_arrays import months, days
from prices import prices

from reused_functions import time_busy_message, send_order_func

router = Router()

env = environ.Env()
environ.Env().read_env()


req_url = env("request_url")
number_of_spec = env("number_of_spec")
pincode = env("pincode")
ukassa_token = env("ukassa_token")
openai_key = env("openai_key")
admin_chat_id = env("admin_chat_id")
admin_chat_group_id = env("admin_chat_group_id")

global_services = []
global_master_name = ""
global_telephone = ""
global_comment = ""
global_order_data = {}
global_services_message_id = 0
global_is_paid = True
global_submit_message_id = 0


class Telephone(StatesGroup):
    telephone = State()


class Comment(StatesGroup):
    comment = State()

    # async def mailingFunc():
    #     print("mailing")
    #     r = requests.get(f"{req_url}order/tomorrow")
    #     orders = json.loads(r.text)
    #     if len(orders) > 0:
    #         for order in orders:
    #             chat_id = int(order["clientChatId"])
    #             time = order["dateTime"].split(", ")[1]
    #             master_name = order["masterName"]
    #             services_info = order["servicesInfo"]
    #             await message.answer(
    #                 chat_id,
    #                 f"📌 Вы записаны на завтра на {time} к {master_name}\nВыбранные услуги: {services_info}",
    #             )

    # async def checkSubscription():
    #     r = requests.get(f"{req_url}admin/info")
    #     pay_date = json.loads(r.text)["payDate"]
    #     tomorrow = datetime.now() + timedelta(days=1)
    #     tomorrow = "{:%Y-%m-%d}".format(tomorrow)
    #     today = datetime.now()
    #     today = "{:%Y-%m-%d}".format(today)
    #     if pay_date == tomorrow:
    #         await message.answer(
    #             admin_chat_id, "❗️ Завтра заканчивается оплаченная подписка"
    #         )
    #     elif pay_date == today:
    #         editAdminData = {}
    #         editAdminData["BotPaid"] = "false"
    #         r = requests.patch(f"{req_url}admin/edit", editAdminData)
    #         print(r.text)

    # async def scheduler():
    #     schedule.every().day.at("17:00").do(mailingFunc)
    #     schedule.every().day.at("18:00").do(checkSubscription)
    #     while True:
    #         await schedule.run_pending()
    #         await asyncio.sleep(1)

    # async def on_startup(_):
    # asyncio.create_task(scheduler())
    # print("бот онлайн")


@router.message(CommandStart())
async def begin(message: types.Message):
    global global_is_paid
    r = requests.get(f"{req_url}admin/info")
    global_is_paid = json.loads(r.text)["BotPaid"] == "true"
    if global_is_paid:
        await message.answer(
            "Привет! Нажми на кнопку, чтобы записаться в салон онлайн!",
            reply_markup=web_markup,
        )
    else:
        await message.answer(
            "Привет! В данный момент бот недоступен, скоро всё починим",
        )


@router.message(Command("services"))
async def get_categories(message: types.Message):
    global global_services_message_id
    r = requests.get(f"{req_url}category/all")
    data = json.loads(r.text)
    categories_markup = InlineKeyboardMarkup(resize_keyboard=True, row_width=2)
    for category in data:
        category_btn = InlineKeyboardButton(
            category["title"],
            callback_data=f"category_{category['id']}_{category['title']}",
        )
        categories_markup.add(category_btn)

    await message.answer(
        "📘 Выберите категорию",
        reply_markup=categories_markup,
    )

    global_services_message_id = 0


@router.message(Command("specialists"))
async def get_spec(message: types.Message):
    r = requests.get(f"{req_url}specialist/all")
    specialists = json.loads(r.text)
    specs_info = "🔷 Список специалистов:\n\n"
    for specialist in specialists:
        specs_info += f"🔹 {specialist['name']}, {specialist['qualification']}\n"
    await message.answer(specs_info, parse_mode="html")


@router.message(Command(f"admin_{pincode}"))
async def admin_panel(message: types.Message):
    await message.answer(
        "Чтобы перейти в админ панель, нажмите на кнопку снизу",
        reply_markup=admin_markup,
    )


@router.message(F.text)
async def text(message: types.Message):
    if message.text == "Привет":
        await message.answer("Привет!")
    if message.text == "📋 Мои записи":
        username = message.from_user.username
        r = requests.get(f"{req_url}order/chat/{message.chat.id}")
        r_general = requests.get(f"{req_url}general/info")
        company_address = json.loads(r_general.text)["companyAddress"]
        orders = json.loads(r.text)
        if len(orders) > 0:
            for order in orders:
                date = order["dateTime"].split(",")[0]
                time = order["dateTime"].split(", ")[1]
                curWeekDay = datetime.strptime(date, "%Y-%m-%d").weekday()
                cancel_order_btn = InlineKeyboardButton(
                    "🚫 Отменить запись",
                    callback_data="delete_{id}_{totalTime}".format(
                        id=order["id"], totalTime=order["totalTime"]
                    ),
                )
                cancel_order_markup = InlineKeyboardMarkup(resize_keyboard=True).add(
                    cancel_order_btn
                )
                await message.answer(
                    "📘 Запись\n\n🔹 Дата и время: {date} {month}, {day}, в {time}\n🔹 Мастер: {master_name}\n🔹 Услуга(и): {service_info}\n🔹 Адрес: {company_address}".format(
                        date=date.split("-")[2],
                        month=months[int(date.split("-")[1]) - 1],
                        day=days[curWeekDay],
                        time=time,
                        master_name=order["masterName"],
                        service_info=order["servicesInfo"],
                        company_address=company_address,
                    ),
                    parse_mode="html",
                    reply_markup=cancel_order_markup,
                )
        else:
            await message.answer("💥 Активных записей нет")
    if message.text == "📝 О нас":
        r_general = requests.get(f"{req_url}general/info")
        company_desc = json.loads(r_general.text)["companyDescription"]
        await message.answer(company_desc)
    if message.text == "📞 Позвонить":
        r = requests.get(f"{req_url}general/info")
        phone_num = json.loads(r.text)["companyTelephone"]
        await message.answer(f"Номер компании: {phone_num}")
    if message.text == "🎟 Управление подпиской":
        await message.answer(
            "🎟 Меню управления подпиской",
            reply_markup=pay_markup,
        )
    if message.text == "⬅️ Назад":
        await message.answer("Вы вышли в главное меню", reply_markup=admin_markup)
    if message.text == "🗓 Дата списания":
        r = requests.get(f"{req_url}admin/info")
        payDate = json.loads(r.text)["payDate"]
        await message.answer(
            f"🗓 Дата списания: {payDate}",
        )
    if message.text == "💳 Оплатить":
        if int(number_of_spec) <= 5:
            cur_prices = prices[0]
        elif int(number_of_spec) <= 10:
            cur_prices = prices[1]
        elif int(number_of_spec) <= 15:
            cur_prices = prices[2]
        elif int(number_of_spec) > 15:
            cur_prices = prices[3]

        three_economy = int(
            (
                (cur_prices["month"] * 3 - cur_prices["three_months_full"])
                / (cur_prices["month"] * 3)
            )
            * 100
        )
        six_economy = int(
            (
                (cur_prices["month"] * 6 - cur_prices["six_months_full"])
                / (cur_prices["month"] * 6)
            )
            * 100
        )
        year_economy = int(
            (
                (cur_prices["month"] * 12 - cur_prices["year_full"])
                / (cur_prices["month"] * 12)
            )
            * 100
        )

        await message.answer(
            f"📌 Выберите опцию:\n\n💥 1 месяц - {cur_prices['month']} ₽/мес. ({cur_prices['month']} ₽ разовый платёж)\n\n💥 3 месяца - {cur_prices['three_months']} ₽/мес. 🔥Экономия {three_economy}%🔥 ({cur_prices['three_months_full']} ₽ разовый платёж)\n\n💥 6 месяцев - {cur_prices['six_months']} ₽/мес. 🔥Экономия {six_economy}%🔥 ({cur_prices['six_months_full']} ₽ разовый платёж)\n\n💥 1 год - {cur_prices['year']} ₽/мес. 🔥Экономия {year_economy}%🔥 ({cur_prices['year_full']} ₽ разовый платёж)",
            reply_markup=pay_choice_markup,
            parse_mode="html",
        )
    if message.text.startswith("запись") or message.text.startswith("Запись"):
        global global_is_paid
        r = requests.get(f"{req_url}admin/info")
        global_is_paid = json.loads(r.text)["BotPaid"] == "true"
        if global_is_paid:
            await message.answer("⏳ Обработка запроса, подождите")
            regen_counter = 3
            r = requests.get(f"{req_url}services/all")
            services = json.loads(r.text)
            services_titles = []
            for service in services:
                services_titles.append(service["title"])
            today = datetime.now()
            today = "{:%Y-%m-%d}".format(today)

            async def req_bai_chat_func():
                await bot.send_chat_action(message.chat.id, "typing")
                prompt = f"можешь трансформировать сообщение: '{message.text}' в формат json, по следующему типу ['date': '' , 'time': '', 'masterName': '', 'services': '[]'], где date запиши в формате: гггг-мм-дд, учитывая что сегодняшняя дата это {today}. лишних нулей перед часами в time не ставь. service выбери наиболее подходящее название из следующего списка названий: {services_titles}, просто скопируй это название и вставь в поле service, без каких-либо искажений слов, проверь правописание скопиранного. А имя мастера переведи в именительный падеж и напиши с заглавной буквы. Отправь сообщение без лишних слов и без каких-либо объяснений, просто выдай мне json, предварительно проверив грамматическую правильность написанного"
                reply = ""
                try:
                    for token in Completion.create(prompt):
                        print(token, end="", flush=True)
                        reply += token
                    print("")
                except:
                    print("error")
                return reply

            async def req_bai_chat():
                reply = await req_bai_chat_func()
                reply_data = json.loads(reply)
                all_services_exist = True
                index = 0
                for service in reply_data["services"]:
                    while service not in services_titles:
                        reply = await req_bai_chat_func()
                        reply_data = json.loads(reply)
                global global_services, global_master_name
                global_services = reply_data["services"]
                global_master_name = reply_data["masterName"]
                check_time = InlineKeyboardButton(
                    "🕹 Проверить доступность записи",
                    callback_data=f"checkavailable_{reply_data['date']}_{reply_data['time']}",
                )
                ai_reply_markup = InlineKeyboardMarkup(
                    resize_keyboard=True, row_width=1
                ).add(check_time)
                cur_services_titles = ""
                for idx, service in enumerate(reply_data["services"]):
                    if idx == len(reply_data["services"]) - 1:
                        cur_services_titles += service
                    else:
                        cur_services_titles += service + ", "
                await bot.send_chat_action(message.chat.id, "typing")
                await message.answer(
                    f"❗️ Проверьте данные записи\n\n📅 Дата и время: {reply_data['date']}, {reply_data['time']}\n🧑🏻 Специалист: {reply_data['masterName']}\n✂️ Услуги: {cur_services_titles}\n\n📍 Если данные неверны, отправьте новый запрос",
                    parse_mode="html",
                    reply_markup=ai_reply_markup,
                )
                return True

            try:
                await req_bai_chat()
            except:
                for i in range(regen_counter):
                    try:
                        finished = await req_bai_chat()
                        if finished:
                            break
                    except:
                        print("error occured with requesting", i)
                        if i == 2:
                            await message.answer(
                                "❌ Возникла ошибка, попробуйте еще раз",
                            )
        else:
            await message.answer("🫥 В данный момент бот недоступен, скоро всё починим")


@router.message(F.content_type == ContentType.WEB_APP_DATA)
async def send_data(message: types.Message):
    orderData = json.loads(message.web_app_data.data)
    cancel_order_btn = InlineKeyboardButton(
        "🚫 Отменить запись",
        callback_data="delete_{id}_{totalTime}".format(
            id=orderData["orderId"], totalTime=orderData["totalTime"]
        ),
    )
    cancel_order_markup = InlineKeyboardMarkup(resize_keyboard=True).add(
        cancel_order_btn
    )
    print(orderData["orderId"], orderData)
    editOrderData = {"orderId": orderData["orderId"], "clientChatId": message.chat.id}
    r = requests.patch(f"{req_url}order/edit", data=editOrderData)
    await message.answer(orderData["message"], reply_markup=cancel_order_markup)
    await message.answer(admin_chat_group_id, orderData["adminMessage"])


@router.callback_query(F.data.startswith("delete_"))
async def delete_order(callback: types.CallbackQuery):
    orderId = int(callback.data.split("_")[1])
    totalTime = int(callback.data.split("_")[2])
    returnTimeData = {}
    returnTimeData["orderId"] = orderId
    returnTimeData["totalTime"] = totalTime
    rtime = requests.patch(f"{req_url}dates/returnTime", data=returnTimeData)
    r = requests.delete(f"{req_url}order/del/{orderId}")
    if r.status_code == 200:
        await callback.answer()
        await callback.message.answer(
            callback.from_user.id, "✅ Запись успешно отменена"
        )
        await callback.message.answer(
            admin_chat_group_id,
            f"🚫 Запись на {json.loads(r.text)['dateTime']} отменена",
        )
    else:
        await callback.answer()
        await callback.message.answer(
            callback.from_user.id, "🚫 Возникла ошибка, попробуйте ещё раз"
        )


@router.pre_checkout_query()
async def process_pre_checkout_query(pre_checkout_query: types.PreCheckoutQuery):
    await bot.answer_pre_checkout_query(pre_checkout_query.id, ok=True)


@router.message(F.content_type == ContentType.SUCCESSFUL_PAYMENT)
async def proccess_pay(message: types.Message):
    if message.successful_payment.invoice_payload == "month_sub":
        await message.answer(
            "✅ Подписка успешно оплачена",
        )
        new_pay_month = str(datetime.now().month + 1)
        if len(new_pay_month) == 1:
            new_pay_month = "0" + new_pay_month
        today = datetime.now()
        new_pay_date = "{:%Y-%m-%d}".format(today)
        old_pay_month = new_pay_date.split("-")[1]
        new_pay_date = new_pay_date.replace(old_pay_month, new_pay_month)
        editAdminData = {"BotPaid": "true", "payDate": new_pay_date, "billId": "none"}
        requests.patch(f"{req_url}admin/edit", editAdminData)
    elif message.successful_payment.invoice_payload == "three_month_sub":
        await message.answer(
            "✅ Подписка успешно оплачена",
        )
        new_pay_month = str(datetime.now().month + 3)
        if len(new_pay_month) == 1:
            new_pay_month = "0" + new_pay_month
        today = datetime.now()
        new_pay_date = "{:%Y-%m-%d}".format(today)
        old_pay_month = new_pay_date.split("-")[1]
        new_pay_date = new_pay_date.replace(old_pay_month, new_pay_month)
        editAdminData = {"BotPaid": "true", "payDate": new_pay_date, "billId": "none"}
        requests.patch(f"{req_url}admin/edit", editAdminData)
    elif message.successful_payment.invoice_payload == "six_month_sub":
        await message.answer(
            "✅ Подписка успешно оплачена",
        )
        new_pay_month = str(datetime.now().month + 6)
        if len(new_pay_month) == 1:
            new_pay_month = "0" + new_pay_month
        today = datetime.now()
        new_pay_date = "{:%Y-%m-%d}".format(today)
        old_pay_month = new_pay_date.split("-")[1]
        new_pay_date = new_pay_date.replace(old_pay_month, new_pay_month)
        editAdminData = {"BotPaid": "true", "payDate": new_pay_date, "billId": "none"}
        requests.patch(f"{req_url}admin/edit", editAdminData)
    elif message.successful_payment.invoice_payload == "year_sub":
        await message.answer(
            "✅ Подписка успешно оплачена",
        )
        new_pay_month = str(datetime.now().month + 12)
        if len(new_pay_month) == 1:
            new_pay_month = "0" + new_pay_month
        today = datetime.now()
        new_pay_date = "{:%Y-%m-%d}".format(today)
        old_pay_month = new_pay_date.split("-")[1]
        new_pay_date = new_pay_date.replace(old_pay_month, new_pay_month)
        editAdminData = {"BotPaid": "true", "payDate": new_pay_date, "billId": "none"}
        requests.patch(f"{req_url}admin/edit", editAdminData)


@router.callback_query(F.data.startswith("checkavailable_"))
async def check_time(callback: types.CallbackQuery):
    global global_submit_message_id
    date = callback.data.split("_")[1]
    time = callback.data.split("_")[2]
    masterName = global_master_name
    req_data = {"specialistName": masterName, "date": date, "time": time}
    r = requests.post(f"{req_url}dates/check/", data=req_data)
    submit_btn = InlineKeyboardButton(
        "✅ Подтвердить запись", callback_data=f"submit_{date}_{time}"
    )
    ai_reply_markup = InlineKeyboardMarkup(resize_keyboard=True, row_width=1).add(
        submit_btn
    )
    res = json.loads(r.text)
    spec_req_data = {"name": masterName, "services": global_services}
    req_spec_check = requests.post(f"{req_url}specialist/cando", spec_req_data)
    spec_check = json.loads(req_spec_check.text)
    if (
        type(res) is not bool
        and res["status"] == 404
        and res["message"] == "specialist is not found"
    ):
        await callback.answer()
        await message.answer(
            callback.from_user.id,
            "🔴 Выбранного специалиста не существует, отправьте новый запрос",
            reply_markup=show_spec_markup,
        )
    else:
        if spec_check["isMatching"] == True:
            if res == False:
                await callback.answer()
                submitMessage = await message.answer(
                    callback.from_user.id,
                    "🟢 Запись доступна ",
                    reply_markup=ai_reply_markup,
                )
                global_submit_message_id = submitMessage.message_id
            elif res == True:
                await time_busy_message("занято", callback, masterName, date)
            elif res["status"] == 404 and res["message"] == "specialist is not found":
                await callback.answer()
                await message.answer(
                    callback.from_user.id,
                    "🔴 Выбранного специалиста не существует, отправьте новый запрос",
                    reply_markup=show_spec_markup,
                )
            elif res["status"] == 400 and res["message"] == "Invalid time":
                await time_busy_message("недоступно", callback, masterName, date)
            elif res["status"] == 400 and res["message"] == "Is not working hours":
                await time_busy_message(
                    "не входит в рабочие часы", callback, masterName, date
                )
            elif (
                res["status"] == 400
                and res["message"] == "Can not request not more than one month further"
            ):
                await callback.answer()
                await message.answer(
                    callback.from_user.id,
                    "🔴 Запись более чем на месяц вперёд невозможна, отправьте новый запрос",
                )
            elif res["status"] == 406 and res["message"] == "Date is not working":
                await callback.answer()
                spec_data = {}
                spec_data["name"] = masterName
                spec = requests.post(f"{req_url}specialist/single/", data=spec_data)
                spec_id = json.loads(spec.text)["id"]
                show_dates_btn = InlineKeyboardButton(
                    "📆 Показать рабочие дни", callback_data=f"showdates_{spec_id}"
                )
                show_dates_markup = InlineKeyboardMarkup(row_width=1).add(
                    show_dates_btn
                )
                await message.answer(
                    callback.from_user.id,
                    "🔴 Данный день является нерабочим у выбранного специалиста",
                    reply_markup=show_dates_markup,
                )
        elif spec_check["isMatching"] == False:
            await callback.answer()
            await message.answer(
                callback.from_user.id,
                "🔴 Специалист не может выполнить выбранные услуги, отправьте запрос заново",
                reply_markup=show_spec_markup,
            )


@router.callback_query(F.data.startswith("show_spec"))
async def show_spec(callback: types.CallbackQuery):
    r = requests.get(f"{req_url}specialist/all")
    specialists = json.loads(r.text)
    specs_info = "🔷 Список специалистов:\n\n"
    for specialist in specialists:
        await callback.answer()
        specs_info += f"🔹 {specialist['name']}, {specialist['qualification']}\n"
    await message.answer(callback.from_user.id, specs_info, parse_mode="html")


@router.callback_query(F.data.startswith("showtime"))
async def show_time(callback: types.CallbackQuery):
    date = callback.data.split("_")[1]
    spec_id = callback.data.split("_")[2]
    r = requests.get(f"{req_url}dates/{date}/{spec_id}")
    r = json.loads(r.text)
    morning_time = r["morningTime"]
    afternoon_time = r["afternoonTime"]
    evening_time = r["eveningTime"]
    available_time = (
        f"🟢 Свободное время на {date[-2:]} {months[int(date[5:-3]) - 1]}\n\n🌅 Утро:\n"
    )
    for time in morning_time:
        if "disabled" not in time:
            available_time += time + ", "
    available_time = available_time[:-2] + "\n\n"
    available_time += "🏞 День\n"
    for time in afternoon_time:
        if "disabled" not in time:
            available_time += time + ", "
    available_time = available_time[:-2] + "\n\n"
    available_time += "🌄 Вечер\n"
    for time in evening_time:
        if "disabled" not in time:
            available_time += time + ", "
    available_time = available_time[:-2]
    await callback.answer()
    await message.answer(callback.from_user.id, available_time, parse_mode="html")


@router.callback_query(F.data.startswith("showdates"))
async def show_dates(callback: types.CallbackQuery):
    spec_id = callback.data.split("_")[1]
    r = requests.get(f"{req_url}dates/avdates/{spec_id}")
    dates = json.loads(r.text)
    dates_text = "🟢Список рабочих дней:\n\n"
    index = 0
    for date in dates:
        index += 1
        curMonth = months[int(date["fullDate"][5:7]) - 1]
        if index % 5 == 0:
            dates_text += "📆 " + str(int(date["fullDate"][8:])) + " " + curMonth + "\n"
        else:
            dates_text += "📆 " + str(int(date["fullDate"][8:])) + " " + curMonth + ", "
    if dates_text[-2] == ",":
        dates_text = dates_text[:-2]
    elif dates_text[-3] == ",":
        dates_text = dates_text[:-3]
    await callback.answer()
    await callback.message.answer(dates_text, parse_mode="html")


@router.callback_query(F.data.startswith("submit"))
async def submit_order(callback: types.CallbackQuery):
    global global_order_data
    await Telephone.telephone.set()
    await callback.message.answer("📞 Введите ваш номер телефона")

    user_telegram = callback.from_user.username
    user_name = callback.from_user.first_name
    chat_id = callback.from_user.id

    date = callback.data.split("_")[1]
    cur_week_day = datetime.strptime(date, "%Y-%m-%d").date().weekday()
    time = callback.data.split("_")[2]

    spec_data = {}
    spec_data["name"] = global_master_name
    spec = requests.post(f"{req_url}specialist/single/", data=spec_data)

    spec_id = json.loads(spec.text)["id"]
    general_info = requests.get(f"{req_url}general/info")
    address = json.loads(general_info.text)["companyAddress"]

    services_ids = []
    for service in global_services:
        req_data = {"title": service}
        r = requests.post(f"{req_url}services/title", req_data)
        service_id = json.loads(r.text)["id"]
        services_ids.append(service_id)

    time_req = requests.get(f"{req_url}dates/{date}/{spec_id}")
    morning_time = json.loads(time_req.text)["morningTime"]
    afternoon_time = json.loads(time_req.text)["afternoonTime"]
    evening_time = json.loads(time_req.text)["eveningTime"]

    await bot.edit_message_reply_markup(
        callback.from_user.id, global_submit_message_id, submited_markup
    )

    await callback.answer()
    global_order_data = {
        "name": user_name,
        "telegram": user_telegram,
        "telephone": global_telephone,
        "comment": global_comment,
        "chatId": chat_id,
        "address": address,
        "masterId": spec_id,
        "masterName": global_master_name,
        "curTime": time,
        "curDate": date,
        "curWeekDay": cur_week_day,
        "servicesIds": services_ids,
        "morningTime": morning_time,
        "afternoonTime": afternoon_time,
        "eveningTime": evening_time,
    }


@router.callback_query(F.data.startswith("category_"))
async def get_services(callback: types.CallbackQuery):
    global global_services_message_id

    id = int(callback.data.split("_")[1])
    title = callback.data.split("_")[2]
    r = requests.get(f"{req_url}services/all/{id}")
    data = json.loads(r.text)
    service_titles = f"🔷 {title}:\n"
    price_text = ""
    for service in data:
        if int(service["price"]) == int(service["priceSecond"]):
            price_text = str(service["price"])
        else:
            price_text = str(service["price"]) + " - " + str(service["priceSecond"])
        service_titles += (
            "🔹 "
            + service["title"]
            + " ("
            + service["time"]
            + ")"
            + ": "
            + price_text
            + " ₽"
            + "\n"
        )
    await callback.answer()
    if global_services_message_id == 0:
        sent_message = await callback.message.answer(service_titles, parse_mode="html")
        global_services_message_id = sent_message.message_id
    else:
        try:
            await callback.message.edit_text(
                service_titles,
            )
        except:
            print("error occured with editing message")


@router.callback_query(F.data.startswith("pay_"))
async def pay_func(callback: types.CallbackQuery):
    duration = callback.data.split("_")[1]
    if int(number_of_spec) <= 5:
        cur_prices = prices[0]
    elif int(number_of_spec) <= 10:
        cur_prices = prices[1]
    elif int(number_of_spec) <= 15:
        cur_prices = prices[2]
    elif int(number_of_spec) > 15:
        cur_prices = prices[3]
    if duration == "month1":
        await callback.answer()
        await bot.send_invoice(
            chat_id=callback.from_user.id,
            title="Месячная подписка Client Connect",
            description="Оформление месячной подписки на услуги бота",
            payload="month_sub",
            provider_token=ukassa_token,
            currency="RUB",
            start_parameter="clientconnect_bot",
            prices=[{"label": "Руб", "amount": int(str(cur_prices["month"]) + "00")}],
        )
    elif duration == "month3":
        await callback.answer()
        await bot.send_invoice(
            chat_id=callback.from_user.id,
            title="Подписка Client Connect на 3 месяца",
            description="Оформление 3-х месячной подписки на услуги бота",
            payload="three_month_sub",
            provider_token=ukassa_token,
            currency="RUB",
            start_parameter="clientconnect_bot",
            prices=[
                {
                    "label": "Руб",
                    "amount": int(str(cur_prices["three_months_full"]) + "00"),
                }
            ],
        )
    elif duration == "month6":
        await callback.answer()
        await bot.send_invoice(
            chat_id=callback.from_user.id,
            title="Подписка Client Connect на 6 месяцев",
            description="Оформление 6-ти месячной подписки на услуги бота",
            payload="six_month_sub",
            provider_token=ukassa_token,
            currency="RUB",
            start_parameter="clientconnect_bot",
            prices=[
                {
                    "label": "Руб",
                    "amount": int(str(cur_prices["six_months_full"]) + "00"),
                }
            ],
        )
    elif duration == "year":
        await callback.answer()
        await bot.send_invoice(
            chat_id=callback.from_user.id,
            title="Подписка Client Connect на 1 год",
            description="Оформление годовой месячной подписки на услуги бота",
            payload="year_sub",
            provider_token=ukassa_token,
            currency="RUB",
            start_parameter="clientconnect_bot",
            prices=[
                {"label": "Руб", "amount": int(str(cur_prices["year_full"]) + "00")}
            ],
        )


# state handlers
@router.message(Telephone.telephone)
async def load_telephone(message: types.Message, state: Telephone.telephone):
    global global_telephone
    global_telephone = message.text
    await state.finish()
    await Comment.comment.set()
    await message.answer("💬 Введите комментарий к записи")


@router.message(Comment.comment)
async def load_comment(message: types.Message, state: Comment.comment):
    global global_comment
    global_comment = message.text
    await state.finish()
    await message.answer("⏳ Обработка записи, подождите")
    await send_order_func(
        global_order_data["name"],
        global_order_data["telegram"],
        global_telephone,
        global_comment,
        global_order_data["chatId"],
        global_order_data["address"],
        global_order_data["masterId"],
        global_order_data["masterName"],
        global_order_data["curTime"],
        global_order_data["curDate"],
        global_order_data["curWeekDay"],
        global_order_data["servicesIds"],
        global_order_data["morningTime"],
        global_order_data["afternoonTime"],
        global_order_data["eveningTime"],
    )
