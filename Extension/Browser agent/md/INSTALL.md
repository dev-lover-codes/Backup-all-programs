# Installation Verification Checklist

## ✅ Quick Verification

Run these commands to verify your installation:

### 1. Check File Structure
```powershell
Get-ChildItem -Recurse -File | Select-Object Name, Length
```

### 2. Verify Required Files
```powershell
$required = @(
    "manifest.json",
    "background.js",
    "content.js",
    "popup.html",
    "popup.css",
    "popup.js",
    "config.js"
)

foreach ($file in $required) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file MISSING" -ForegroundColor Red
    }
}
```

### 3. Check Services
```powershell
Get-ChildItem services/*.js | ForEach-Object { Write-Host "✓ $_" -ForegroundColor Green }
```

### 4. Check Icons
```powershell
Get-ChildItem icons/*.png | ForEach-Object { Write-Host "✓ $_" -ForegroundColor Green }
```

## 📋 Manual Verification

### Required Files Checklist
- [ ] manifest.json
- [ ] background.js
- [ ] content.js
- [ ] popup.html
- [ ] popup.css
- [ ] popup.js
- [ ] config.js
- [ ] injected.js

### Services Checklist
- [ ] services/gemini-service.js
- [ ] services/command-parser.js
- [ ] services/price-tracker.js
- [ ] services/task-scheduler.js

### Icons Checklist
- [ ] icons/icon16.png
- [ ] icons/icon48.png
- [ ] icons/icon128.png

### Documentation Checklist
- [ ] README.md
- [ ] QUICKSTART.md
- [ ] TESTING.md
- [ ] API.md
- [ ] PROJECT_SUMMARY.md
- [ ] LICENSE

## 🚀 Installation Steps

### Step 1: Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

### Step 2: Load Extension in Chrome
1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable "Developer mode" (top-right toggle)
4. Click "Load unpacked"
5. Select this folder: `d:\raaj\Projects\Programs\Extension\Browser agent`

### Step 3: Configure Extension
1. Click extension icon in Chrome toolbar
2. Enter your Gemini API key
3. Click "Save API Key"
4. Wait for "Ready" status

## 🧪 Quick Test

After installation, try these commands:

1. **Wikipedia Search**
   ```
   Search for Albert Einstein on Wikipedia
   ```

2. **Price Comparison**
   ```
   Find the best price for iPhone 15
   ```

3. **Page Summary**
   - Navigate to any article
   - Click extension icon
   - Click "📄 Summarize Page"

## ⚠️ Troubleshooting

### Extension Won't Load
- Check that all files are present
- Look for errors in Chrome DevTools
- Verify manifest.json is valid JSON

### API Key Not Saving
- Check Chrome storage permissions
- Try reloading the extension
- Check browser console for errors

### Commands Not Working
- Verify API key is correct
- Check internet connection
- Look for rate limit messages
- Check Gemini API status

### Scraping Not Working
- Some sites block automated access
- Try different websites
- Check content script injection

## 📞 Need Help?

1. **Read Documentation**
   - README.md - Full documentation
   - QUICKSTART.md - Quick start guide
   - TESTING.md - Testing guide
   - API.md - API reference

2. **Check Console**
   - Chrome DevTools → Console
   - Look for error messages
   - Check network requests

3. **Report Issues**
   - GitHub Issues
   - Include error messages
   - Describe steps to reproduce

## ✨ You're All Set!

If all checkboxes are checked and the extension loads without errors, you're ready to use AI Browser Agent!

**Enjoy your AI-powered browsing! 🚀**
