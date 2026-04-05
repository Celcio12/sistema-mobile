import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Store, ChevronRight } from 'lucide-react';
import { testSupabaseConnection } from '../lib/supabase';
import { useSound } from '../contexts/SoundContext';
import { useSupabaseTable } from '../hooks/useSupabaseTable';

const IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1080"
];

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { data: settingsData } = useSupabaseTable<any>('settings');
  const currentSettings = settingsData?.find((s: any) => s.id === 'system-settings') || settingsData?.[0] || {};
  const companyName = currentSettings.name || 'Cantina EP';

  const [currentImage, setCurrentImage] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const { playKeypressSound, playActionSound, playWelcomeVoice } = useSound();

  useEffect(() => {
    // Testa a conexão com o banco de dados assim que a tela de login carrega
    testSupabaseConnection().then(isOk => {
      setDbStatus(isOk ? 'ok' : 'error');
    });

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playActionSound();
    setError('');
    
    if (dbStatus === 'error') {
      setError('Erro de conexão com o banco de dados. Verifique se as tabelas foram criadas no Supabase.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (username !== 'admin') {
        setError('Nome de utilizador incorreto');
        setIsLoading(false);
      } else if (password !== '123') {
        setError('Senha incorreta');
        setIsLoading(false);
      } else {
        playWelcomeVoice("Senhor Administrador");
        onLogin();
      }
    }, 1500);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    playKeypressSound();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    playKeypressSound();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentImage}
          src={IMAGES[currentImage]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md p-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-[2rem] p-8"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#FF7A00] p-4 rounded-3xl mb-4 shadow-lg flex items-center justify-center">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md text-center">{companyName}</h1>
            <p className="text-white/80 font-bold tracking-widest text-xs mt-1 uppercase text-center">Gestão Mobile v2.0.0</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-white font-bold text-xs uppercase tracking-wider mb-2 drop-shadow-sm">Nome de Utilizador</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/20 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="Utilizador"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-bold text-xs uppercase tracking-wider mb-2 drop-shadow-sm">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/20 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="Senha"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-300 text-sm font-medium text-center bg-red-900/30 py-2 rounded-xl">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1A2235] hover:bg-[#2A3245] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 mt-4 shadow-xl disabled:opacity-70"
            >
              {isLoading ? (
                <span className="animate-pulse">Verificando credenciais...</span>
              ) : (
                <>
                  <span>Entrar</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
