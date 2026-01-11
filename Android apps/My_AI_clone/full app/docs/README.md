# My AI Clone - Android App

A modern Android application that trains an AI to respond like you based on your chat history. Import your WhatsApp chats, train the AI on your communication style, and get smart reply suggestions.

## Features

✨ **Chat Import** - Import WhatsApp chat exports and parse them automatically  
🤖 **AI Training** - Train AI on your conversation style using OpenAI GPT  
💬 **Test Interface** - Chat with your AI clone to see how it responds  
🔔 **Smart Replies** - Get AI-generated reply suggestions for incoming messages  
⚙️ **Customizable** - Choose between GPT-3.5 or GPT-4 models  
🎨 **Beautiful UI** - Modern Material 3 design with dark mode support  

## Screenshots

[Screenshots will be added after building the app]

## Tech Stack

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose with Material 3
- **Architecture**: MVVM with Repository pattern
- **Database**: Room (SQLite)
- **Networking**: Retrofit + OkHttp
- **AI Integration**: OpenAI API
- **Async**: Kotlin Coroutines + Flow
- **Storage**: DataStore for preferences

## Prerequisites

Before building the app, ensure you have:

1. **Android Studio** (Arctic Fox or later)
2. **JDK 17** or higher
3. **Android SDK** with:
   - Android 14.0 (API 34) - Target SDK
   - Android 8.0 (API 26) - Minimum SDK
4. **OpenAI API Key** (get from [platform.openai.com](https://platform.openai.com))

## Setup Instructions

### 1. Clone/Open the Project

Open this project folder in Android Studio.

### 2. Sync Gradle

Android Studio should automatically sync Gradle. If not:
- Click **File → Sync Project with Gradle Files**

### 3. Build the Project

```bash
# From terminal in project root
./gradlew assembleDebug

# Or on Windows
gradlew.bat assembleDebug
```

### 4. Install on Device/Emulator

```bash
# Install debug APK
./gradlew installDebug

# Or use Android Studio's Run button (Shift+F10)
```

## How to Use

### Step 1: Get an API Key

1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Create a new secret key
5. Copy the key (starts with `sk-...`)

### Step 2: Configure the App

1. Open the app
2. Tap **Settings** (gear icon)
3. Paste your API key
4. Choose your preferred AI model (GPT-3.5 or GPT-4)
5. Tap **Save Settings**

### Step 3: Import Your Chats

1. Export a WhatsApp chat:
   - Open WhatsApp
   - Open a chat
   - Tap ⋮ (three dots) → **More** → **Export chat**
   - Choose **Without media**
   - Save the .txt file
2. In the app, tap **Import Chats**
3. Enter your name (as it appears in the chat)
4. Tap **Select Chat File**
5. Choose the exported .txt file

### Step 4: Test Your AI Clone

1. Tap **Test AI Clone**
2. Start chatting with your AI
3. See how it responds based on your chat history

### Step 5: Use Smart Replies (Future Feature)

- Grant notification access permission
- Receive message notifications
- View AI-generated reply suggestions
- Copy and send replies manually

## Project Structure

```
app/src/main/java/com/aiclone/app/
├── data/
│   ├── local/          # Room database
│   ├── model/          # Data models
│   ├── remote/         # API services
│   └── repository/     # Repository pattern
├── domain/
│   └── parser/         # Chat parsers
├── service/            # Background services
├── ui/
│   ├── navigation/     # Navigation setup
│   ├── screens/        # All app screens
│   └── theme/          # Material 3 theme
└── MainActivity.kt     # Entry point
```

## Building Release APK

To build a signed release APK:

1. Create a keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Add to `app/build.gradle.kts`:
```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("path/to/my-release-key.keystore")
            storePassword = "your-password"
            keyAlias = "my-key-alias"
            keyPassword = "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
        }
    }
}
```

3. Build:
```bash
./gradlew assembleRelease
```

APK will be in: `app/build/outputs/apk/release/`

## Important Notes

⚠️ **Privacy**: Your chat data stays on your device. It's only sent to OpenAI when generating responses.

⚠️ **API Costs**: OpenAI API usage incurs costs. Monitor your usage at platform.openai.com.

⚠️ **Platform Limitations**: Automatic sending on WhatsApp/Instagram may violate their Terms of Service. This app generates suggestions for manual sending.

⚠️ **Permissions**: The app requires:
- Internet access (for AI API)
- Storage access (to read chat exports)
- Notification access (for smart replies - optional)

## Troubleshooting

### Build Fails
- Ensure you have JDK 17 installed
- Check that Android SDK is properly configured
- Try **File → Invalidate Caches → Invalidate and Restart**

### API Errors
- Verify your API key is correct
- Check you have credits in your OpenAI account
- Ensure you have internet connection

### Import Fails
- Check the chat export format is correct
- Ensure your name matches exactly as in the chat
- Try exporting a different chat

## Future Enhancements

- [ ] Support for Instagram DM exports
- [ ] Email integration (Gmail API)
- [ ] Multi-language support
- [ ] Voice message analysis
- [ ] Conversation analytics
- [ ] Custom AI personality tuning
- [ ] Backup/restore functionality

## License

This project is for educational purposes. Please respect the Terms of Service of all platforms (WhatsApp, Instagram, OpenAI, etc.).

## Support

For issues or questions, please check:
- OpenAI API documentation: [platform.openai.com/docs](https://platform.openai.com/docs)
- Android development: [developer.android.com](https://developer.android.com)

---

**Built with ❤️ using Kotlin and Jetpack Compose**
