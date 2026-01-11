# Auto Video Converter - Makes x265 files playable

# This script auto-converts x265/HEVC files to H.264 for browser playback

import os
import sys
import subprocess
import json
from pathlib import Path

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        return True
    except:
        return False

def detect_codec(file_path):
    """Detect video codec using FFprobe"""
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=codec_name',
            '-of', 'json',
            file_path
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        data = json.loads(result.stdout)
        codec = data['streams'][0]['codec_name']
        return codec
    except:
        return None

def convert_video(input_file, output_file, progress_callback=None):
    """Convert video to H.264 with progress"""
    
    # Get duration first
    duration_cmd = [
        'ffprobe',
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'json',
        input_file
    ]
    duration_result = subprocess.run(duration_cmd, capture_output=True, text=True)
    duration_data = json.loads(duration_result.stdout)
    total_duration = float(duration_data['format']['duration'])
    
    # Convert command
    cmd = [
        'ffmpeg',
        '-i', input_file,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-progress', 'pipe:1',
        '-y',
        output_file
    ]
    
    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        universal_newlines=True
    )
    
    # Monitor progress
    for line in process.stdout:
        if line.startswith('out_time_ms='):
            time_ms = int(line.split('=')[1])
            time_s = time_ms / 1000000
            progress = (time_s / total_duration) * 100
            if progress_callback:
                progress_callback(min(progress, 100))
    
    process.wait()
    return process.returncode == 0

def process_video(video_path):
    """Main processing function"""
    
    print(f"Checking: {video_path}")
    
    # Check codec
    codec = detect_codec(video_path)
    print(f"Detected codec: {codec}")
    
    if codec in ['hevc', 'h265']:
        print("⚠️ HEVC/x265 detected! Converting...")
        
        # Generate output path
        input_path = Path(video_path)
        output_path = input_path.parent / f"{input_path.stem}_H264.mp4"
        
        print(f"Output: {output_path}")
        
        # Convert with progress
        def show_progress(pct):
            print(f"\rProgress: {pct:.1f}%", end='', flush=True)
        
        success = convert_video(str(input_path), str(output_path), show_progress)
        
        if success:
            print(f"\n✅ Conversion complete!")
            print(f"New file: {output_path}")
            return str(output_path)
        else:
            print(f"\n❌ Conversion failed!")
            return None
    else:
        print("✅ File is already compatible!")
        return video_path

if __name__ == "__main__":
    if not check_ffmpeg():
        print("❌ FFmpeg not installed!")
        print("Download: https://ffmpeg.org/download.html")
        sys.exit(1)
    
    if len(sys.argv) < 2:
        print("Usage: python converter.py <video_file>")
        sys.exit(1)
    
    video_file = sys.argv[1]
    
    if not os.path.exists(video_file):
        print(f"❌ File not found: {video_file}")
        sys.exit(1)
    
    result = process_video(video_file)
    
    if result:
        # Output JSON for integration
        print(json.dumps({
            'success': True,
            'output_file': result
        }))
    else:
        print(json.dumps({
            'success': False,
            'error': 'Conversion failed'
        }))
