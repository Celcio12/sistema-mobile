import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playKeypressSound: () => void;
  playActionSound: () => void;
  playWelcomeVoice: (adminName?: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [hasPlayedWelcome, setHasPlayedWelcome] = useState(() => {
    return localStorage.getItem('hasPlayedWelcome') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', String(isSoundEnabled));
  }, [isSoundEnabled]);

  const toggleSound = () => setIsSoundEnabled(!isSoundEnabled);

  // Synthesize sounds using Web Audio API for a lightweight approach without external assets
  const playTone = (frequency: number, type: OscillatorType, duration: number, volume: number = 0.1) => {
    if (!isSoundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const playKeypressSound = () => {
    playTone(600, 'sine', 0.05, 0.05);
  };

  const playActionSound = () => {
    playTone(800, 'sine', 0.1, 0.1);
    setTimeout(() => playTone(1200, 'sine', 0.15, 0.1), 50);
  };

  const playWelcomeVoice = (adminName?: string) => {
    if (!isSoundEnabled || hasPlayedWelcome) return;

    try {
      const synth = window.speechSynthesis;
      if (!synth) return;

      const text = adminName 
        ? `Bem-vindo, ${adminName}` 
        : "Bem-vindo, Senhor Administrador";

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-PT'; // Portuguese
      utterance.rate = 0.9;
      utterance.pitch = 1.1;

      // Try to find a female voice
      const voices = synth.getVoices();
      const femaleVoice = voices.find(v => v.lang.includes('pt') && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('luciana') || v.name.toLowerCase().includes('joana')));
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      synth.speak(utterance);
      
      setHasPlayedWelcome(true);
      localStorage.setItem('hasPlayedWelcome', 'true');
    } catch (e) {
      console.error("Speech synthesis failed", e);
    }
  };

  return (
    <SoundContext.Provider value={{ 
      isSoundEnabled, 
      toggleSound, 
      playKeypressSound, 
      playActionSound,
      playWelcomeVoice
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
