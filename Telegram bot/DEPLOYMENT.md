# 🚀 Deployment Guide

This document covers deploying the bot to production environments.

---

## 1️⃣ VPS Deployment (Ubuntu)

### Prerequisites

- Ubuntu 20.04+ VPS (DigitalOcean, Vultr, AWS EC2, etc.)
- Root or sudo access
- At least 1 GB RAM (2 GB recommended)

### Step-by-Step

#### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Python 3.11

```bash
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update
sudo apt install python3.11 python3.11-venv python3.11-dev -y
```

#### 3. Install ffmpeg

```bash
sudo apt install ffmpeg -y
ffmpeg -version  # Verify installation
```

#### 4. Clone/Upload Project

```bash
# Option A: Git clone
git clone <your-repo-url> telegram-bot
cd telegram-bot

# Option B: Upload via SCP
scp -r "d:\raaj\All_programs\Programs\Telegram bot" user@server:/home/user/telegram-bot
ssh user@server
cd telegram-bot
```

#### 5. Create Virtual Environment

```bash
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### 6. Configure Environment

```bash
cp .env.example .env
nano .env  # Add your BOT_TOKEN
```

#### 7. Test Run

```bash
python -m bot.main
# Press Ctrl+C after verifying it works
```

---

### Running with `tmux` (Simple)

```bash
# Install tmux
sudo apt install tmux -y

# Start tmux session
tmux new -s telegram-bot

# Activate venv and run
source venv/bin/activate
python -m bot.main

# Detach from tmux: Ctrl+B, then D
# Reattach: tmux attach -t telegram-bot
# Kill session: tmux kill-session -t telegram-bot
```

---

### Running with `systemd` (Production)

#### 1. Create Service File

```bash
sudo nano /etc/systemd/system/telegram-bot.service
```

#### 2. Add Configuration

```ini
[Unit]
Description=Telegram Media Downloader Bot
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/home/YOUR_USERNAME/telegram-bot
Environment="PATH=/home/YOUR_USERNAME/telegram-bot/venv/bin"
ExecStart=/home/YOUR_USERNAME/telegram-bot/venv/bin/python -m bot.main
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Replace `YOUR_USERNAME` with your actual username!**

#### 3. Enable and Start

```bash
sudo systemctl daemon-reload
sudo systemctl enable telegram-bot.service
sudo systemctl start telegram-bot.service

# Check status
sudo systemctl status telegram-bot.service

# View logs
sudo journalctl -u telegram-bot.service -f
```

#### 4. Manage Service

```bash
sudo systemctl stop telegram-bot.service    # Stop
sudo systemctl restart telegram-bot.service # Restart
sudo systemctl disable telegram-bot.service # Disable auto-start
```

---

## 2️⃣ Railway Deployment

### Limitations

- **Ephemeral Storage**: Files are deleted on restart
- **Limited Storage**: ~10 GB disk space
- **Good for**: Testing, low-traffic bots

### Steps

#### 1. Prepare Project

Add `railway.json` (optional):

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python -m bot.main",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2. Add `Procfile`

```
worker: python -m bot.main
```

#### 3. Deploy

1. Go to [Railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variable: `BOT_TOKEN=your_token_here`
5. Railway auto-installs `ffmpeg` via Nixpacks
6. Deploy completes in ~2 minutes

#### 4. Monitor

- View logs in Railway dashboard
- Restarts automatically on crash

---

## 3️⃣ Render Deployment

### Limitations

- **Free Tier**: Sleeps after 15 min inactivity
- **Disk Resets**: On each deploy
- **Good for**: Hobby projects

### Steps

#### 1. Create `render.yaml`

```yaml
services:
  - type: worker
    name: telegram-bot
    env: python
    buildCommand: "pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg"
    startCommand: "python -m bot.main"
    envVars:
      - key: BOT_TOKEN
        sync: false
```

#### 2. Deploy

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. **New** → **Blueprint**
4. Connect repository
5. Set `BOT_TOKEN` in environment variables
6. Deploy

#### 3. Notes

- Free tier spins down after inactivity (not ideal for bots)
- Paid plans ($7/mo) stay active 24/7

---

## 📊 Performance Considerations

### Disk Space

- Each download requires temporary storage
- 1 GB disk = ~10-20 videos (depends on quality)
- Use cleanup utilities to prevent disk full errors

### Memory

- **1 GB RAM**: Good for 1-2 concurrent downloads
- **2 GB RAM**: Recommended for 3-5 concurrent
- **4 GB+ RAM**: Can handle 10+ concurrent

### Bandwidth

- Downloading + uploading uses 2x the file size
- 100 GB/month bandwidth = ~50 GB of media

### Telegram Limits

- **Bots**: 50 MB per file
- **User Bots (not recommended)**: 2 GB per file
- **Rate Limits**: ~20 messages/second

---

## 🔒 Security Checklist

- ✅ Never commit `.env` file
- ✅ Use firewall (UFW) on VPS
- ✅ Set up SSH key authentication
- ✅ Disable root login
- ✅ Keep system updated (`apt upgrade`)
- ✅ Monitor logs for abuse

---

## 🐛 Troubleshooting

### Bot doesn't start

```bash
# Check logs
sudo journalctl -u telegram-bot.service -n 50

# Common issues:
# - Wrong BOT_TOKEN
# - Missing ffmpeg
# - Port conflicts
```

### Downloads fail

```bash
# Update yt-dlp
pip install -U yt-dlp

# Test manually
yt-dlp <url>
```

### Out of disk space

```bash
# Check usage
df -h

# Clean downloads folder
rm -rf downloads/*

# Add cleanup cron job
crontab -e
# Add: 0 */6 * * * rm -rf /home/user/telegram-bot/downloads/*
```

---

## 📈 Scaling

For high traffic (100+ users):

1. Use **dedicated VPS** (not shared hosting)
2. Increase `MAX_CONCURRENT_DOWNLOADS` cautiously
3. Add **Redis** for distributed rate limiting
4. Consider **load balancing** multiple bot instances
5. Use **object storage** (S3) for temporary files

---

## 🆘 Support

- Check logs first: `sudo journalctl -u telegram-bot.service -f`
- Test yt-dlp manually: `yt-dlp --dump-json <url>`
- Verify ffmpeg: `ffmpeg -version`
