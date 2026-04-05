import React, { useState, useEffect } from 'react';
import { TriangleAlert, Loader2 } from 'lucide-react';

export default function NetworkStatus({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsSyncing(true);
      // Simulate synchronization with Firebase/Supabase
      setTimeout(() => {
        setIsOnline(true);
        setIsSyncing(false);
      }, 1500);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setIsSyncing(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {(!isOnline || isSyncing) && (
        <div className="fixed inset-0 z-[9999] bg-theme-bg flex flex-col items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center max-w-sm mx-auto">
            {isSyncing ? (
              <>
                <Loader2 className="w-20 h-20 text-blue-500 animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-theme-text mb-4">Conectando...</h2>
                <p className="text-theme-text-muted text-lg">
                  Sincronizando dados.
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center mb-6">
                  <TriangleAlert className="w-20 h-20 text-[#FF4400] mb-2" />
                  <span className="text-xl font-bold text-[#FF4400]">Sem Internet</span>
                </div>
                <h2 className="text-2xl font-bold text-theme-text mb-4">Sem conexão com a internet.</h2>
                <p className="text-theme-text-muted text-lg">
                  Ligue a internet para continuar.
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {/* Render children always to preserve state (Continuidade Inteligente) */}
      <div style={{ display: (!isOnline || isSyncing) ? 'none' : 'contents' }}>
        {children}
      </div>
    </>
  );
}

