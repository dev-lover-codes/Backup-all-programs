# 🚀 Quick Start - Windows Permanent Setup

This is the **fastest way** to get your Telegram bot running permanently on Windows.

---

## ⚡ 5-Minute Setup

### Step 1: Download NSSM

1. Visit: **https://nssm.cc/download**
2. Download **nssm-2.24.zip** (or latest)
3. Extract → Copy `win64\nssm.exe` to `C:\Tools\nssm.exe`

### Step 2: Find Your Python Path

Open PowerShell:

```powershell
(Get-Command python).Path
```

**Copy the output!** (Example: `C:\Python311\python.exe`)

### Step 3: Install Service

Open **PowerShell as Administrator**:

```powershell
cd "d:\raaj\All_programs\Programs\Telegram bot"

# Install service (a GUI will open)
C:\Tools\nssm.exe install TelegramBot
```

**Fill in the GUI:**

| Field             | Value                                        |
| ----------------- | -------------------------------------------- |
| Path              | `C:\Python311\python.exe` _(from Step 2)_    |
| Startup directory | `d:\raaj\All_programs\Programs\Telegram bot` |
| Arguments         | `-m bot.main`                                |

**Details tab:**

- Startup type: **Automatic**

**I/O tab:**

- Output (stdout): `d:\raaj\All_programs\Programs\Telegram bot\logs\bot.log`
- Error (stderr): `d:\raaj\All_programs\Programs\Telegram bot\logs\error.log`

Click **Install service**.

### Step 4: Start It!

```powershell
Start-Service TelegramBot
```

### Step 5: Verify

```powershell
Get-Service TelegramBot
```

You should see: `Status : Running` ✅

---

## 🎮 Easy Management

Use the interactive manager:

```powershell
cd "d:\raaj\All_programs\Programs\Telegram bot"
.\manage_bot.ps1
```

---

## 📱 Your Bot is Now Accessible Everywhere!

The bot runs on your PC but is accessible from:

- ✅ **Your phone** (Telegram app)
- ✅ **Any computer** (Telegram web/app)
- ✅ **Any network** (internet connection required)

---

## 🔧 Common Commands

```powershell
# Check status
Get-Service TelegramBot

# Start/Stop/Restart
Start-Service TelegramBot
Stop-Service TelegramBot
Restart-Service TelegramBot

# View live logs
Get-Content logs\bot.log -Tail 50 -Wait
```

**See [WINDOWS_DEPLOYMENT.md](WINDOWS_DEPLOYMENT.md) for detailed guide!**
