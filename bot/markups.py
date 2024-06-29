from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    ReplyKeyboardMarkup,
    KeyboardButton,
)
import environ

env = environ.Env()
environ.Env().read_env()

web_url = env("web_url")


# request_btn = KeyboardButton("✉️ Заявка на получение бота")
# test_btn = KeyboardButton("🎲 Пример работы бота")
# start_markup = ReplyKeyboardMarkup(resize_keyboard=True, row_width=1).add(
#     request_btn, test_btn
# )

web_markup = ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(text="📘 Онлайн запись", web_app={"url": web_url}),
            KeyboardButton(text="📝 О нас"),
        ],
        [KeyboardButton(text="📋 Мои записи"), KeyboardButton(text="📞 Позвонить")],
    ],
    resize_keyboard=True,
)

admin_markup = ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(text="💻 Админ панель", web_app={"url": web_url + "admin"}),
        ],
        [KeyboardButton(text="🎟 Управление подпиской")],
    ],
    resize_keyboard=True,
)

pay_markup = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="⬅️ Назад")],
        [KeyboardButton(text="💳 Оплатить"), KeyboardButton(text="🗓 Дата списания")],
    ],
    resize_keyboard=True,
)

show_spec_markup = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🧑🏻 Показать всех специалистов", callback_data="show_spec"
            )
        ]
    ],
    resize_keyboard=True,
)

pay_choice_markup = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="🗓 1 месяц", callback_data="pay_month1"),
            InlineKeyboardButton(text="🗓 3 месяца", callback_data="pay_month3"),
        ],
        [
            InlineKeyboardButton(text="🗓 6 месяцев", callback_data="pay_month6"),
            InlineKeyboardButton(text="🗓 1 год", callback_data="pay_year"),
        ],
    ],
    resize_keyboard=True,
)

submited_markup = InlineKeyboardMarkup(
    inline_keyboard=[[InlineKeyboardButton(text="⬇️ Следуйте инструкциям ниже")]],
    resize_keyboard=True,
)
