from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

router = Router()

@router.message(Command("start"))
async def cmd_start(message: Message):
    """
    Handle /start command.
    """
    welcome_text = (
        "👋 <b>Welcome to the Media Downloader Bot!</b>\n\n"
        "Send me a link to:\n"
        "• YouTube videos or playlists\n"
        "• Instagram posts or reels\n"
        "• Pinterest video pins\n\n"
        "I'll download and send them back to you! 🚀"
    )
    await message.answer(welcome_text, parse_mode="HTML")
