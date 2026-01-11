@echo off
setlocal enabledelayedexpansion

:: Auto Video Converter for Local Media Player Pro
:: Converts x265/HEVC files to H.264 automatically

echo ================================================
echo    Auto Video Converter
echo    Makes x265 files playable in browser
echo ================================================
echo.

:: Check if FFmpeg is installed
where ffmpeg >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: FFmpeg is not installed!
    echo.
    echo Please download FFmpeg from: https://ffmpeg.org/download.html
    echo Or install with: winget install FFmpeg
    echo.
    pause
    exit /b 1
)

echo [OK] FFmpeg found!
echo.

:: Check if file was provided
if "%~1"=="" (
    echo ERROR: Please drag and drop a video file onto this script!
    echo.
    echo Usage: Drag your MKV/MP4 file onto this .bat file
    echo.
    pause
    exit /b 1
)

set "INPUT_FILE=%~1"
set "FILE_NAME=%~n1"
set "FILE_DIR=%~dp1"
set "OUTPUT_FILE=%FILE_DIR%%FILE_NAME%_H264.mp4"

echo Input:  %INPUT_FILE%
echo Output: %OUTPUT_FILE%
echo.

:: Detect codec
echo [1/3] Detecting codec...
for /f "tokens=*" %%i in ('ffprobe -v error -select_streams v:0 -show_entries stream^=codec_name -of default^=noprint_wrappers^=1:nokey^=1 "%INPUT_FILE%" 2^>nul') do set "CODEC=%%i"

echo Codec: %CODEC%
echo.

:: Check if conversion needed
if /i "%CODEC%"=="hevc" goto CONVERT
if /i "%CODEC%"=="h265" goto CONVERT

echo [OK] File is already H.264! No conversion needed.
echo This file will play in the browser.
echo.
pause
exit /b 0

:CONVERT
echo [WARNING] HEVC/x265 detected! This won't play in browsers.
echo [2/3] Converting to H.264...
echo.
echo This may take a while depending on file size.
echo Progress will be shown below.
echo.

:: Convert with progress
ffmpeg -i "%INPUT_FILE%" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -y "%OUTPUT_FILE%" -progress pipe:1 2>nul | findstr /C:"out_time"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [3/3] SUCCESS! Conversion complete.
    echo.
    echo New file created: %OUTPUT_FILE%
    echo.
    echo You can now play this file in the browser!
    echo.
    echo File sizes:
    echo   Original: %~z1 bytes
    for %%A in ("%OUTPUT_FILE%") do echo   Converted: %%~zA bytes
    echo.
    echo TIP: You can delete the original x265 file if you want.
    echo.
) else (
    echo.
    echo [ERROR] Conversion failed!
    echo.
    echo Possible reasons:
    echo - Corrupted video file
    echo - Unsupported format
    echo - Disk space full
    echo.
)

pause
