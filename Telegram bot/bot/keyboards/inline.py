from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def get_format_keyboard(url: str) -> InlineKeyboardMarkup:
    """
    Create inline keyboard for format selection.
    Callback data format: "format_type:url"
    """
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🎥 Best Video",
                callback_data=f"video:{url}"
            )
        ],
        [
            InlineKeyboardButton(
                text="🎧 Audio Only",
                callback_data=f"audio:{url}"
            )
        ]
    ])
    return keyboard
