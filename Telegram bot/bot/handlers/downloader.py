import re
import logging
from aiogram import Router, F
from aiogram.types import Message

from bot.keyboards.inline import get_format_keyboard
from bot.utils.rate_limit import RateLimiter
from bot.config import USER_COOLDOWN_SECONDS

router = Router()
logger = logging.getLogger(__name__)

# URL patterns for different platforms
URL_PATTERNS = {
    "youtube": re.compile(r'(https?://)?(www\.)?(youtube\.com|youtu\.be)/.+'),
    "instagram": re.compile(r'(https?://)?(www\.)?instagram\.com/.+'),
    "pinterest": re.compile(r'(https?://)?(www\.)?pinterest\.com/.+'),
}

# Initialize rate limiter
rate_limiter = RateLimiter(USER_COOLDOWN_SECONDS)

def detect_url(text: str) -> tuple[bool, str | None]:
    """
    Detect if message contains a supported URL.
    Returns (is_valid, platform_name)
    """
    for platform, pattern in URL_PATTERNS.items():
        if pattern.search(text):
            return True, platform
    return False, None

@router.message(F.text)
async def handle_url(message: Message):
    """
    Handle incoming messages that might contain URLs.
    """
    if not message.text:
        return
    
    # Check if message contains a URL
    is_url, platform = detect_url(message.text)
    
    if not is_url:
        await message.answer("❌ Please send a valid YouTube, Instagram, or Pinterest link.")
        return
    
    # Rate limiting check
    user_id = message.from_user.id
    can_proceed = await rate_limiter.check_rate_limit(user_id)
    
    if not can_proceed:
        remaining = await rate_limiter.get_remaining_cooldown(user_id)
        await message.answer(
            f"⏳ Please wait {remaining:.1f} seconds before sending another link."
        )
        return
    
    # Show format selection keyboard
    try:
        keyboard = get_format_keyboard(message.text)
        await message.answer(
            f"📥 Detected {platform.capitalize()} link!\n"
            "Choose download format:",
            reply_markup=keyboard
        )
    except Exception as e:
        logger.error(f"Failed to send format keyboard: {e}")
        await message.answer("❌ An error occurred. Please try again.")
