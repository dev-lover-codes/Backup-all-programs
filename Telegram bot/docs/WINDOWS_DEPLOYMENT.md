# 🪟 Windows Deployment Guide

This guide shows you how to run your Telegram bot **permanently on Windows** - it will keep running even after you close your code editor, and can start automatically with Windows.

---

## 🎯 What You'll Achieve

✅ Bot runs in the background (no console window)  
✅ Auto-starts when Windows boots  
✅ Restarts automatically if it crashes  
✅ Accessible everywhere (runs as a system service)  
✅ Works even when logged out

---

## 📋 Prerequisites

Before starting, make sure you have:

1. ✅ **Python 3.11+** installed
2. ✅ **ffmpeg** installed (see main README.md)
3. ✅ **Your bot working** (test with `python -m bot.main`)
4. ✅ **Administrator access** to your Windows PC

---

## 🚀 Method 1: Windows Service with NSSM (Recommended)

### What is NSSM?

**NSSM** (Non-Sucking Service Manager) is a free tool that converts any program into a Windows Service. Perfect for running your bot permanently!

### Step 1: Download NSSM

1. Go to: **https://nssm.cc/download**
2. Download the latest version (e.g., `nssm-2.24.zip`)
3. Extract the ZIP file
4. Navigate to the `win64` folder (or `win32` for 32-bit Windows)
5. Copy `nssm.exe` to a permanent location, for example:
   ```
   C:\Tools\nssm.exe
   ```

### Step 2: Find Your Python Path

Open PowerShell and run:

```powershell
(Get-Command python).Path
```

**Copy the output** (it will look like: `C:\Python311\python.exe` or `C:\Users\YourName\AppData\Local\Programs\Python\Python311\python.exe`)

### Step 3: Install the Service

1. **Open PowerShell as Administrator**
   - Press `Win + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Navigate to your bot directory:**

   ```powershell
   cd "d:\raaj\All_programs\Programs\Telegram bot"
   ```

3. **Install the service with NSSM:**

   ```powershell
   C:\Tools\nssm.exe install TelegramBot
   ```

4. **A GUI window will open. Fill in:**
   - **Path:** `C:\Python311\python.exe` (use the path from Step 2)
   - **Startup directory:** `d:\raaj\All_programs\Programs\Telegram bot`
   - **Arguments:** `-m bot.main`

5. **Go to the "Details" tab:**
   - **Display name:** `Telegram Media Downloader Bot`
   - **Description:** `Async Telegram bot for downloading media`
   - **Startup type:** `Automatic`

6. **Go to the "I/O" tab:**
   - **Output (stdout):** `d:\raaj\All_programs\Programs\Telegram bot\logs\bot.log`
   - **Error (stderr):** `d:\raaj\All_programs\Programs\Telegram bot\logs\error.log`

7. **Click "Install service"**

### Step 4: Create Logs Directory

```powershell
mkdir logs
```

### Step 5: Start the Service

```powershell
Start-Service TelegramBot
```

### Step 6: Verify It's Running

```powershell
Get-Service TelegramBot
```

You should see `Status: Running`

### Managing Your Service

```powershell
# Stop the service
Stop-Service TelegramBot

# Restart the service
Restart-Service TelegramBot

# Check status
Get-Service TelegramBot

# View logs
Get-Content "d:\raaj\All_programs\Programs\Telegram bot\logs\bot.log" -Tail 50 -Wait

# Uninstall service (if needed)
C:\Tools\nssm.exe remove TelegramBot confirm
```

---

## 🗓️ Method 2: Task Scheduler (Alternative)

If you don't want to use NSSM, you can use Windows Task Scheduler:

### Step 1: Create a Startup Script

Create a file named `start_bot.bat` in your bot directory:

```batch
@echo off
cd /d "d:\raaj\All_programs\Programs\Telegram bot"
python -m bot.main >> logs\bot.log 2>&1
```

### Step 2: Create Scheduled Task

1. Press `Win + R`, type `taskschd.msc`, press Enter
2. Click **"Create Task"** (not "Create Basic Task")
3. **General tab:**
   - Name: `Telegram Bot`
   - Description: `Runs Telegram media downloader bot`
   - ✅ Check "Run whether user is logged on or not"
   - ✅ Check "Run with highest privileges"
4. **Triggers tab:**
   - Click "New"
   - Begin the task: `At startup`
   - Click OK

5. **Actions tab:**
   - Click "New"
   - Action: `Start a program`
   - Program/script: `d:\raaj\All_programs\Programs\Telegram bot\start_bot.bat`
   - Click OK

6. **Settings tab:**
   - ✅ Check "Allow task to be run on demand"
   - ✅ Check "If the task fails, restart every:" → Set to `1 minute`, restart attempts: `3`
   - ✅ Check "If the running task does not end when requested, force it to stop"

7. Click **OK**, enter your Windows password when prompted

### Testing the Task

Right-click the task → **Run**

Check if the bot is working by messaging it on Telegram!

---

## 🛡️ Method 3: Startup Folder (Simplest)

**Note:** This method requires you to be logged in to Windows.

1. Press `Win + R`
2. Type: `shell:startup`
3. Press Enter
4. Copy your `start_bot.bat` file (created above) into this folder

**Pros:** Very simple  
**Cons:** Only works when logged in, no automatic restart on crash

---

## 📊 Monitoring Your Bot

### Check if Bot is Running

**For NSSM Service:**

```powershell
Get-Service TelegramBot
Get-Process python
```

**For Task Scheduler:**

```powershell
Get-Process python | Where-Object {$_.Path -like "*Python*"}
```

### View Logs

```powershell
# Continuous log viewing
Get-Content "d:\raaj\All_programs\Programs\Telegram bot\logs\bot.log" -Tail 50 -Wait

# View errors
Get-Content "d:\raaj\All_programs\Programs\Telegram bot\logs\error.log" -Tail 50
```

### View Windows Event Logs

```powershell
Get-EventLog -LogName Application -Source "TelegramBot" -Newest 10
```

---

## 🔧 Troubleshooting

### Service Won't Start

1. **Check Python path is correct:**

   ```powershell
   (Get-Command python).Path
   ```

2. **Verify bot works manually:**

   ```powershell
   cd "d:\raaj\All_programs\Programs\Telegram bot"
   python -m bot.main
   ```

3. **Check logs:**

   ```powershell
   Get-Content logs\error.log
   ```

4. **Reinstall service:**
   ```powershell
   C:\Tools\nssm.exe remove TelegramBot confirm
   C:\Tools\nssm.exe install TelegramBot
   ```

### Bot Crashes After Some Time

1. **Enable auto-restart in NSSM:**

   ```powershell
   C:\Tools\nssm.exe set TelegramBot AppThrottle 1500
   C:\Tools\nssm.exe set TelegramBot AppExit Default Restart
   ```

2. **Check memory usage:**
   ```powershell
   Get-Process python | Select-Object Name, CPU, WorkingSet
   ```

### Can't Access Logs

Make sure the logs directory exists:

```powershell
New-Item -ItemType Directory -Force -Path "d:\raaj\All_programs\Programs\Telegram bot\logs"
```

---

## 🎨 Making Bot Accessible from Desktop

### Create Desktop Shortcuts

#### 1. Start Bot Shortcut

1. Right-click Desktop → New → Shortcut
2. Location: `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -Command "Start-Service TelegramBot"`
3. Name: `Start Telegram Bot`
4. Change icon (optional): Right-click → Properties → Change Icon

#### 2. Stop Bot Shortcut

1. Right-click Desktop → New → Shortcut
2. Location: `C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe -Command "Stop-Service TelegramBot"`
3. Name: `Stop Telegram Bot`

#### 3. View Logs Shortcut

1. Right-click Desktop → New → Shortcut
2. Location: `notepad.exe "d:\raaj\All_programs\Programs\Telegram bot\logs\bot.log"`
3. Name: `View Bot Logs`

---

## 🔐 Security Tips

1. ✅ **Never share your `.env` file**
2. ✅ **Run service with limited user account** (not Administrator for production)
3. ✅ **Enable Windows Firewall**
4. ✅ **Keep Python and dependencies updated:**
   ```powershell
   pip install -U aiogram yt-dlp
   ```

---

## 📈 Performance Tips

### For Low-End PCs:

```env
MAX_CONCURRENT_DOWNLOADS=1
USER_COOLDOWN_SECONDS=15
```

### For High-End PCs:

```env
MAX_CONCURRENT_DOWNLOADS=5
USER_COOLDOWN_SECONDS=5
```

Edit your `.env` file to adjust these settings.

---

## 🌐 Accessing from Anywhere

Your Telegram bot is **already accessible from anywhere**! Since it's a Telegram bot, you can use it from:

✅ **Any device with Telegram** (phone, tablet, computer)  
✅ **Any network** (home, work, mobile data)  
✅ **Any location** (as long as you have internet)

Just search for your bot in Telegram and start chatting!

---

## 🆘 Common Questions

### Q: Will the bot stop if I close VS Code?

**A:** No! Once running as a service, it's independent of your editor.

### Q: Will the bot stop if I restart my PC?

**A:** No! The service auto-starts with Windows.

### Q: Can I use the bot from my phone?

**A:** Yes! Just open Telegram on your phone and message your bot.

### Q: How do I update the bot code?

**A:**

1. Stop the service: `Stop-Service TelegramBot`
2. Update your code
3. Restart the service: `Start-Service TelegramBot`

### Q: How much resources does it use?

**A:**

- **Idle:** ~50-100 MB RAM, 0% CPU
- **Downloading:** ~200-500 MB RAM, 10-30% CPU (depends on video size)

---

## 📝 Summary

**Recommended approach:**

1. ✅ Use **NSSM** to create a Windows Service
2. ✅ Set it to start **Automatically**
3. ✅ Create **desktop shortcuts** for easy control
4. ✅ Monitor using **logs**

Your bot will now:

- ✨ Run 24/7 in the background
- ✨ Start automatically with Windows
- ✨ Be accessible from any device via Telegram
- ✨ Restart automatically if it crashes

---

## 🎉 You're Done!

Your Telegram bot is now running permanently on your Windows machine! Test it by messaging your bot on Telegram from any device.

**Need help?** Check the logs:

```powershell
Get-Content logs\bot.log -Tail 50 -Wait
```
