# AI Browser Agent - Setup & Installation Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Browser Agent - Setup Wizard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Chrome is installed
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) {
    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
}

if (Test-Path $chromePath) {
    Write-Host "✓ Chrome detected" -ForegroundColor Green
} else {
    Write-Host "✗ Chrome not found. Please install Google Chrome." -ForegroundColor Red
    exit 1
}

# Check if icons directory exists
if (-not (Test-Path "icons")) {
    Write-Host "Creating icons directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "icons" | Out-Null
}

# Verify required files
$requiredFiles = @(
    "manifest.json",
    "background.js",
    "content.js",
    "popup.html",
    "popup.css",
    "popup.js",
    "config.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file missing" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Missing files detected. Please ensure all files are present." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Get your Gemini API Key:" -ForegroundColor Yellow
Write-Host "   → Visit: https://makersuite.google.com/app/apikey" -ForegroundColor White
Write-Host ""
Write-Host "2. Load the extension in Chrome:" -ForegroundColor Yellow
Write-Host "   → Open Chrome and go to: chrome://extensions/" -ForegroundColor White
Write-Host "   → Enable 'Developer mode' (toggle in top-right)" -ForegroundColor White
Write-Host "   → Click 'Load unpacked'" -ForegroundColor White
Write-Host "   → Select this folder: $PWD" -ForegroundColor White
Write-Host ""
Write-Host "3. Configure the extension:" -ForegroundColor Yellow
Write-Host "   → Click the extension icon in Chrome toolbar" -ForegroundColor White
Write-Host "   → Enter your Gemini API key" -ForegroundColor White
Write-Host "   → Click 'Save API Key'" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Quick Test Commands" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Try these commands after setup:" -ForegroundColor Yellow
Write-Host "  • Search for Albert Einstein on Wikipedia" -ForegroundColor White
Write-Host "  • Find the best price for iPhone 15" -ForegroundColor White
Write-Host "  • Get latest news on artificial intelligence" -ForegroundColor White
Write-Host "  • Summarize this page" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Need Help?" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Read QUICKSTART.md for quick guide" -ForegroundColor White
Write-Host "📚 Read README.md for full documentation" -ForegroundColor White
Write-Host "🐛 Report issues on GitHub" -ForegroundColor White
Write-Host ""
Write-Host "Ready to install! Follow the instructions above." -ForegroundColor Green
Write-Host ""

# Ask if user wants to open Chrome extensions page
$response = Read-Host "Would you like to open Chrome extensions page now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Start-Process "chrome://extensions/"
    Write-Host ""
    Write-Host "Chrome extensions page opened!" -ForegroundColor Green
    Write-Host "Remember to enable 'Developer mode' and click 'Load unpacked'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup wizard complete! 🎉" -ForegroundColor Cyan
