import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, Settings as SettingsIcon, CheckCircle2, ServerCrash, SignalLow, Loader2 } from 'lucide-react';
import { useSound } from '../contexts/SoundContext';
import { motion, AnimatePresence } from 'motion/react';

export default function NetworkStatus({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectStep, setReconnectStep] = useState(0); // 0: A ligar ao sistema, 1: A sincronizar dados
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'warning' | 'error' } | null>(null);
  const { playActionSound } = useSound();

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error') => {
    setToast({ message, type });
    if (type === 'success') {
      playActionSound(); // Som leve opcional
    }
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, [playActionSound]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsReconnecting(true);
      setReconnectStep(0);
      
      // Simulate reconnection steps
      setTimeout(() => {
        setReconnectStep(1);
        setTimeout(() => {
          setIsReconnecting(false);
          showToast('Ligação restaurada com sucesso', 'success');
        }, 1500);
      }, 1000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setIsReconnecting(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for weak connection if supported
    const connection = (navigator as any).connection;
    if (connection) {
      const handleConnectionChange = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          showToast('Ligação instável. Alguns dados podem demorar a carregar.', 'warning');
        }
      };
      connection.addEventListener('change', handleConnectionChange);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  const handleManualReconnect = () => {
    playActionSound();
    setIsReconnecting(true);
    setReconnectStep(0);
    setTimeout(() => {
      if (navigator.onLine) {
        setIsOnline(true);
        setReconnectStep(1);
        setTimeout(() => {
          setIsReconnecting(false);
          showToast('Ligação restaurada com sucesso', 'success');
        }, 1500);
      } else {
        setIsReconnecting(false);
        showToast('Servidor indisponível no momento. Tente novamente mais tarde.', 'error');
      }
    }, 1500);
  };

  const handleOpenSettings = () => {
    playActionSound();
    alert('Por favor, abra as definições do seu dispositivo para ativar o Wi-Fi ou Dados Móveis.');
  };

  return (
    <>
      {/* Offline Screen */}
      {!isOnline && !isReconnecting && (
        <div className="fixed inset-0 z-[9999] bg-theme-bg flex flex-col items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center max-w-sm mx-auto w-full">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <WifiOff className="w-12 h-12 text-red-500" />
            </div>
            
            <h2 className="text-2xl font-black text-theme-text mb-3">Estás Offline neste momento</h2>
            <p className="text-theme-text-muted text-sm mb-8 leading-relaxed">
              Não foi possível carregar esta página.<br/>
              Verifica a tua ligação à internet e tenta novamente.
            </p>

            <div className="w-full space-y-3">
              <button 
                onClick={handleManualReconnect}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Tentar Novamente
              </button>
              
              <button 
                onClick={handleOpenSettings}
                className="w-full bg-theme-card hover:bg-theme-border text-theme-text font-bold py-4 rounded-2xl transition-colors flex items-center justify-center border border-theme-border"
              >
                <SettingsIcon className="w-5 h-5 mr-2" />
                Abrir Definições
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reconnecting Screen */}
      {isReconnecting && (
        <div className="fixed inset-0 z-[9999] bg-theme-bg flex flex-col items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center max-w-sm mx-auto w-full">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-theme-text mb-2">
              {reconnectStep === 0 ? 'A ligar ao sistema...' : 'A sincronizar dados...'}
            </h2>
            
            {/* Progress Bar */}
            <div className="w-full max-w-xs h-2 bg-theme-border rounded-full mt-6 overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: reconnectStep === 0 ? '0%' : '50%' }}
                animate={{ width: reconnectStep === 0 ? '50%' : '100%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-0 right-0 z-[10000] flex justify-center px-4 pointer-events-none"
          >
            <div className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' :
              toast.type === 'warning' ? 'bg-orange-500/90 border-orange-400 text-white' :
              'bg-red-500/90 border-red-400 text-white'
            }`}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'warning' && <SignalLow className="w-5 h-5" />}
              {toast.type === 'error' && <ServerCrash className="w-5 h-5" />}
              <span className="font-bold text-sm">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children always to preserve state (Continuidade Inteligente) */}
      <div style={{ display: (!isOnline || isReconnecting) ? 'none' : 'contents' }}>
        {children}
      </div>
    </>
  );
}

