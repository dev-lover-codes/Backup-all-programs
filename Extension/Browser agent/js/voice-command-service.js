// Voice Command Service - Voice recognition and TTS
export class VoiceCommandService {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.wakePhrases = ['hey gemini', 'ok gemini', 'gemini'];
    }

    initialize() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            console.log('✅ Voice recognition initialized');
            return true;
        } else {
            console.warn('⚠️ Speech recognition not supported');
            return false;
        }
    }

    startListening(onCommand) {
        if (!this.recognition) {
            this.initialize();
        }

        if (!this.recognition) {
            return { success: false, error: 'Speech recognition not supported' };
        }

        this.isListening = true;
        let finalTranscript = '';

        this.recognition.onresult = (event) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript.toLowerCase().trim();

                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';

                    // Check for wake phrase
                    const hasWakePhrase = this.wakePhrases.some(phrase =>
                        finalTranscript.includes(phrase)
                    );

                    if (hasWakePhrase) {
                        // Remove wake phrase and execute command
                        let command = finalTranscript;
                        this.wakePhrases.forEach(phrase => {
                            command = command.replace(phrase, '').trim();
                        });

                        if (command) {
                            this.speak('Processing your command');
                            onCommand(command);
                            finalTranscript = '';
                        }
                    }
                } else {
                    interimTranscript += transcript;
                }
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                // Restart listening
                this.recognition.start();
            }
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                // Restart if still supposed to be listening
                this.recognition.start();
            }
        };

        this.recognition.start();
        console.log('🎤 Voice listening started');

        return { success: true };
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
            console.log('🔇 Voice listening stopped');
        }
    }

    speak(text, options = {}) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate || 1.0;
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;
        utterance.lang = options.lang || 'en-US';

        // Get available voices
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Prefer female voice if available
            const preferredVoice = voices.find(v => v.name.includes('Female')) || voices[0];
            utterance.voice = preferredVoice;
        }

        speechSynthesis.speak(utterance);

        return new Promise((resolve) => {
            utterance.onend = () => resolve({ success: true });
            utterance.onerror = (error) => resolve({ success: false, error });
        });
    }

    async speakResult(result) {
        let textToSpeak = '';

        if (typeof result === 'string') {
            textToSpeak = result;
        } else if (result.summary) {
            textToSpeak = result.summary;
        } else if (result.data && result.data.summary) {
            textToSpeak = result.data.summary;
        } else {
            textToSpeak = 'Task completed successfully';
        }

        // Limit length for TTS
        if (textToSpeak.length > 200) {
            textToSpeak = textToSpeak.substring(0, 200) + '... See full results in the extension.';
        }

        await this.speak(textToSpeak);
    }

    // Chrome TTS API (alternative method)
    async speakWithChromeTTS(text) {
        return new Promise((resolve) => {
            chrome.tts.speak(text, {
                rate: 1.0,
                pitch: 1.0,
                volume: 1.0
            }, () => {
                resolve({ success: true });
            });
        });
    }

    getAvailableVoices() {
        return speechSynthesis.getVoices();
    }

    isSpeechRecognitionSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
}

export default VoiceCommandService;
