# Installation Guide - ChatGPT Export Pro

## Method 1: Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store. This guide covers manual installation for now.

## Method 2: Manual Installation (Developer Mode)

### Step 1: Download the Extension
1. Download the extension files from GitHub or your source
2. Extract the ZIP file to a permanent location on your computer
   - **Important**: Don't delete this folder after installation!
   - Recommended location: `Documents/ChromeExtensions/chatgpt-export-pro/`

### Step 2: Enable Developer Mode
1. Open Google Chrome
2. Navigate to `chrome://extensions/` or:
   - Click the three dots menu (⋮) > **More tools** > **Extensions**
3. Enable **Developer mode** using the toggle in the top right corner

### Step 3: Load the Extension
1. Click the **"Load unpacked"** button
2. Navigate to the folder containing the extension files
3. Select the folder (make sure it contains `manifest.json`)
4. Click **"Select Folder"** or **"Open"**

### Step 4: Verify Installation
You should see:
- ✅ "ChatGPT Export Pro" in your extensions list
- ✅ The extension icon in your Chrome toolbar
- ✅ No error messages

If you see errors, check that:
- The folder contains all required files
- The `manifest.json` file is valid
- You selected the correct folder

### Step 5: Pin the Extension (Optional)
1. Click the puzzle piece icon (🧩) in Chrome toolbar
2. Find "ChatGPT Export Pro"
3. Click the pin icon to keep it visible

### Step 6: Test the Extension
1. Go to [ChatGPT](https://chat.openai.com) or [chatgpt.com](https://chatgpt.com)
2. You should see a floating **Export** button in the bottom-right corner
3. Click the extension icon to open the popup dashboard
4. Start a conversation and try exporting!

## Permissions Explained

The extension requests the following permissions:

### activeTab
- **Why**: To read conversation content from ChatGPT pages
- **When**: Only when you're on ChatGPT
- **Data**: Conversation text for export

### storage
- **Why**: To save your settings and conversations locally
- **Where**: Chrome's secure local storage (on your device)
- **Data**: Conversations, export preferences

### contextMenus
- **Why**: To add "Export to..." options in right-click menu
- **When**: On ChatGPT pages only

### downloads
- **Why**: To save exported files to your computer
- **What**: PDF, Markdown, Text, HTML files

### scripting
- **Why**: To inject the floating export button into ChatGPT
- **Security**: Only runs on ChatGPT domains

**Privacy Note**: This extension processes everything locally. No data is sent to external servers.

## Troubleshooting Installation

### Error: "Cannot load extension"
- **Solution**: Make sure you're selecting the root folder (containing manifest.json)
- Check that manifest.json is valid JSON

### Error: "Manifest file is missing or unreadable"
- **Solution**: Re-download the extension
- Ensure you extracted all files from the ZIP

### Extension icon not showing
- **Solution**: 
  - Try disabling and re-enabling the extension
  - Check if Developer mode is still enabled
  - Refresh Chrome by restarting it

### Floating button not appearing on ChatGPT
- **Solution**:
  - Refresh the ChatGPT page
  - Check that the extension is enabled
  - Open DevTools Console (F12) to check for errors
  - Make sure you're on chat.openai.com or chatgpt.com

### Exports not downloading
- **Solution**:
  - Check Chrome's download settings
  - Ensure pop-ups are allowed for ChatGPT
  - Check your Downloads folder permissions

## Updating the Extension

When a new version is available:

1. Download the new version
2. Extract to the SAME location as before (replacing old files)
3. Go to `chrome://extensions/`
4. Click the refresh icon (🔄) on the ChatGPT Export Pro card
5. Verify the version number updated

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "ChatGPT Export Pro"
3. Click **"Remove"**
4. Confirm deletion
5. (Optional) Delete the extension folder from your computer

**Note**: Your saved conversations in local storage will be deleted when you uninstall.

## Getting Help

If you encounter issues:

1. **Check the console**: Open DevTools (F12) and look for error messages
2. **Try incognito mode**: Test if the issue persists in incognito
3. **Disable other extensions**: Check for conflicts
4. **Report an issue**: Open a GitHub issue with:
   - Chrome version
   - Extension version
   - Steps to reproduce
   - Error messages

## Chrome Web Store Submission (For Developers)

To submit to Chrome Web Store:

1. Create a Chrome Web Store developer account
2. Package the extension as a ZIP file
3. Upload to Chrome Web Store Developer Dashboard
4. Fill in all required metadata
5. Submit for review
6. Wait for approval (typically 1-3 days)

---

**Need more help?** Check the main [README.md](README.md) or open an issue on GitHub.
