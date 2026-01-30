import os
import asyncio
import aiofiles.os
import logging

logger = logging.getLogger(__name__)

async def cleanup_file(file_path: str) -> None:
    """
    Asynchronously delete a file without blocking the event loop.
    """
    try:
        if os.path.exists(file_path):
            await aiofiles.os.remove(file_path)
            logger.info(f"Deleted file: {file_path}")
    except Exception as e:
        logger.error(f"Failed to delete {file_path}: {e}")

async def cleanup_directory(directory: str) -> None:
    """
    Asynchronously clean up all files in a directory.
    """
    try:
        if os.path.exists(directory):
            for filename in os.listdir(directory):
                file_path = os.path.join(directory, filename)
                if os.path.isfile(file_path):
                    await cleanup_file(file_path)
    except Exception as e:
        logger.error(f"Failed to clean directory {directory}: {e}")
