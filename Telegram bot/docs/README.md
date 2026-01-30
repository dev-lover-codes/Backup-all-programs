# 🤖 Async Telegram Media Downloader Bot

A production-grade, fully asynchronous Telegram bot built with **aiogram 3.x** and **yt-dlp** for downloading media from YouTube, Instagram, and Pinterest.

## ✨ Features

- ✅ **Fully Async**: Never blocks the event loop
- 🎥 **Multi-platform**: YouTube (videos + playlists), Instagram, Pinterest
- ⚡ **Concurrent Downloads**: Semaphore-controlled parallel processing
- 🛡️ **Rate Limiting**: Per-user cooldown to prevent abuse
- 📊 **Quality Selection**: Choose between best video or audio-only
- 🧹 **Auto-cleanup**: Temporary files deleted after sending
- ❌ **Robust Error Handling**: Graceful failures with user feedback

## 🏗️ Architecture

```
bot/
├── main.py              # Entry point, bot initialization
├── config.py            # Environment-based configuration
├── handlers/
│   ├── start.py         # /start command handler
│   ├── downloader.py    # URL detection and validation
│   └── callbacks.py     # Download execution logic
├── keyboards/
│   └── inline.py        # Format selection UI
└── utils/
    ├── downloader.py    # Async yt-dlp wrapper
    ├── rate_limit.py    # Per-user rate limiting
    └── cleanup.py       # Async file cleanup
```

## 🚀 Quick Start

### Prerequisites

1. **Python 3.11+**
2. **ffmpeg** (required for yt-dlp to merge streams)

   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install ffmpeg -y

   # Windows (via Chocolatey)
   choco install ffmpeg

   # macOS
   brew install ffmpeg
   ```

3. **Telegram Bot Token**
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Create a new bot with `/newbot`
   - Copy the API token

### Installation

1. **Clone/Navigate to the project**

   ```bash
   cd "d:\raaj\All_programs\Programs\Telegram bot"
   ```

2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**

   ```bash
   # Copy the example
   cp .env.example .env

   # Edit .env and add your BOT_TOKEN
   ```

4. **Run the bot**
   ```bash
   python -m bot.main
   ```

## 🚀 Deployment

### Running Permanently

The bot will stop when you close your terminal/editor. To run it permanently:

#### Local (Keep Your PC Running):

- **Windows**: See **[WINDOWS_DEPLOYMENT.md](WINDOWS_DEPLOYMENT.md)** for running as a Windows Service
- **Quick Start**: See **[QUICK_START_WINDOWS.md](QUICK_START_WINDOWS.md)** for 5-minute setup

#### Cloud (24/7, No PC Required):

- **Free Options**: See **[FREE_CLOUD_PLATFORMS.md](FREE_CLOUD_PLATFORMS.md)** ⭐ Railway, Fly.io, Koyeb, Oracle Cloud & more
- **Advanced/VPS**: See **[DEPLOYMENT.md](DEPLOYMENT.md)** for systemd, Railway, Render, and scaling

Quick Windows setup:

```powershell
# Use the interactive manager script
.\manage_bot.ps1
```

## 🔧 Configuration

Edit `.env` file:

```env
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
MAX_CONCURRENT_DOWNLOADS=3
USER_COOLDOWN_SECONDS=10
```

## 📖 Usage

1. Start the bot: `/start`
2. Send a media URL (YouTube, Instagram, Pinterest)
3. Choose format: **Best Video** or **Audio Only**
4. Wait for download and receive your file!

## 🧠 How It Works

### Async Subprocess Execution

Instead of blocking Python with sync `subprocess.run()`, we use:

```python
process = await asyncio.create_subprocess_exec(
    "yt-dlp", "-f", "bestvideo+bestaudio", url,
    stdout=asyncio.subprocess.PIPE
)
stdout, stderr = await process.communicate()
```

This allows the event loop to handle other users while yt-dlp runs.

### Semaphore for Concurrency Control

```python
semaphore = asyncio.Semaphore(3)  # Max 3 simultaneous downloads

async with semaphore:
    # Download happens here
    # If 3 downloads are active, this waits
```

Prevents server overload and memory exhaustion.

### Rate Limiting

```python
rate_limiter = RateLimiter(cooldown_seconds=10)

if not await rate_limiter.check_rate_limit(user_id):
    await message.answer("⏳ Please wait...")
    return
```

Protects against spam and abuse.

## 🚨 Error Handling

The bot handles:

- ❌ Invalid URLs → Clear error message
- 🔒 Private/deleted content → Detected by yt-dlp exit code
- 🔞 Age-restricted videos → yt-dlp error parsing
- 📦 File size limits → Checked before sending (50 MB default)
- 💥 Unexpected errors → Logged + user notification

## 📝 Logs

Logs are printed to stdout:

```
2026-01-30 11:00:00 - bot.handlers.callbacks - INFO - Download completed for user 12345
2026-01-30 11:00:05 - bot.utils.cleanup - INFO - Deleted file: downloads/12345/video.mp4
```

## ⚠️ Limitations

- **Telegram File Size**: 50 MB for bots (2 GB for users)
- **Disk Space**: Downloads are temporary but require storage during processing
- **yt-dlp Updates**: Some sites may break; keep yt-dlp updated (`pip install -U yt-dlp`)

## 🔐 Security

- ✅ No hardcoded secrets (uses `.env`)
- ✅ User isolation (separate download directories)
- ✅ Input validation (URL pattern matching)
- ✅ Rate limiting (prevents abuse)

## 🛠️ Development

### Adding New Platforms

Edit `bot/handlers/downloader.py`:

```python
URL_PATTERNS = {
    "youtube": re.compile(r'...'),
    "tiktok": re.compile(r'(https?://)?.*tiktok\.com/.+'),  # New!
}
```

yt-dlp supports 1000+ sites automatically.

### Adjusting Concurrency

In `.env`:

```env
MAX_CONCURRENT_DOWNLOADS=5  # Increase for powerful servers
```

## 📄 License

Educational purposes only. Respect content creators and platform terms of service.

## 🙏 Credits

- [aiogram](https://github.com/aiogram/aiogram) - Modern Telegram Bot framework
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Universal media downloader
