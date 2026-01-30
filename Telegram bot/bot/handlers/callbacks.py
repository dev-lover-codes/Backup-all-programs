import os
import asyncio
import logging
from aiogram import Router, F
from aiogram.types import CallbackQuery, FSInputFile, BufferedInputFile

from bot.utils.downloader import YtDlpDownloader
from bot.utils.cleanup import cleanup_file
from bot.config import MAX_CONCURRENT_DOWNLOADS, DOWNLOADS_DIR

router = Router()
logger = logging.getLogger(__name__)

# Global semaphore to limit concurrent downloads
download_semaphore = asyncio.Semaphore(MAX_CONCURRENT_DOWNLOADS)
downloader = YtDlpDownloader(download_semaphore)

# Telegram file size limit (50 MB for bots without premium)
MAX_FILE_SIZE = 50 * 1024 * 1024

@router.callback_query(F.data.startswith("video:") | F.data.startswith("audio:"))
async def handle_format_selection(callback: CallbackQuery):
    """
    Handle format selection callback.
    Download and send the media file.
    """
    await callback.answer()
    
    # Parse callback data
    format_type, url = callback.data.split(":", 1)
    
    # Create user-specific download directory
    user_id = callback.from_user.id
    user_download_dir = os.path.join(DOWNLOADS_DIR, str(user_id))
    
    # Inform user
    status_message = await callback.message.answer(
        f"⏳ Downloading {'video' if format_type == 'video' else 'audio'}...\n"
        "This may take a moment."
    )
    
    try:
        # Check if URL is a playlist
        is_playlist = "playlist" in url or "list=" in url
        
        if is_playlist:
            await status_message.edit_text("📋 Playlist detected! Downloading all videos...")
            file_paths = await downloader.download_playlist(url, format_type, user_download_dir)
            
            if not file_paths:
                await status_message.edit_text("❌ Failed to download playlist. Please check the link.")
                return
            
            await status_message.edit_text(f"✅ Downloaded {len(file_paths)} items! Sending...")
            
            # Send each file
            for i, file_path in enumerate(file_paths, 1):
                await send_file(callback.message, file_path, format_type)
                await cleanup_file(file_path)
                
                if i < len(file_paths):
                    await asyncio.sleep(1)  # Small delay between sends
            
            await status_message.edit_text(f"✅ All {len(file_paths)} files sent!")
            
        else:
            # Single video/audio download
            file_path = await downloader.download(url, format_type, user_download_dir)
            
            if not file_path:
                await status_message.edit_text(
                    "❌ Download failed. Possible reasons:\n"
                    "• Private or deleted content\n"
                    "• Age-restricted video\n"
                    "• Invalid URL\n"
                    "• Platform restrictions"
                )
                return
            
            # Check file size
            file_size = os.path.getsize(file_path)
            if file_size > MAX_FILE_SIZE:
                await status_message.edit_text(
                    f"❌ File is too large ({file_size / (1024**2):.1f} MB).\n"
                    f"Telegram bot limit is {MAX_FILE_SIZE / (1024**2):.0f} MB."
                )
                await cleanup_file(file_path)
                return
            
            await status_message.edit_text("📤 Sending file...")
            await send_file(callback.message, file_path, format_type)
            await status_message.edit_text("✅ Done!")
            
            # Cleanup
            await cleanup_file(file_path)
    
    except Exception as e:
        logger.error(f"Error in download handler: {e}", exc_info=True)
        await status_message.edit_text(
            "❌ An unexpected error occurred. Please try again later."
        )
    
    finally:
        # Clean up user directory
        try:
            if os.path.exists(user_download_dir) and not os.listdir(user_download_dir):
                os.rmdir(user_download_dir)
        except Exception as e:
            logger.error(f"Failed to remove empty directory: {e}")

async def send_file(message, file_path: str, format_type: str):
    """
    Send file to user based on type.
    """
    try:
        file = FSInputFile(file_path)
        
        if format_type == "video":
            await message.answer_video(file)
        elif format_type == "audio":
            await message.answer_audio(file)
        else:
            await message.answer_document(file)
            
    except Exception as e:
        logger.error(f"Failed to send file {file_path}: {e}")
        # Fallback to document
        try:
            file = FSInputFile(file_path)
            await message.answer_document(file)
        except Exception as fallback_error:
            logger.error(f"Fallback send also failed: {fallback_error}")
            raise
