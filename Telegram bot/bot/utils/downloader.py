import asyncio
import json
import logging
import os
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class YtDlpDownloader:
    """
    Async wrapper for yt-dlp using subprocess.
    Never blocks the event loop.
    """
    
    def __init__(self, semaphore: asyncio.Semaphore):
        self.semaphore = semaphore
    
    async def get_info(self, url: str) -> Optional[Dict[str, Any]]:
        """
        Extract video/audio metadata without downloading.
        Uses --dump-json to get metadata as JSON.
        """
        async with self.semaphore:
            try:
                process = await asyncio.create_subprocess_exec(
                    "python", "-m", "yt_dlp",
                    "--dump-json",
                    "--no-playlist",
                    url,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                
                stdout, stderr = await process.communicate()
                
                if process.returncode != 0:
                    error_msg = stderr.decode().strip()
                    logger.error(f"yt-dlp info extraction failed: {error_msg}")
                    return None
                
                info = json.loads(stdout.decode())
                return info
                
            except Exception as e:
                logger.error(f"Failed to get info for {url}: {e}")
                return None
    
    async def download(
        self,
        url: str,
        format_type: str,
        output_path: str
    ) -> Optional[str]:
        """
        Download media using yt-dlp.
        
        Args:
            url: Media URL
            format_type: Either "video" or "audio"
            output_path: Directory to save the file
        
        Returns:
            Path to downloaded file, or None if failed
        """
        async with self.semaphore:
            os.makedirs(output_path, exist_ok=True)
            
            # Format selection based on type - limit quality for faster downloads
            if format_type == "video":
                # Limit to 480p and 45MB to stay under Telegram's 50MB limit
                format_selector = "bestvideo[height<=480][filesize<45M]+bestaudio[filesize<10M]/best[height<=480][filesize<45M]/best"
            elif format_type == "audio":
                format_selector = "bestaudio[filesize<45M]/best"
            else:
                format_selector = "best[filesize<45M]"
            
            output_template = os.path.join(output_path, "%(title)s.%(ext)s")
            
            logger.info(f"Starting download: {url} as {format_type} with format {format_selector}")
            
            try:
                process = await asyncio.create_subprocess_exec(
                    "python", "-m", "yt_dlp",
                    "-f", format_selector,
                    "--merge-output-format", "mp4",
                    "-o", output_template,
                    "--no-playlist",
                    "--no-warnings",
                    url,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                
                # Add timeout - 10 minutes max for download
                try:
                    stdout, stderr = await asyncio.wait_for(
                        process.communicate(),
                        timeout=600
                    )
                except asyncio.TimeoutError:
                    process.kill()
                    logger.error(f"Download timeout for {url}")
                    return None
                
                if process.returncode != 0:
                    error_msg = stderr.decode().strip()
                    logger.error(f"yt-dlp download failed: {error_msg}")
                    return None
                
                
                # Find the downloaded file - skip partial files like f123.webm
                files = [f for f in os.listdir(output_path) 
                        if os.path.isfile(os.path.join(output_path, f))
                        and not f.startswith('.') 
                        and not ('.' in f and len(f.split('.')) > 2 and '.f' in f.split('.')[-2])]
                
                if not files:
                    # If no files match, get all files (fallback)
                    files = [f for f in os.listdir(output_path) if os.path.isfile(os.path.join(output_path, f))]
                
                if files:
                    # Prefer .mp4 files over others
                    mp4_files = [f for f in files if f.endswith('.mp4')]
                    file_to_use = mp4_files[0] if mp4_files else files[0]
                    file_path = os.path.join(output_path, file_to_use)
                    
                    # Clean up other partial files
                    for f in files:
                        if f != file_to_use:
                            try:
                                os.remove(os.path.join(output_path, f))
                                logger.info(f"Cleaned up partial file: {f}")
                            except Exception:
                                pass
                    
                    logger.info(f"Download successful: {file_path}")
                    return file_path
                
                logger.error(f"No file found after download for {url}")
                return None
                
            except Exception as e:
                logger.error(f"Download failed for {url}: {e}")
                return None
    
    async def download_playlist(
        self,
        url: str,
        format_type: str,
        output_path: str
    ) -> list[str]:
        """
        Download entire playlist.
        Returns list of downloaded file paths.
        """
        async with self.semaphore:
            os.makedirs(output_path, exist_ok=True)
            
            if format_type == "video":
                format_selector = "bestvideo+bestaudio/best"
            else:
                format_selector = "bestaudio/best"
            
            output_template = os.path.join(output_path, "%(playlist_index)s - %(title)s.%(ext)s")
            
            try:
                process = await asyncio.create_subprocess_exec(
                    "python", "-m", "yt_dlp",
                    "-f", format_selector,
                    "--merge-output-format", "mp4",
                    "-o", output_template,
                    "--yes-playlist",
                    url,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                
                stdout, stderr = await process.communicate()
                
                if process.returncode != 0:
                    error_msg = stderr.decode().strip()
                    logger.error(f"Playlist download failed: {error_msg}")
                    return []
                
                # Get all downloaded files
                files = [os.path.join(output_path, f) for f in os.listdir(output_path) 
                        if os.path.isfile(os.path.join(output_path, f))]
                return files
                
            except Exception as e:
                logger.error(f"Playlist download failed for {url}: {e}")
                return []
