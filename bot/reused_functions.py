import requests
import json
import environ
from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup

from create_bot import bot

from calendar_arrays import months, days

env = environ.Env()
environ.Env().read_env()

req_url = env("request_url")
admin_chat_group_id = env("admin_chat_group_id")
headers = {"Content-Type": "application/json"}


async def time_busy_message(timeStatus, callback, masterName, date):
    await callback.answer()
    spec_data = {}
    spec_data["name"] = masterName
    spec = requests.post(f"{req_url}specialist/single/", data=spec_data)
    spec_id = json.loads(spec.text)["id"]
    show_available_time_btn = InlineKeyboardButton(
        "🕔 Показать свободное время на этот день",
        callback_data=f"showtime_{date}_{spec_id}",
    )
    show_available_time_markup = InlineKeyboardMarkup(
        resize_keyboard=True, row_width=1
    ).add(show_available_time_btn)
    await callback.message.answer(
        callback.from_user.id,
        f"🔴 Время {timeStatus}, отправьте новый запрос",
        reply_markup=show_available_time_markup,
    )


async def send_order_func(
    name,
    telegram,
    telephone,
    comment,
    chat_id,
    companyAddress,
    masterId,
    masterName,
    curTime,
    curDate,
    curWeekDay,
    curServiceIds,
    morningTime,
    afternoonTime,
    eveningTime,
):
    services = []
    servicesInfo = ""
    totalPrice = 0
    totalSecondPrice = 0
    totalTime = 0
    orderId = 0

    newMorningTime = morningTime.copy()
    newAfternoonTime = afternoonTime.copy()
    newEveningTime = eveningTime.copy()

    async def get_service_info():
        nonlocal services, servicesInfo, totalPrice, totalSecondPrice, totalTime
        print(f"{req_url}services/{str(curServiceIds)[1:-1]}")

        response = requests.get(f"{req_url}services/{str(curServiceIds)[1:-1]}")
        services = json.loads(response.text)
        if len(services) > 0:
            for index, service in enumerate(services):
                time = service["time"]
                price = service["price"]
                priceSec = service["priceSecond"]
                title = service["title"]
                hours = 0
                minutes = 0
                timeFirst = time.split(" ")[0]
                if "ч" in timeFirst:
                    hours = int(timeFirst.replace("ч", ""))
                elif "м" in timeFirst:
                    minutes = int(timeFirst.replace("м", ""))
                if len(time.split(" ")) > 1:
                    minutes = int(time.split(" ")[1].replace("м", ""))
                totalTime += hours * 60 + minutes
                totalPrice += price
                totalSecondPrice += priceSec

                if int(price) == int(priceSec):
                    price_text = str(price)
                else:
                    price_text = str(price) + " - " + str(priceSec)

                if len(services) - 1 == index:
                    servicesInfo += title + ": " + price_text + " ₽"
                else:
                    servicesInfo += title + ": " + price_text + " ₽" + ", "

    async def send_order_to_db():
        nonlocal orderId
        await get_service_info()
        submit_data = {
            "clientName": name,
            "clientTelegram": telegram,
            "clientTelephone": telephone,
            "clientComment": comment,
            "clientChatId": str(chat_id),
            "masterId": masterId,
            "masterName": masterName,
            "totalTime": totalTime,
            "dateTime": f"{curDate}, {curTime}",
            "servicesInfo": servicesInfo,
            "totalPrice": totalPrice,
            "servicesCount": len(services),
        }
        response = requests.post(
            f"{req_url}order/add", headers=headers, data=json.dumps(submit_data)
        )
        data = json.loads(response.text)
        print(data)
        orderId = data["id"]

    await send_order_to_db()

    async def send_client_info():
        client_data = {
            "name": name,
            "telephoneNumber": telephone,
            "telephoneName": telegram,
            "chatId": chat_id,
        }
        client_data["name"] = name
        client_data["telephoneNumber"] = telephone
        client_data["telephoneName"] = telegram
        client_data["chatId"] = chat_id
        response = requests.post(
            f"{req_url}client/add", headers=headers, data=json.dumps(client_data)
        )

    await send_client_info()

    async def update_time_db():
        nonlocal newMorningTime, newAfternoonTime, newEveningTime
        repeatDisableTime = int(totalTime / 30)
        if curTime in morningTime:
            for i in range(repeatDisableTime):
                index = morningTime.index(curTime) + i
                if len(newMorningTime) > index:
                    print(newMorningTime[index])
                    if "disabled" not in newMorningTime[index]:
                        newMorningTime[index] = f"disabled {newMorningTime[index]}"
                if len(newMorningTime) <= index:
                    newI = repeatDisableTime - i
                    for i in range(newI):
                        if "disabled" not in newAfternoonTime[i]:
                            newAfternoonTime[i] = f"disabled {newAfternoonTime[i]}"
                    break
        elif curTime in afternoonTime:
            for i in range(repeatDisableTime):
                index = afternoonTime.index(curTime) + i
                if len(newAfternoonTime) > index:
                    if "disabled" not in newAfternoonTime[index]:
                        newAfternoonTime[index] = f"disabled {newAfternoonTime[index]}"
                if len(newAfternoonTime) <= index:
                    newI = repeatDisableTime - i
                    for i in range(newI):
                        if "disabled" not in newEveningTime[i]:
                            newEveningTime[i] = f"disabled {newEveningTime[i]}"
                    break
        elif curTime in eveningTime:
            for i in range(repeatDisableTime):
                index = eveningTime.index(curTime) + i
                if len(newEveningTime) > index:
                    if "disabled" not in newEveningTime[index]:
                        newEveningTime[index] = f"disabled {newEveningTime[index]}"

        time_data = {}
        time_data["date"] = curDate
        time_data["specialistId"] = masterId
        time_data["morningTime"] = newMorningTime
        time_data["afternoonTime"] = newAfternoonTime
        time_data["eveningTime"] = newEveningTime
        r = requests.patch(
            f"{req_url}dates/editTime", headers=headers, data=json.dumps(time_data)
        )
        print(r.text)

    await update_time_db()

    cancel_order_btn = InlineKeyboardButton(
        "🚫 Отменить запись",
        callback_data=f"delete_{orderId}_{totalTime}",
    )
    cancel_order_markup = InlineKeyboardMarkup(resize_keyboard=True).add(
        cancel_order_btn
    )

    message = "✅ Ваша заявка принята!\n\nДополнительного подтверджения по телефону не требуется!\n\n📘 Мы ожидаем Вас:\n🔹 Дата и время: {cur_date} {cur_month}, {cur_week_day}, в {curTime}\n🔹 Мастер: {masterName}\n🔹 Услуга(и): {servicesInfo}\n🔹 Адрес: {companyAddress}\n\n⭐️ Вы будете уведомлены о записи предварительно за 24 часа до визита!".format(
        cur_date=curDate[-2:],
        cur_month=months[int(curDate[5:-3]) - 1],
        cur_week_day=days[curWeekDay],
        curTime=curTime,
        masterName=masterName,
        servicesInfo=servicesInfo,
        companyAddress=companyAddress,
    )

    totalFinalPrice = 0
    if totalPrice == totalSecondPrice:
        totalFinalPrice = totalPrice
    else:
        totalFinalPrice = str(totalPrice) + " - " + str(totalSecondPrice)
    adminMessage = "❇️ Новая заявка\n\n🧍‍♂️ От: {name}\n✉️ Телеграм клиента: {telegram}\n📞 Телефон клиента: {telephone}\n💬 Комментарий: {comment}\n\n👨‍⚕️ Специалист: {masterName}\n🗓 Дата и время: {curDate} {curMonth}, {curDay}, в {curTime}\n🛠 Услуга(и): {servicesInfo}\n💵 Стоимость услуг: {totalPrice}₽\n".format(
        name=name,
        telegram=telegram,
        telephone=telephone,
        comment=comment,
        masterName=masterName,
        curDate=curDate[-2:],
        curMonth=months[int(curDate[5:-3]) - 1],
        curDay=days[curWeekDay],
        curTime=curTime,
        servicesInfo=servicesInfo,
        totalPrice=totalFinalPrice,
    )

    await bot.send_message(
        chat_id, message, reply_markup=cancel_order_markup, parse_mode="html"
    )
    await bot.send_message(admin_chat_group_id, adminMessage, parse_mode="html")
