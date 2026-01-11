import os
import subprocess
import pyautogui
import time
import numpy as np
import sounddevice as sd
import soundfile as sf
import speech_recognition as sr
import pyttsx3
from google import genai
from google.genai import types

# --- Configuration ---
SAMPLE_RATE = 44100  # Hertz
CHANNELS = 1
TEMP_AUDIO_FILE = "temp_input.wav"

# --- Initialize TTS Engine ---
engine = pyttsx3.init()
voices = engine.getProperty('voices')
# Try to set a female voice if available, otherwise default
for voice in voices:
    if "female" in voice.name.lower() or "zira" in voice.name.lower():
        engine.setProperty('voice', voice.id)
        break
engine.setProperty('rate', 175) # Speed of speech

def speak(text):
    """Converts text to speech."""
    print(f"Agent (Voice): {text}")
    engine.say(text)
    engine.runAndWait()

def listen():
    """Records audio from microphone with dynamic silence detection."""
    r = sr.Recognizer()
    
    print("Listening... (Speak now)")
    try:
        # Dynamic recording using sounddevice
        # We will record in chunks and detect silence
        THRESHOLD = 0.02  # Silence threshold (adjust based on mic)
        SILENCE_LIMIT = 2.0  # Seconds of silence to stop recording
        PRE_RECORD_BUFFER = 0.5 # Seconds to keep before trigger
        
        audio_chunks = []
        silence_start_time = None
        started_speaking = False
        start_time = time.time()
        
        # Stream parameters
        block_size = int(SAMPLE_RATE * 0.1) # 100ms chunks
        
        with sd.InputStream(samplerate=SAMPLE_RATE, channels=CHANNELS, dtype='float32') as stream:
            while True:
                # Read chunk
                data, overflowed = stream.read(block_size)
                if overflowed:
                    print("Audio buffer overflow")
                
                rms = np.sqrt(np.mean(data**2))
                
                if started_speaking:
                    audio_chunks.append(data)
                    if rms < THRESHOLD:
                        if silence_start_time is None:
                            silence_start_time = time.time()
                        elif time.time() - silence_start_time > SILENCE_LIMIT:
                            print("Silence detected, stopping...")
                            break
                    else:
                        silence_start_time = None # Reset silence timer
                else:
                    # Buffer pre-speech audio
                    audio_chunks.append(data)
                    # Keep only last few chunks for pre-record buffer
                    max_chunks = int(PRE_RECORD_BUFFER / 0.1)
                    if len(audio_chunks) > max_chunks:
                        audio_chunks.pop(0)
                        
                    if rms > THRESHOLD:
                        print("Voice detected! Recording...")
                        started_speaking = True
                        silence_start_time = None
                
                # Timeout if nothing heard for too long (e.g. 10 seconds)
                if not started_speaking and (time.time() - start_time > 10):
                    print("Timeout: No speech detected.")
                    return None

        # Concatenate chunks
        if not audio_chunks:
            return None
            
        recording = np.concatenate(audio_chunks, axis=0)
        
        # Save to temporary file
        sf.write(TEMP_AUDIO_FILE, recording, SAMPLE_RATE)
        
        # Transcribe using SpeechRecognition
        with sr.AudioFile(TEMP_AUDIO_FILE) as source:
            audio = r.record(source)
            try:
                text = r.recognize_google(audio)
                print(f"You said: {text}")
                return text
            except sr.UnknownValueError:
                print("Could not understand audio")
                return None
            except sr.RequestError as e:
                print(f"Could not request results; {e}")
                return None
    except Exception as e:
        print(f"Error in listening: {e}")
        return None
    finally:
        if os.path.exists(TEMP_AUDIO_FILE):
            try:
                os.remove(TEMP_AUDIO_FILE)
            except:
                pass

# --- 1. Define The "God Mode" Tools ---

def open_app(app_name: str):
    """Opens an application on the computer."""
    system = os.name
    try:
        if system == 'nt': # Windows
            subprocess.Popen(["start", app_name], shell=True)
        elif system == 'posix': # Mac/Linux
            subprocess.Popen(["open", "-a", app_name])
        return f"Opening {app_name}..."
    except Exception as e:
        return f"Error opening app: {e}"

def move_mouse_and_click(x: int, y: int, double_click: bool = False):
    """Moves mouse to (x, y) and clicks. Screen starts at (0,0) top-left."""
    try:
        # SAFETY DELAY: Gives you 2 seconds to move mouse to corner to ABORT if needed
        time.sleep(2) 
        pyautogui.moveTo(x, y, duration=1)
        if double_click:
            pyautogui.doubleClick()
        else:
            pyautogui.click()
        return f"Clicked at {x}, {y}"
    except Exception as e:
        return f"Failed to move mouse: {e}"

def type_text(text: str):
    """Types text on the keyboard exactly as if you typed it."""
    try:
        time.sleep(1) # Wait for you to focus the window
        pyautogui.write(text, interval=0.1)
        return "Typing complete."
    except Exception as e:
        return f"Typing failed: {e}"

def get_screen_size():
    """Returns the width and height of the screen."""
    w, h = pyautogui.size()
    return f"Screen size is width: {w}, height: {h}"

# --- 2. Initialize Gemini with these Tools ---
client = genai.Client(api_key="AIzaSyD5V9whqanBh_83TF8alaapCxSW-USLgvM")

# Add tools to the list
my_tools = [open_app, move_mouse_and_click, type_text, get_screen_size]

chat = client.chats.create(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(
        tools=my_tools,
        automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=False),
        system_instruction="""
        You are a helpful and intelligent voice assistant, like Jarvis or Friday.
        1. You have control over the user's computer.
        2. Always ask for SCREEN SIZE first if you need to move the mouse.
        3. Be careful with mouse movements.
        4. If the user asks to open an app, use 'open_app'.
        5. Keep your responses concise, natural, and conversational as they will be spoken out loud.
        6. If the user just wants to chat, be friendly and helpful.
        """
    )
)

def run_agent(user_prompt):
    response = chat.send_message(user_prompt)
    return response.text

if __name__ == "__main__":
    print("AI Voice Agent started.")
    speak("Hello! I am your AI assistant. How can I help you?")
    
    while True:
        user_input = listen()
        
        if user_input:
            if user_input.lower() in ["exit", "quit", "stop", "bye"]:
                speak("Goodbye!")
                break
            
            try:
                response = run_agent(user_input)
                speak(response)
            except Exception as e:
                print(f"Error: {e}")
                speak("I encountered an error.")
        else:
            # Optional: Ask if they are still there?
            pass