from aiogram import Dispatcher, Bot
import asyncio
import logging

from aiogram.fsm.storage.memory import MemoryStorage
import environ
from bot_script import router

env = environ.Env()
environ.Env().read_env()

storage = MemoryStorage()
# create bot
web_url = env("web_url")
bot = Bot(token=env("bot_token"))
dp = Dispatcher(bot=bot, storage=storage)


async def main():
    dp.include_router(router)
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Exit")
