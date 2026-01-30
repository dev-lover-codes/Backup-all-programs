# 🤖 Async Telegram Media Downloader Bot

A production-grade, fully asynchronous Telegram bot built with **aiogram 3.x** and **yt-dlp** for downloading media from YouTube, Instagram, and Pinterest.

---

## ✨ Features

- ✅ **Fully Async**: Never blocks the event loop
- 🎥 **Multi-platform**: YouTube (videos + playlists), Instagram, Pinterest
- ⚡ **Concurrent Downloads**: Semaphore-controlled parallel processing
- 🛡️ **Rate Limiting**: Per-user cooldown to prevent abuse
- 📊 **Quality Selection**: Choose between best video or audio-only
- 🧹 **Auto-cleanup**: Temporary files deleted after sending
- ❌ **Robust Error Handling**: Graceful failures with user feedback

---

## 🚀 Quick Start

### Prerequisites

1. **Python 3.11+**
2. **ffmpeg** (required for yt-dlp to merge streams)
   ```powershell
   # Windows (via Chocolatey)
   choco install ffmpeg
   ```
3. **Telegram Bot Token** from [@BotFather](https://t.me/BotFather)

### Installation

```powershell
# Navigate to project
cd "d:\raaj\All_programs\Programs\Telegram bot"

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your BOT_TOKEN

# Run the bot
python -m bot.main
```

---

## 📚 Documentation

All detailed documentation is in the **[`docs/`](./docs)** folder:

### 🎯 **Start Here:**

- **[DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md)** - Help choosing the right deployment option

### 🪟 **Windows Deployment:**

- **[QUICK_START_WINDOWS.md](./docs/QUICK_START_WINDOWS.md)** - 5-minute Windows setup ⚡
- **[WINDOWS_DEPLOYMENT.md](./docs/WINDOWS_DEPLOYMENT.md)** - Complete Windows Service guide

### ☁️ **Cloud Deployment:**

- **[FREE_CLOUD_PLATFORMS.md](./docs/FREE_CLOUD_PLATFORMS.md)** - Free hosting options (Railway, Fly.io, etc.)
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Linux/VPS/systemd deployment

### 📖 **Main Documentation:**

- **[Full README](./docs/README.md)** - Complete project documentation

---

## 🎮 Management Tools

### Windows Service Manager

```powershell
.\manage_bot.ps1
```

Interactive menu for:

- Start/Stop/Restart service
- View logs
- Check status

### Simple Startup

```powershell
.\start_bot.bat
```

One-click bot start with logging

---

## 🔧 Configuration

Edit `.env` file:

```env
BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
MAX_CONCURRENT_DOWNLOADS=3
USER_COOLDOWN_SECONDS=10
```

---

## 📖 Usage

1. Start the bot: `/start`
2. Send a media URL (YouTube, Instagram, Pinterest)
3. Choose format: **Best Video** or **Audio Only**
4. Wait for download and receive your file!

---

## 🚀 Deployment Options

### **Option 1: Windows Service** (Local, Free)

Run bot permanently on your Windows PC:

```powershell
.\manage_bot.ps1
```

**See:** [QUICK_START_WINDOWS.md](./docs/QUICK_START_WINDOWS.md)

### **Option 2: Cloud Hosting** (24/7, Free/Paid)

Deploy to Railway, Fly.io, or other platforms

**See:** [FREE_CLOUD_PLATFORMS.md](./docs/FREE_CLOUD_PLATFORMS.md)

---

## 🏗️ Project Structure

```
Telegram bot/
├── bot/
│   ├── main.py              # Entry point
│   ├── config.py            # Configuration
│   ├── handlers/            # Message & callback handlers
│   ├── keyboards/           # Inline keyboards
│   └── utils/               # Helper functions
├── docs/                    # 📚 All documentation
│   ├── DEPLOYMENT_GUIDE.md  # Choose your deployment
│   ├── QUICK_START_WINDOWS.md
│   ├── WINDOWS_DEPLOYMENT.md
│   ├── FREE_CLOUD_PLATFORMS.md
│   ├── DEPLOYMENT.md
│   └── README.md            # Full documentation
├── logs/                    # Bot logs
├── downloads/               # Temporary downloads
├── .env                     # Environment variables
├── requirements.txt         # Python dependencies
├── manage_bot.ps1          # Service manager
└── start_bot.bat           # Simple startup script
```

---

## ⚠️ Limitations

- **Telegram File Size**: 50 MB for bots
- **Disk Space**: Downloads are temporary but require storage during processing
- **yt-dlp Updates**: Keep updated (`pip install -U yt-dlp`)

---

## 🔐 Security

- ✅ No hardcoded secrets (uses `.env`)
- ✅ User isolation (separate download directories)
- ✅ Input validation (URL pattern matching)
- ✅ Rate limiting (prevents abuse)

**⚠️ Never commit `.env` file to version control!**

---

## 📄 License

Educational purposes only. Respect content creators and platform terms of service.

---

## 🙏 Credits

- [aiogram](https://github.com/aiogram/aiogram) - Modern Telegram Bot framework
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Universal media downloader

---

## 🆘 Need Help?

1. Check the [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) for choosing options
2. See platform-specific guides in the `docs/` folder
3. Check logs: `Get-Content logs\bot.log -Tail 50 -Wait`

**Happy coding!** 🚀
