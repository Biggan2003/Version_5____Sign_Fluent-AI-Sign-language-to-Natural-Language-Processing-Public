import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Camera, 
  History, 
  Settings, 
  Play, 
  Square, 
  Download, 
  Trash2, 
  Languages,
  Cpu,
  Activity,
  User,
  Sun,
  Moon,
  BrainCircuit,
  ChevronDown,
  LogIn,
  UserCheck,
  Zap,
  ExternalLink,
  FlipHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { initMediaPipe, getLandmarkers } from './services/mediapipeService';
import { translateGestures, LandmarkData, generateSpeech } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Translation {
  id: string;
  text: string;
  timestamp: number;
  language: string;
}

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number }[] = [];
    const particleCount = 60;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 242, 255, 0.15)';
      ctx.fillStyle = 'rgba(188, 19, 254, 0.3)';

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.lineWidth = 1 - dist / 150;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

const CreatorFooter = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      className="absolute bottom-8 left-0 right-0 flex justify-center z-20"
    >
      <a 
        href="https://www.linkedin.com/in/g-m-biggan-371956305/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group relative px-6 py-2 glass-panel hover:border-cyber-blue/50 transition-all duration-500"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse shadow-[0_0_8px_rgba(0,242,255,0.8)]" />
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
            Creator-: <span className="font-black text-white group-hover:neon-text-blue transition-all duration-300">G. M Biggan</span>
          </p>
          <ExternalLink className="w-3 h-3 opacity-30 group-hover:opacity-100 group-hover:text-cyber-blue transition-all" />
        </div>
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyber-blue/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </a>
    </motion.div>
  );
};

const LandingPage = ({ onAuth }: { onAuth: (type: 'google' | 'guest') => void }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cyber-black">
      <NeuralBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full px-6 text-center space-y-12"
      >
        <div className="space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-cyber-blue via-cyber-purple to-cyber-pink flex items-center justify-center shadow-[0_0_50px_rgba(188,19,254,0.5)] mb-8"
          >
            <Cpu className="text-white w-12 h-12" />
          </motion.div>
          
          <h1 className="text-6xl md:text-7xl font-mono font-black tracking-tighter gradient-text drop-shadow-[0_0_30px_rgba(0,242,255,0.3)]">
            SIGNFLUENT AI
          </h1>
          <p className="text-sm md:text-base font-mono opacity-60 uppercase tracking-[0.3em] neon-text-purple">
            Neural Gesture Interpreter v2.0
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          <button 
            onClick={() => onAuth('google')}
            className="glass-panel p-6 flex flex-col items-center gap-4 hover:border-cyber-blue transition-all duration-500 group"
          >
            <div className="w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center group-hover:bg-cyber-blue/20 transition-colors">
              <LogIn className="w-6 h-6 text-cyber-blue" />
            </div>
            <div className="space-y-1">
              <p className="font-mono font-bold text-sm">Login with Google</p>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Secure Authentication</p>
            </div>
          </button>

          <button 
            onClick={() => onAuth('guest')}
            className="glass-panel p-6 flex flex-col items-center gap-4 hover:border-cyber-purple transition-all duration-500 group"
          >
            <div className="w-12 h-12 rounded-full bg-cyber-purple/10 flex items-center justify-center group-hover:bg-cyber-purple/20 transition-colors">
              <UserCheck className="w-6 h-6 text-cyber-purple" />
            </div>
            <div className="space-y-1">
              <p className="font-mono font-bold text-sm">Continue as Guest</p>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">View Portfolio Mode</p>
            </div>
          </button>
        </div>

        <div className="pt-12 flex items-center justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Real-time Inference</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Neural Mapping</span>
          </div>
        </div>
      </motion.div>

      <CreatorFooter />
    </div>
  );
};

// Helper to create WAV header for raw PCM data from Gemini TTS
const createWavHeader = (pcmData: Uint8Array, sampleRate: number = 24000) => {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcmData.length, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, pcmData.length, true);
  return header;
};

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Tamil'>('English');
  const [history, setHistory] = useState<Translation[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [status, setStatus] = useState('Initializing MediaPipe...');
  const [lastTranslation, setLastTranslation] = useState('');
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [usageCount, setUsageCount] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasTamilVoice, setHasTamilVoice] = useState(false);

  // Load Voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        const tamilVoice = availableVoices.find(v => 
          v.lang.startsWith('ta') || 
          v.name.toLowerCase().includes('tamil')
        );
        setHasTamilVoice(!!tamilVoice);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Load Auth State
  useEffect(() => {
    const storedGuestId = localStorage.getItem('guest_uuid');
    const storedUsageCount = localStorage.getItem('usage_count');
    const storedAuth = localStorage.getItem('is_authenticated');

    if (storedGuestId) setGuestId(storedGuestId);
    if (storedUsageCount) setUsageCount(parseInt(storedUsageCount, 10));
    if (storedAuth === 'true') setIsAuthenticated(true);
  }, []);

  const handleAuth = (type: 'google' | 'guest') => {
    if (type === 'guest') {
      let id = localStorage.getItem('guest_uuid');
      if (!id) {
        id = 'GUEST_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('guest_uuid', id);
        localStorage.setItem('usage_count', '0');
      }
      setGuestId(id);
      setIsAuthenticated(true);
      localStorage.setItem('is_authenticated', 'true');
    } else {
      // Mock Google Login for now as requested by UI requirements
      setIsAuthenticated(true);
      localStorage.setItem('is_authenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_authenticated');
  };
  
  const bufferRef = useRef<LandmarkData[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const isTranslatingRef = useRef(false);

  // Initialize MediaPipe
  useEffect(() => {
    const setup = async () => {
      try {
        await initMediaPipe();
        setIsLoaded(true);
        setStatus('Ready to translate');
        startCamera();
      } catch (err) {
        console.error(err);
        setStatus('Failed to load MediaPipe');
      }
    };
    setup();
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setStatus('Camera access denied');
      }
    }
  };

  const speak = useCallback(async (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Filter out error/unrecognized messages from being spoken
    const isErrorMessage = 
      text.includes("❌") || 
      text.includes("⚠️") || 
      text.includes("🔍") || 
      text.includes("🌐") ||
      text.includes("Unrecognized gesture") ||
      text.includes("Error") ||
      text.includes("failed");
    
    if (isErrorMessage) return;

    // Use Gemini TTS Fallback for Tamil if local voice is missing
    if (language === 'Tamil' && !hasTamilVoice) {
      setStatus('Neural Voice Generating...');
      try {
        const base64Audio = await generateSpeech(text, 'Tamil');
        if (base64Audio) {
          setStatus('Neural Voice Playing...');
          
          // Convert base64 to Uint8Array
          const binaryString = window.atob(base64Audio);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Create WAV blob
          const wavHeader = createWavHeader(bytes, 24000);
          const wavBlob = new Blob([wavHeader, bytes], { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(wavBlob);
          
          const audio = new Audio(audioUrl);
          audio.onended = () => {
            setStatus('Ready');
            URL.revokeObjectURL(audioUrl);
          };
          audio.onerror = (e) => {
            console.error("Audio playback error", e);
            setStatus('Playback Error');
          };
          
          await audio.play();
          return;
        }
      } catch (err) {
        console.error("Neural TTS Error:", err);
      }
      setStatus('Neural Voice Failed');
    }

    window.speechSynthesis.cancel(); // Stop current speech
    
    // Resume if paused (browser bug fix)
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    const targetLang = language === 'English' ? 'en-US' : 'ta-IN';
    utterance.lang = targetLang;

    // Try to find a specific voice for the language
    // Use the state voices or get them directly if state is empty
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    
    // Robust voice matching
    const voice = currentVoices.find(v => 
      v.lang === targetLang || 
      v.lang === targetLang.replace('-', '_') ||
      v.lang.toLowerCase().includes('tamil') ||
      v.lang.startsWith(targetLang.split('-')[0])
    );
    
    if (voice) {
      utterance.voice = voice;
    }

    // Adjust parameters for better clarity
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Error handling
    utterance.onerror = (event) => {
      console.error('SpeechSynthesisUtterance error', event);
    };

    window.speechSynthesis.speak(utterance);
  }, [language, voices]);

  const testVoice = () => {
    const text = language === 'English' ? "Testing English Voice" : "வணக்கம், குரல் சோதனை";
    speak(text);
  };

  const handleTranslation = useCallback(async () => {
    if (bufferRef.current.length === 0 || isTranslatingRef.current) return;
    
    isTranslatingRef.current = true;
    setStatus('Translating...');
    const currentBuffer = [...bufferRef.current];
    bufferRef.current = [];
    
    try {
      const result = await translateGestures(currentBuffer, language);
      
      // Update Usage Count
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('usage_count', newCount.toString());

      if (result.includes("RESOURCE_EXHAUSTED") || result.includes("429")) {
        setIsQuotaExceeded(true);
        setLastTranslation("⚠️ API Quota Exceeded. Please wait a moment before trying again.");
        setStatus('Quota Exceeded');
      } else if (result.includes("Unrecognized gesture")) {
        setLastTranslation("🔍 Unrecognized gesture. Please try to make the sign more clearly.");
        setStatus('Unclear Gesture');
      } else if (result.includes("Translation failed") || result.includes("Error")) {
        setLastTranslation("❌ Neural Engine Error: Statistical fault in gesture mapping.");
        setStatus('Engine Error');
      } else {
        setIsQuotaExceeded(false);
        setLastTranslation(result);
        speak(result);
        
        const newTranslation: Translation = {
          id: Math.random().toString(36).substr(2, 9),
          text: result,
          timestamp: Date.now(),
          language
        };
        
        setHistory(prev => [newTranslation, ...prev]);
        setStatus('Ready');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
        setIsQuotaExceeded(true);
        setLastTranslation("⚠️ API Quota Exceeded. The neural engine needs a short cooldown.");
        setStatus('Quota Exceeded');
      } else if (err.message?.includes("network") || !navigator.onLine) {
        setLastTranslation("🌐 Connection Error: Please check your internet connectivity.");
        setStatus('Offline');
      } else {
        setLastTranslation(`❌ System Fault: ${err.message || 'Unknown statistical error in neural processing'}`);
        setStatus('System Error');
      }
    } finally {
      isTranslatingRef.current = false;
    }
  }, [language, usageCount, speak]);

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isRecording) return;
    
    const { handLandmarker, faceLandmarker } = getLandmarkers();
    if (!handLandmarker || !faceLandmarker) {
      requestRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const startTimeMs = performance.now();
    
    try {
      const handResults = handLandmarker.detectForVideo(videoRef.current, startTimeMs);
      const faceResults = faceLandmarker.detectForVideo(videoRef.current, startTimeMs);

      // Draw landmarks
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw Hands
        if (handResults.landmarks) {
          ctx.fillStyle = '#00f2ff';
          handResults.landmarks.forEach(landmarks => {
            landmarks.forEach(l => {
              ctx.beginPath();
              ctx.arc(l.x * canvasRef.current!.width, l.y * canvasRef.current!.height, 2, 0, 2 * Math.PI);
              ctx.fill();
            });
          });
        }

        // Draw Face Mesh (simplified)
        if (faceResults.faceLandmarks) {
          ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
          faceResults.faceLandmarks.forEach(landmarks => {
            landmarks.forEach((l, i) => {
              if (i % 10 === 0) { // Only draw some points
                ctx.beginPath();
                ctx.arc(l.x * canvasRef.current!.width, l.y * canvasRef.current!.height, 1, 0, 2 * Math.PI);
                ctx.fill();
              }
            });
          });
        }
      }

      // Collect data
      bufferRef.current.push({
        hands: handResults.landmarks || [],
        face: faceResults.faceLandmarks || [],
        timestamp: Date.now()
      });

      // Auto-stop every 4 seconds if enabled
      if (autoTranslate && Date.now() - recordingStartTimeRef.current > 4000) {
        handleTranslation();
        recordingStartTimeRef.current = Date.now();
      }
    } catch (err) {
      console.error("Frame processing error:", err);
    }

    requestRef.current = requestAnimationFrame(processFrame);
  }, [isRecording, handleTranslation, autoTranslate]);

  useEffect(() => {
    if (isRecording) {
      recordingStartTimeRef.current = Date.now();
      requestRef.current = requestAnimationFrame(processFrame);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  }, [isRecording, processFrame]);

  const toggleRecording = () => {
    if (!isAuthenticated) return;
    if (isRecording) {
      handleTranslation();
    } else {
      bufferRef.current = [];
    }
    setIsRecording(!isRecording);
  };

  const handleRecalibrate = async () => {
    setStatus('Recalibrating...');
    try {
      await initMediaPipe();
      setStatus('Recalibration Complete');
      setTimeout(() => setStatus('Ready'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('Recalibration Failed');
    }
  };

  const handleResetAI = () => {
    setHistory([]);
    setLastTranslation('');
    bufferRef.current = [];
    setStatus('AI Reset Complete');
    setTimeout(() => setStatus('Ready'), 2000);
  };

  const exportHistory = () => {
    const content = history.map(h => `[${new Date(h.timestamp).toLocaleString()}] (${h.language}): ${h.text}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signfluent_history.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return <LandingPage onAuth={handleAuth} />;
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDarkMode ? "bg-cyber-black text-white" : "bg-slate-50 text-slate-900"
    )}>
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-blue via-cyber-purple to-cyber-pink flex items-center justify-center shadow-[0_0_20px_rgba(188,19,254,0.4)]">
              <Cpu className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-mono font-black tracking-tighter gradient-text">SIGNFLUENT AI</h1>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Neural Gesture Interpreter v2.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="text-[10px] font-mono opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full"
            >
              Logout
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-white/5 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-cyber-blue" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", isLoaded ? "bg-emerald-500" : "bg-amber-500")} />
              <span className="text-xs font-mono opacity-70">{status}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Camera & Controls */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative aspect-video glass-panel overflow-hidden neon-border-blue group">
            <video 
              ref={videoRef} 
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-transform duration-500",
                isMirrored && "-scale-x-100"
              )}
              muted 
              playsInline 
            />
            <canvas 
              ref={canvasRef} 
              className={cn(
                "absolute inset-0 w-full h-full z-20 transition-transform duration-500",
                isMirrored && "-scale-x-100"
              )}
              width={1280}
              height={720}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
            <div className="scanline" />
            
            {/* HUD Elements */}
            <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                <Activity className="w-3 h-3 text-cyber-blue" />
                <span className="text-[10px] font-mono tracking-widest uppercase">Live Stream</span>
              </div>
              <button 
                onClick={() => setIsMirrored(!isMirrored)}
                className={cn(
                  "flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1 rounded-full border transition-all",
                  isMirrored ? "border-cyber-blue/50 text-cyber-blue" : "border-white/10 text-white/50 hover:text-white"
                )}
              >
                <FlipHorizontal className="w-3 h-3" />
                <span className="text-[10px] font-mono tracking-widest uppercase">{isMirrored ? "Mirror ON" : "Mirror OFF"}</span>
              </button>
              {isRecording && (
                <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur px-3 py-1 rounded-full border border-red-500/50">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase text-red-500">Recording</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-6 right-6 z-30">
              <button 
                onClick={toggleRecording}
                disabled={!isLoaded}
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group",
                  isRecording 
                    ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)] hover:scale-110" 
                    : "bg-gradient-to-br from-cyber-blue to-cyber-purple shadow-[0_0_40px_rgba(0,242,255,0.6)] hover:scale-110"
                )}
              >
                {isRecording ? <Square className="text-white w-8 h-8" /> : <Play className="text-black w-8 h-8 fill-black" />}
              </button>
            </div>
          </div>

          {/* Translation Display - Moved outside video */}
          <div className="glass-panel p-8 neon-border-purple relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-24 h-24 text-cyber-purple animate-pulse" />
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-cyber-purple rounded-full shadow-[0_0_10px_rgba(188,19,254,0.8)]" />
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Neural Translation Output</p>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-cyber-purple/50 via-cyber-purple/20 to-transparent" />
              <p className={cn(
                "text-2xl font-mono min-h-[3rem] break-words transition-all duration-300",
                lastTranslation ? (
                  lastTranslation.includes("❌") || lastTranslation.includes("⚠️") || lastTranslation.includes("🔍") || lastTranslation.includes("🌐")
                    ? "text-red-400" 
                    : "text-white"
                ) : "text-white/30 italic"
              )}>
                {lastTranslation || "Waiting for gestures to interpret..."}
              </p>
            </div>
          </div>

          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="glass-panel p-5 neon-border-blue space-y-3">
              <label className="text-[10px] font-mono opacity-50 uppercase tracking-widest flex items-center gap-2">
                <Languages className="w-3 h-3 text-cyber-blue" /> Language
              </label>
              <div className="relative">
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-mono text-xs focus:outline-none focus:border-cyber-blue transition-colors appearance-none text-white cursor-pointer"
                >
                  <option value="English" className="bg-[#1a1a1a] text-white">English</option>
                  <option value="Tamil" className="bg-[#1a1a1a] text-white">Tamil</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-cyber-blue pointer-events-none" />
              </div>
            </div>

            <motion.div 
              animate={autoTranslate ? { 
                boxShadow: ["0 0 0px rgba(255,0,128,0)", "0 0 20px rgba(255,0,128,0.3)", "0 0 0px rgba(255,0,128,0)"] 
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                "glass-panel p-5 transition-all duration-500 space-y-3",
                autoTranslate ? "neon-border-pink border-cyber-pink/50 bg-cyber-pink/5" : "neon-border-pink opacity-80"
              )}
            >
              <label className="text-[10px] font-mono opacity-50 uppercase tracking-widest flex items-center gap-2">
                <Activity className={cn("w-3 h-3", autoTranslate ? "text-cyber-pink animate-pulse" : "text-cyber-pink/50")} /> 
                Auto-Translate
              </label>
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/10">
                <span className={cn("text-[10px] font-mono", autoTranslate ? "text-cyber-pink font-bold" : "opacity-70")}>
                  {autoTranslate ? "ACTIVE (4s)" : "OFF"}
                </span>
                <button 
                  onClick={() => setAutoTranslate(!autoTranslate)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-all duration-300 relative",
                    autoTranslate ? "bg-cyber-pink shadow-[0_0_10px_rgba(255,0,128,0.5)]" : "bg-white/20"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300",
                    autoTranslate ? "left-5.5" : "left-0.5"
                  )} />
                </button>
              </div>
            </motion.div>

            <div className="glass-panel p-5 neon-border-purple space-y-3">
              <label className="text-[10px] font-mono opacity-50 uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-3 h-3 text-cyber-purple" /> Maintenance
              </label>
              <div className="flex gap-2">
                <button 
                  onClick={handleRecalibrate}
                  className="cyber-button flex-1 py-2 text-[9px] hover:border-cyber-purple hover:shadow-[0_0_10px_rgba(188,19,254,0.3)]"
                >
                  RECALIBRATE
                </button>
                <button 
                  onClick={handleResetAI}
                  className="cyber-button flex-1 py-2 text-[9px] hover:border-cyber-purple hover:shadow-[0_0_10px_rgba(188,19,254,0.3)]"
                >
                  RESET AI
                </button>
              </div>
            </div>

            <div className="glass-panel p-5 neon-border-blue space-y-3">
              <label className="text-[10px] font-mono opacity-50 uppercase tracking-widest flex items-center gap-2">
                <Download className="w-3 h-3 text-cyber-blue" /> Export
              </label>
              <button 
                onClick={exportHistory}
                className="cyber-button w-full py-2 flex items-center justify-center gap-2 hover:border-cyber-blue hover:shadow-[0_0_10px_rgba(0,242,255,0.3)]"
              >
                <Download className="w-3 h-3" /> EXPORT LOGS
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-4 space-y-6">
          {/* Voice Diagnostic Panel */}
          <div className="glass-panel p-5 neon-border-blue space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-cyber-blue" />
                <h2 className="font-mono text-[10px] font-bold tracking-widest uppercase">Voice Diagnostic</h2>
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-tighter",
                language === 'Tamil' ? (hasTamilVoice ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400") : "bg-cyber-blue/20 text-cyber-blue"
              )}>
                {language === 'Tamil' ? (hasTamilVoice ? "Tamil Voice Ready" : "Neural Fallback Active") : "English Voice Ready"}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[9px] font-mono opacity-50 leading-relaxed">
                {language === 'Tamil' && !hasTamilVoice 
                  ? "🧠 Local Tamil voice not found. Switching to Neural Engine (Gemini TTS) for high-quality audio." 
                  : "Neural voice engine is synchronized. Click below to verify audio output."}
              </p>
              <button 
                onClick={testVoice}
                className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-cyber-blue/10 hover:border-cyber-blue/50 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-3 h-3" /> Test {language} Voice
              </button>
            </div>
          </div>

          <div className="glass-panel h-[calc(100vh-22rem)] flex flex-col neon-border-pink">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyber-pink" />
                <h2 className="font-mono text-sm font-bold tracking-widest uppercase">Translation Log</h2>
              </div>
              <button 
                onClick={() => setHistory([])}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
              >
                <Trash2 className="w-4 h-4 text-white/30 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                    <History className="w-12 h-12" />
                    <p className="font-mono text-xs uppercase tracking-widest">No records found</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyber-pink/30 transition-all duration-300 hover:bg-white/[0.07] group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[8px] font-mono opacity-40">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-[8px] font-mono px-2 py-1 rounded-full bg-cyber-pink/10 text-cyber-pink border border-cyber-pink/20">
                          {item.language}
                        </span>
                      </div>
                      <p className="text-sm font-mono leading-relaxed group-hover:text-cyber-pink transition-colors">{item.text}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4 neon-border-blue bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-blue to-cyber-purple flex items-center justify-center border border-white/10 shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">System Operator</p>
                <p className="text-sm font-mono font-black neon-text-blue">{guestId || 'AUTHORIZED_USER'}</p>
                <p className="text-[8px] font-mono opacity-40 mt-1">Inferences: {usageCount}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-cyber-blue" />
                <div className="w-1 h-1 rounded-full bg-cyber-purple" />
                <div className="w-1 h-1 rounded-full bg-cyber-pink" />
              </div>
              <p className="text-[8px] font-mono opacity-30 uppercase tracking-tighter">
                Neural Engine Active
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="relative pb-12 mt-auto">
        <CreatorFooter />
      </div>

      {/* Quota Warning Overlay */}
      {isQuotaExceeded && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] glass-panel p-4 neon-border-pink bg-red-500/10 flex items-center gap-4 animate-bounce">
          <Activity className="w-5 h-5 text-red-500" />
          <div className="space-y-1">
            <p className="text-xs font-mono font-bold text-red-500">API QUOTA EXCEEDED</p>
            <p className="text-[10px] font-mono opacity-70">Please wait a few minutes or disable Auto-Translate.</p>
          </div>
          <button 
            onClick={() => setIsQuotaExceeded(false)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Trash2 className="w-4 h-4 opacity-50" />
          </button>
        </div>
      )}

      {/* Setup Instructions Modal */}
      {!process.env.GEMINI_API_KEY && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-8 space-y-6 neon-border">
            <div className="text-center space-y-2">
              <Cpu className="w-12 h-12 text-cyber-blue mx-auto animate-pulse" />
              <h2 className="text-2xl font-mono font-bold neon-text">API KEY REQUIRED</h2>
            </div>
            <div className="space-y-4 text-sm font-mono opacity-80">
              <p>To enable neural translation, you must configure your Gemini API Key.</p>
              <div className="bg-black/50 p-4 rounded border border-white/10 space-y-2">
                <p className="text-xs text-cyber-blue">1. Go to AI Studio Settings</p>
                <p className="text-xs text-cyber-blue">2. Add Secret: GEMINI_API_KEY</p>
                <p className="text-xs text-cyber-blue">3. The app will rebuild automatically</p>
              </div>
              <p className="text-[10px] opacity-50 italic">
                Security Note: Keys are managed via environment variables and never hardcoded in source.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
