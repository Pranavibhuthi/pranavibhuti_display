import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Globe, Sparkles, Navigation, Play, AlertCircle } from 'lucide-react';

interface VoiceAssistantProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onAddNotification: (text: string) => void;
}

export const INDIAN_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', nativeName: 'English' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

export default function VoiceAssistant({ 
  currentTab, 
  onNavigate, 
  onAddNotification 
}: VoiceAssistantProps) {
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponseText, setAiResponseText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionError, setRecognitionError] = useState('');
  const [demoCommandText, setDemoCommandText] = useState('');

  // Native Web Speech Recognition
  let recognition: any = null;
  if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
  }

  useEffect(() => {
    if (!recognition) return;

    recognition.lang = selectedLang;

    recognition.onstart = () => {
      setIsListening(true);
      setRecognitionError('');
    };

    recognition.onresult = async (event: any) => {
      const resultText = event.results[0][0].transcript;
      setTranscript(resultText);
      handleVoiceCommand(resultText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setRecognitionError(`Speech Error: ${event.error}. You can use the Quick-Text command console below.`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

  }, [selectedLang]);

  const toggleListening = () => {
    if (!recognition) {
      setRecognitionError('Web Speech API is not fully supported in this sandboxed frame. Please use the Quick-Text command simulator below to test any voice intent!');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setAiResponseText('');
      try {
        recognition.start();
      } catch (err: any) {
        setRecognitionError('Recognition failed to start. Feel free to use the Command Simulator.');
      }
    }
  };

  const handleVoiceCommand = async (commandString: string) => {
    if (!commandString) return;

    try {
      const response = await fetch('/api/ai/voice-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandString, currentTab })
      });

      const data = await response.json();
      setAiResponseText(data.spokenConfirmation || "Command understood.");

      if (data.action === 'navigate' && data.targetTab) {
        onNavigate(data.targetTab);
        onAddNotification(`Voice Command: Directed to ${data.targetTab.toUpperCase()}`);
      }

      // Speak confirmation
      speakText(data.spokenConfirmation || "Opening target module.");
    } catch (err) {
      console.error("Failed to route voice command", err);
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select best language voice if matching
    const matchingVoice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith(selectedLang.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleDemoCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoCommandText) return;
    setTranscript(demoCommandText);
    handleVoiceCommand(demoCommandText);
    setDemoCommandText('');
  };

  const currentLangObj = INDIAN_LANGUAGES.find(l => l.code === selectedLang) || INDIAN_LANGUAGES[0];

  return (
    <div id="voice-assistant-card" className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden border border-slate-800">
      
      {/* Decorative vector grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        
        {/* Title and language */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-extrabold tracking-tight">Voice Command Console</h3>
            <span className="bg-sky-500/20 text-sky-300 font-mono text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold">
              Multi-lingual Smart Assist
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-md">
            Say commands like <span className="text-emerald-400 font-mono font-semibold">"book a doctor appointment"</span>, <span className="text-emerald-400 font-mono font-semibold">"order medicines"</span>, or <span className="text-emerald-400 font-mono font-semibold">"open health locker"</span> to jump tabs instantly.
          </p>

          <div className="flex items-center gap-2 mt-2">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <select
              id="voice-language-selector"
              value={selectedLang}
              onChange={(e) => {
                setSelectedLang(e.target.value);
                setRecognitionError('');
              }}
              className="bg-slate-800/80 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {INDIAN_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900 bg-white">
                  {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Mic trigger */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            id="voice-mic-trigger"
            onClick={toggleListening}
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isListening 
                ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
            title="Start Listening"
          >
            {isListening ? <Mic className="h-7 w-7" /> : <MicOff className="h-7 w-7" />}
          </button>

          <div className="text-xs">
            <p className="font-bold">{isListening ? "Listening actively..." : "Mic is inactive"}</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Lang: {currentLangObj.name}</p>
          </div>
        </div>
      </div>

      {/* Waveform Visualization (Shows when speaking or listening) */}
      {(isListening || isSpeaking) && (
        <div className="mt-4 flex items-center justify-center gap-1.5 py-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full ${isListening ? 'bg-rose-400' : 'bg-emerald-400'}`}
              style={{
                height: `${Math.floor(Math.random() * 32) + 8}px`,
                animation: 'pulse 1s infinite alternate',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Transcript Results */}
      {(transcript || aiResponseText) && (
        <div className="mt-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
          {transcript && (
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider shrink-0 mt-0.5 text-[9px]">You said:</span>
              <p className="text-slate-100 font-medium italic">"{transcript}"</p>
            </div>
          )}
          {aiResponseText && (
            <div className="flex items-start gap-2 pt-2 border-t border-slate-800">
              <span className="font-bold text-emerald-400 uppercase tracking-wider shrink-0 mt-0.5 text-[9px]">AI Speaks:</span>
              <p className="text-emerald-100 font-semibold">{aiResponseText}</p>
              <button 
                id="voice-replay-btn"
                onClick={() => speakText(aiResponseText)} 
                className="ml-auto text-slate-400 hover:text-white shrink-0"
                title="Replay Audio"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sandboxed iframe friendly Voice Command simulator fallback */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <form id="voice-sim-form" onSubmit={handleDemoCommandSubmit} className="flex gap-2">
          <input
            id="voice-sim-input"
            type="text"
            value={demoCommandText}
            onChange={(e) => setDemoCommandText(e.target.value)}
            placeholder='Type command: "book doctor", "open health locker", "vaccine", "buy insulin"'
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            id="voice-sim-send"
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Send Command</span>
          </button>
        </form>
      </div>

      {recognitionError && (
        <div className="mt-3 flex items-start gap-2 text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 leading-relaxed">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{recognitionError}</p>
        </div>
      )}
    </div>
  );
}
