# ☁️ Free Cloud Platforms for 24/7 Bot Hosting

This guide covers **FREE** platforms where you can deploy your Telegram bot to run 24/7 without keeping your PC on.

---

## 🏆 Best Free Options (Ranked)

| Platform         | Free Tier              | Uptime         | Setup Difficulty | Best For          |
| ---------------- | ---------------------- | -------------- | ---------------- | ----------------- |
| **Railway** ⭐   | $5 free credit/month   | 24/7           | Easy             | Best overall      |
| **Render**       | Free (sleeps)          | Intermittent   | Easy             | Hobby projects    |
| **Fly.io**       | 3 VMs free             | 24/7           | Medium           | Production-ready  |
| **Koyeb**        | 1 service free         | 24/7           | Easy             | Simple deployment |
| **Glitch**       | Free                   | 24/7 (limited) | Very Easy        | Quick testing     |
| **Replit**       | Free (always-on $7/mo) | Intermittent   | Very Easy        | Learning          |
| **Oracle Cloud** | Always free tier       | 24/7           | Hard             | Advanced users    |

---

## 1️⃣ Railway.app ⭐ (RECOMMENDED)

### ✅ Pros:

- **$5 free credits/month** (~500 hours runtime)
- Auto-installs ffmpeg
- GitHub integration
- Easy to use
- Great for bots

### ❌ Cons:

- Need credit card for verification (not charged)
- Ephemeral storage (files deleted on restart)

### 🚀 Deployment Steps:

1. **Push your code to GitHub** (if not already):

   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/telegram-bot.git
   git push -u origin main
   ```

2. **Go to [Railway.app](https://railway.app)**
   - Sign up with GitHub

3. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

4. **Add Environment Variables**
   - Go to "Variables" tab
   - Add: `BOT_TOKEN=your_bot_token_here`
   - Add: `MAX_CONCURRENT_DOWNLOADS=2`
   - Add: `USER_COOLDOWN_SECONDS=10`

5. **Deploy**
   - Railway auto-detects Python and installs requirements
   - Deployment takes ~2 minutes

6. **View Logs**
   - Click "Deployments" → "View Logs"

### 📊 Expected Usage:

- **~500 hours/month** free runtime
- Perfect for personal bots with moderate usage

---

## 2️⃣ Render.com

### ✅ Pros:

- Truly free (no credit card required)
- Easy GitHub integration
- Auto-installs dependencies

### ❌ Cons:

- **Free tier spins down after 15 minutes of inactivity**
- 30-second cold start time
- 750 hours/month limit

### 🚀 Deployment Steps:

1. **Create `render.yaml`** in your project:

   ```yaml
   services:
     - type: web
       name: telegram-bot
       env: python
       buildCommand: "pip install -r requirements.txt"
       startCommand: "python -m bot.main"
       envVars:
         - key: BOT_TOKEN
           sync: false
         - key: MAX_CONCURRENT_DOWNLOADS
           value: "2"
   ```

2. **Push to GitHub**

3. **Go to [Render.com](https://render.com)**
   - Sign up (free, no credit card)

4. **New → Blueprint**
   - Connect your GitHub repository
   - Render auto-detects `render.yaml`

5. **Set Environment Variables**
   - Add `BOT_TOKEN` in dashboard

6. **Deploy**

### ⚠️ Important:

- Bot will sleep after 15 min of no activity
- **Not ideal for bots** (use Railway or Fly.io instead)
- Good for testing only

---

## 3️⃣ Fly.io

### ✅ Pros:

- **3 shared VMs free (256MB RAM each)**
- 24/7 uptime
- Persistent storage (3GB free)
- Production-ready

### ❌ Cons:

- Requires credit card
- More complex setup
- Command-line focused

### 🚀 Deployment Steps:

1. **Install Fly CLI**:

   ```powershell
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login**:

   ```powershell
   fly auth signup
   ```

3. **Navigate to project**:

   ```powershell
   cd "d:\raaj\All_programs\Programs\Telegram bot"
   ```

4. **Create `fly.toml`**:

   ```toml
   app = "your-telegram-bot"

   [build]
     builder = "paketobuildpacks/builder:base"

   [env]
     PORT = "8080"

   [[services]]
     internal_port = 8080
     protocol = "tcp"

     [[services.ports]]
       port = 80

   [processes]
     app = "python -m bot.main"
   ```

5. **Create `Procfile`**:

   ```
   worker: python -m bot.main
   ```

6. **Deploy**:

   ```powershell
   fly launch
   fly secrets set BOT_TOKEN=your_token_here
   fly deploy
   ```

7. **Check status**:
   ```powershell
   fly status
   fly logs
   ```

---

## 4️⃣ Koyeb

### ✅ Pros:

- 1 web service free forever
- 24/7 uptime
- Easy GitHub deployment
- No credit card required

### ❌ Cons:

- Limited to 1 service
- 512MB RAM
- Ephemeral storage

### 🚀 Deployment Steps:

1. **Push code to GitHub**

2. **Go to [Koyeb.com](https://www.koyeb.com)**
   - Sign up (free, no credit card)

3. **Create Service**
   - Click "Create Service"
   - Select "GitHub"
   - Choose your repository

4. **Configure**:
   - **Builder**: Buildpack
   - **Build command**: `pip install -r requirements.txt`
   - **Run command**: `python -m bot.main`

5. **Environment Variables**:
   - Add `BOT_TOKEN`

6. **Deploy**

---

## 5️⃣ Glitch.com

### ✅ Pros:

- No credit card needed
- Very easy to use
- Web-based IDE

### ❌ Cons:

- Rate limits on free tier
- Projects can be throttled
- 4000 request hours/month

### 🚀 Deployment Steps:

1. **Go to [Glitch.com](https://glitch.com)**

2. **New Project → Import from GitHub**
   - Connect your repository

3. **Edit `.env`**:

   ```
   BOT_TOKEN=your_token_here
   ```

4. **Add `glitch.json`**:

   ```json
   {
     "install": "pip install -r requirements.txt",
     "start": "python -m bot.main",
     "watch": {
       "ignore": ["downloads/*"]
     }
   }
   ```

5. **Project runs automatically**

---

## 6️⃣ Replit

### ✅ Pros:

- Super easy to use
- Web-based IDE
- Great for learning

### ❌ Cons:

- **Free tier sleeps** (always-on requires $7/month)
- Public code (unless paid)
- Limited resources

### 🚀 Deployment Steps:

1. **Go to [Replit.com](https://replit.com)**

2. **Import from GitHub**

3. **Configure `.replit`**:

   ```
   run = "python -m bot.main"
   ```

4. **Add Secrets**:
   - Click "Secrets" (lock icon)
   - Add `BOT_TOKEN`

5. **Click Run**

⚠️ Note: For 24/7 uptime, you need "Always On" ($7/month)

---

## 7️⃣ Oracle Cloud Free Tier (Advanced)

### ✅ Pros:

- **Always free tier** (true free VPS)
- 4 ARM cores + 24GB RAM (or 2 x 1GB AMD)
- Full control (like your own server)

### ❌ Cons:

- Complex setup
- Requires credit card verification
- Manual Linux server management

### 🚀 Deployment Steps:

1. **Sign up at [Oracle Cloud](https://www.oracle.com/cloud/free/)**

2. **Create Compute Instance**:
   - Shape: "Always Free Eligible" (ARM or AMD)
   - Image: Ubuntu 22.04
   - Download SSH key

3. **Connect via SSH**:

   ```powershell
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

4. **Follow Linux deployment** from [DEPLOYMENT.md](DEPLOYMENT.md):
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install python3.11 python3.11-venv ffmpeg git -y
   git clone https://github.com/yourusername/telegram-bot.git
   cd telegram-bot
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   # ... follow systemd setup
   ```

**Best for:** Users comfortable with Linux and VPS management

---

## 8️⃣ Other Free Options

### PythonAnywhere

- **Free tier**: Very limited (expires after 3 months)
- **Not recommended for bots**

### Heroku

- **No longer free** (paid only since 2022)

### GitHub Codespaces

- 60 hours/month free
- Not designed for 24/7 services

---

## 📊 Quick Comparison

### Best for 24/7 Free Hosting:

1. **Railway** ⭐ - Best balance (easy + reliable)
2. **Fly.io** - Production-ready
3. **Koyeb** - Simple and free
4. **Oracle Cloud** - Truly free but complex

### Best for Testing:

1. **Render** - Easy but sleeps
2. **Glitch** - Very simple
3. **Replit** - Learning-friendly

### Avoid for Bots:

- ❌ Render free tier (sleeps)
- ❌ Replit free tier (sleeps)
- ❌ Any service that "spins down"

---

## 🎯 My Recommendation

**For your use case**, I recommend:

### Option 1: Railway (Best)

- ✅ $5/month free credits = ~500 hours
- ✅ Perfect for personal bots
- ✅ Super easy setup
- ✅ Auto-installs everything

### Option 2: Your Windows PC (if always on)

- ✅ Unlimited runtime
- ✅ Full control
- ✅ No internet dependency (besides Telegram API)
- ✅ See [WINDOWS_DEPLOYMENT.md](WINDOWS_DEPLOYMENT.md)

### Option 3: Fly.io (Advanced)

- ✅ True 24/7 free tier
- ✅ Production-ready
- ⚠️ More setup required

---

## 🚀 Quick Setup Guide (Railway)

1. **Push to GitHub**:

   ```powershell
   cd "d:\raaj\All_programs\Programs\Telegram bot"
   git init
   git add .
   git commit -m "Deploy to Railway"
   gh repo create telegram-bot --private --source=. --push
   ```

2. **Deploy to Railway**:
   - Visit https://railway.app
   - Connect GitHub
   - New Project → Deploy from GitHub
   - Select repository
   - Add `BOT_TOKEN` in Variables
   - Deploy ✅

3. **Done!** Your bot is now running 24/7 in the cloud!

---

## 💡 Pro Tips

1. **Use GitHub for all platforms** - Makes deployment easier
2. **Test locally first** - Always verify bot works before deploying
3. **Monitor logs** - Check for errors after deployment
4. **Keep yt-dlp updated** - Some platforms auto-update, others don't
5. **Backup your .env** - Never commit it to GitHub

---

## 🆘 Need Help?

- **Railway issues**: Check logs in Railway dashboard
- **Deployment errors**: Ensure `requirements.txt` is up-to-date
- **Bot not responding**: Verify `BOT_TOKEN` is set correctly

**Still stuck?** Check platform-specific documentation or create an issue on GitHub.

---

## 📝 Summary

| Your Need                     | Use This                                        |
| ----------------------------- | ----------------------------------------------- |
| 24/7 free hosting, easy setup | **Railway**                                     |
| True forever-free, advanced   | **Oracle Cloud**                                |
| Keep PC on, full control      | **Windows Service** (see WINDOWS_DEPLOYMENT.md) |
| Just testing                  | **Render** or **Glitch**                        |

**Happy deploying!** 🚀
