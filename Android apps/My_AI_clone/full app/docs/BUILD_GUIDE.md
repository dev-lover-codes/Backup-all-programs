# My AI Clone - Build & Setup Guide

## 🎯 Project Overview

**My AI Clone** is a complete Android application built with modern Android development practices. The app allows users to train an AI on their chat history and generate personalized auto-replies.

### Key Statistics
- **19 Kotlin files** - All core functionality
- **7 XML resources** - UI strings, colors, themes
- **5 Screens** - Home, Import, Chat Test, Smart Reply, Settings
- **Modern Architecture** - MVVM + Repository pattern
- **Beautiful UI** - Material 3 with Jetpack Compose

---

## 📋 Prerequisites Checklist

Before building, ensure you have:

- [ ] **Android Studio** (Hedgehog 2023.1.1 or later)
- [ ] **JDK 17** or higher
- [ ] **Android SDK** installed via Android Studio
- [ ] **Internet connection** (for Gradle dependencies)
- [ ] **OpenAI API Key** (for testing the app after build)

---

## 🚀 Build Instructions

### Option 1: Build with Android Studio (Recommended)

#### Step 1: Open the Project
1. Launch **Android Studio**
2. Click **File → Open**
3. Navigate to: `d:\raaj\Projects\Programs\Android apps\My_AI_clone`
4. Click **OK**

#### Step 2: Sync Gradle
1. Android Studio will automatically start syncing
2. Wait for "Gradle sync finished" message (may take 2-5 minutes first time)
3. If sync fails, click **File → Sync Project with Gradle Files**

#### Step 3: Build the APK
1. Click **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete
3. Click **locate** in the notification to find the APK

**APK Location:** `app\build\outputs\apk\debug\app-debug.apk`

#### Step 4: Install on Device
**Option A - Using Android Studio:**
1. Connect your Android device via USB (enable USB debugging)
2. Click the **Run** button (green play icon) or press `Shift+F10`
3. Select your device from the list
4. App will install and launch automatically

**Option B - Manual Install:**
1. Copy `app-debug.apk` to your phone
2. Open the APK file on your phone
3. Allow installation from unknown sources if prompted
4. Tap **Install**

---

### Option 2: Build from Command Line

#### Windows (PowerShell):
```powershell
# Navigate to project directory
cd "d:\raaj\Projects\Programs\Android apps\My_AI_clone"

# Make gradlew executable (if needed)
# This step might not be necessary on Windows

# Build debug APK
.\gradlew.bat assembleDebug

# Install on connected device
.\gradlew.bat installDebug
```

#### If you have Git Bash or WSL:
```bash
cd "/d/raaj/Projects/Programs/Android apps/My_AI_clone"

# Build debug APK
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug
```

---

## 🔧 First-Time Setup After Installation

### 1. Get OpenAI API Key
1. Visit https://platform.openai.com
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create new secret key**
5. **Copy the key** (starts with `sk-...`)
6. **Save it securely** - you won't see it again!

### 2. Configure the App
1. Open **My AI Clone** app
2. Tap the **Settings** icon (⚙️)
3. Paste your API key
4. Select **GPT-3.5 Turbo** (recommended for testing)
5. Tap **Save Settings**

### 3. Import Test Data
1. Export a WhatsApp chat:
   - Open WhatsApp
   - Select any chat
   - Tap ⋮ → More → Export chat → Without media
2. In My AI Clone:
   - Tap **Import Chats**
   - Enter your name (as shown in WhatsApp)
   - Select the exported .txt file
3. Wait for import to complete

### 4. Test the AI
1. Tap **Test AI Clone**
2. Type a message
3. See the AI respond in your style!

---

## 📱 System Requirements

### Minimum Requirements
- **Android Version:** 8.0 (Oreo) - API 26
- **RAM:** 2GB minimum
- **Storage:** 50MB for app + space for chat data
- **Internet:** Required for AI responses

### Recommended
- **Android Version:** 12.0 or higher
- **RAM:** 4GB or more
- **Storage:** 100MB+ free space

---

## 🏗️ Project Architecture

### Technology Stack
```
Frontend:
├── Jetpack Compose (UI)
├── Material 3 (Design System)
└── Navigation Compose

Backend:
├── Kotlin Coroutines (Async)
├── Flow (Reactive Streams)
└── DataStore (Preferences)

Data Layer:
├── Room Database (Local Storage)
├── Retrofit (API Client)
└── OkHttp (HTTP Client)

External:
└── OpenAI API (AI Responses)
```

### File Structure
```
My_AI_clone/
├── app/
│   ├── build.gradle.kts          # App dependencies
│   ├── proguard-rules.pro        # Code obfuscation
│   └── src/main/
│       ├── AndroidManifest.xml   # App configuration
│       ├── java/com/aiclone/app/
│       │   ├── MainActivity.kt   # Entry point
│       │   ├── data/
│       │   │   ├── local/        # Room database
│       │   │   ├── model/        # Data classes
│       │   │   ├── remote/       # API services
│       │   │   └── repository/   # Data repository
│       │   ├── domain/
│       │   │   └── parser/       # Chat parsers
│       │   ├── service/          # Background services
│       │   └── ui/
│       │       ├── navigation/   # App navigation
│       │       ├── screens/      # All UI screens
│       │       └── theme/        # Material 3 theme
│       └── res/
│           ├── values/           # Strings, colors, themes
│           └── xml/              # Backup rules
├── build.gradle.kts              # Project config
├── settings.gradle.kts           # Module config
├── gradle.properties             # Build properties
└── README.md                     # Documentation
```

---

## 🐛 Troubleshooting

### Build Issues

#### "SDK location not found"
**Solution:**
1. Open Android Studio
2. Go to **File → Project Structure → SDK Location**
3. Set Android SDK location (usually `C:\Users\[YourName]\AppData\Local\Android\Sdk`)
4. Click **Apply** and **OK**

#### "Gradle sync failed"
**Solution:**
1. Check internet connection
2. Click **File → Invalidate Caches → Invalidate and Restart**
3. Wait for Android Studio to restart
4. Try sync again

#### "Java version mismatch"
**Solution:**
1. Ensure JDK 17 is installed
2. In Android Studio: **File → Settings → Build, Execution, Deployment → Build Tools → Gradle**
3. Set **Gradle JDK** to JDK 17
4. Click **Apply**

#### "Unable to resolve dependency"
**Solution:**
1. Check internet connection
2. Try: **File → Sync Project with Gradle Files**
3. If still failing, delete `.gradle` folder and sync again

### Runtime Issues

#### "App crashes on launch"
**Possible causes:**
- Missing permissions in manifest
- Database migration issue
- Corrupted build

**Solution:**
1. Uninstall the app completely
2. Clean build: `.\gradlew clean`
3. Rebuild: `.\gradlew assembleDebug`
4. Reinstall

#### "API key error"
**Solution:**
- Verify API key is correct (starts with `sk-`)
- Check you have credits in OpenAI account
- Ensure internet connection is active

---

## 📦 Building Release APK

### Step 1: Create Keystore
```bash
keytool -genkey -v -keystore my-ai-clone.keystore -alias aiclone -keyalg RSA -keysize 2048 -validity 10000
```

### Step 2: Configure Signing
Add to `app/build.gradle.kts`:
```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("../my-ai-clone.keystore")
            storePassword = "your-password"
            keyAlias = "aiclone"
            keyPassword = "your-password"
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

### Step 3: Build Release
```bash
.\gradlew assembleRelease
```

**Output:** `app\build\outputs\apk\release\app-release.apk`

---

## 🧪 Testing Checklist

After building, test these features:

- [ ] App launches without crashes
- [ ] Home screen displays correctly
- [ ] Settings screen opens
- [ ] Can enter and save API key
- [ ] Import screen opens file picker
- [ ] Can import WhatsApp chat file
- [ ] Messages display in preview
- [ ] Chat test screen opens
- [ ] Can send messages to AI
- [ ] AI responds (with valid API key)
- [ ] Smart reply screen displays
- [ ] Dark mode works correctly

---

## 📊 Build Variants

### Debug Build
- **Purpose:** Development and testing
- **Optimizations:** Disabled
- **Logging:** Enabled
- **Size:** Larger (~15-20 MB)
- **Command:** `.\gradlew assembleDebug`

### Release Build
- **Purpose:** Production distribution
- **Optimizations:** Enabled (ProGuard)
- **Logging:** Disabled
- **Size:** Smaller (~8-12 MB)
- **Command:** `.\gradlew assembleRelease`

---

## 🔐 Security Notes

### API Key Storage
- API keys are stored in DataStore (encrypted by Android)
- Never commit API keys to version control
- Add `secrets.properties` to `.gitignore`

### ProGuard
- Release builds use ProGuard for code obfuscation
- Protects against reverse engineering
- Reduces APK size

---

## 📈 Next Steps

After successful build:

1. **Test thoroughly** on different devices
2. **Import real chat data** to train the AI
3. **Monitor API usage** on OpenAI dashboard
4. **Customize** the AI model settings
5. **Share feedback** or report issues

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review `README.md` for general info
3. Check `USER_GUIDE.md` for usage instructions
4. Verify all prerequisites are met
5. Try a clean build: `.\gradlew clean assembleDebug`

---

## ✅ Success Indicators

You've successfully built the app when:

✅ Gradle sync completes without errors  
✅ Build finishes with "BUILD SUCCESSFUL"  
✅ APK file is created in `app/build/outputs/apk/`  
✅ App installs on device without errors  
✅ App launches and shows home screen  
✅ All screens are accessible  

---

**Built with ❤️ using Kotlin, Jetpack Compose, and Material 3**

**Happy Building! 🚀**
