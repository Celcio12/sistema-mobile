import React, { useState, useEffect } from 'react';
import { Store, Bell, Package, Users, TrendingUp, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Notifications from './Notifications';
import Produtos from './tabs/Produtos';
import RelatoriosLucro from './tabs/RelatoriosLucro';
import Funcionarios from './tabs/Funcionarios';
import Configuracoes from './tabs/Configuracoes';
import { useTheme } from '../contexts/ThemeContext';
import { useSound } from '../contexts/SoundContext';
import { useSupabaseTable } from '../hooks/useSupabaseTable';

const IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1080",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1080"
];

export default function MainLayout({ onLogout }: { onLogout: () => void }) {
  const { data: settingsData } = useSupabaseTable<any>('settings');
  const currentSettings = settingsData?.find((s: any) => s.id === 'system-settings') || settingsData?.[0] || {};
  const companyName = currentSettings.name || 'Cantina EP';
  const companyType = currentSettings.businessType || 'Sistema Gestão';

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'produtos';
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const { theme } = useTheme();
  const { playActionSound } = useSound();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (theme !== 'glass') return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [theme]);

  const handleTabChange = (tab: string) => {
    if (activeTab !== tab) {
      playActionSound();
      setActiveTab(tab);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'produtos': return <Produtos />;
      case 'funcionarios': return <Funcionarios />;
      case 'relatorios': return <RelatoriosLucro />;
      case 'configuracoes': return <Configuracoes onLogout={onLogout} />;
      default: return <Produtos />;
    }
  };

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col font-sans relative overflow-hidden text-theme-text transition-colors duration-300">
      {theme === 'glass' && (
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={IMAGES[currentImage]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl" />
        </div>
      )}

      {/* Top Bar */}
      <header className="bg-theme-nav glass-blur px-4 py-3 shadow-sm sticky top-0 z-20 border-b border-theme-border transition-colors duration-300">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#FF7A00] p-2 rounded-xl shadow-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-theme-text leading-tight text-lg md:text-xl">{companyName}</h1>
              <p className="text-xs md:text-sm text-theme-text-muted">{companyType}</p>
            </div>
          </div>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-full hover:bg-theme-card transition-colors"
          >
            <Bell className="w-6 h-6 text-[#FF7A00]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#FF4400] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-theme-card">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 relative z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-theme-nav glass-blur border-t border-theme-border pb-safe pt-2 px-2 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-colors duration-300 overflow-x-auto hide-scrollbar">
        <div className="flex justify-between items-center w-full max-w-2xl mx-auto min-w-[300px]">
          <NavItem icon={<Package />} label="Produtos" isActive={activeTab === 'produtos'} onClick={() => handleTabChange('produtos')} />
          <NavItem icon={<Users />} label="Funcionários" isActive={activeTab === 'funcionarios'} onClick={() => handleTabChange('funcionarios')} />
          <NavItem icon={<TrendingUp />} label="Relatórios & Lucro" isActive={activeTab === 'relatorios'} onClick={() => handleTabChange('relatorios')} />
          <NavItem icon={<Settings />} label="Configurações" isActive={activeTab === 'configuracoes'} onClick={() => handleTabChange('configuracoes')} />
        </div>
      </nav>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <Notifications onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactElement, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-2xl min-w-[60px] transition-all flex-1 ${
        isActive ? 'bg-theme-card text-theme-text shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
      }`}
    >
      <div className={`mb-1 ${isActive ? 'scale-110 transition-transform text-[#FF7A00]' : ''}`}>
        {React.cloneElement(icon, { className: 'w-5 h-5' })}
      </div>
      <span className={`text-[9px] font-medium ${isActive ? 'font-bold' : ''} text-center`}>{label}</span>
    </button>
  );
}
