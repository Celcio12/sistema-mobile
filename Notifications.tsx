import React from 'react';
import { X, Trash2, CheckCheck, Package, DollarSign, ShieldAlert, UserCheck, BellOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useNotifications, Notification } from '../hooks/useNotifications';

const NOTIFICATION_ICONS = {
  stock_low: { icon: Package, color: 'text-[#FF7A00]', bg: 'bg-[#FF7A00]/10' },
  out_of_stock: { icon: Package, color: 'text-red-500', bg: 'bg-red-500/10' },
  new_sale: { icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  login_denied: { icon: ShieldAlert, color: 'text-gray-500', bg: 'bg-gray-500/10' },
  employee_logged_in: { icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

function formatTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Agora';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
}

export default function Notifications({ onClose }: { onClose: () => void }) {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification, clearAll, unreadCount } = useNotifications();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-theme-bg z-50 shadow-2xl flex flex-col border-l border-theme-border"
      >
        <div className="bg-theme-nav px-6 py-4 flex items-center justify-between shadow-sm z-10 border-b border-theme-border">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-theme-text">Notificações</h2>
            {unreadCount > 0 && (
              <span className="bg-[#FF7A00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-theme-card border border-theme-border text-theme-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-theme-nav border-b border-theme-border px-6 py-3 flex justify-between items-center text-xs font-bold">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => {
                if (window.confirm('Tem certeza que deseja apagar todas as notificações?')) {
                  clearAll();
                }
              }} 
              className="flex items-center text-[#FF4400] hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              LIMPAR
            </button>
            <button 
              onClick={markAllAsRead}
              className="flex items-center text-emerald-500 hover:bg-emerald-500/10 px-2 py-1 rounded transition-colors"
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              LIDAS
            </button>
          </div>
          <div className="text-theme-text-muted uppercase tracking-wider">
            {notifications.length} NO TOTAL
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
              <div className="w-8 h-8 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Sincronizando...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-40">
              <BellOff className="w-12 h-12" />
              <p className="text-sm font-medium">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notif: Notification) => {
              const iconData = NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.login_denied;
              return (
                <div 
                  key={notif.id} 
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className={`bg-theme-card p-4 rounded-2xl shadow-sm border border-theme-border relative transition-all group overflow-hidden ${
                    !notif.read ? 'border-l-4 border-l-[#FF7A00]' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-2xl ${iconData.bg}`}>
                      <iconData.icon className={`w-6 h-6 ${iconData.color}`} />
                    </div>
                    <div className="flex-1 pr-6">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold text-sm ${!notif.read ? 'text-[#FF7A00]' : 'text-theme-text'}`}>
                          {notif.title}
                        </h3>
                        <span className="text-[10px] text-theme-text-muted font-medium whitespace-nowrap ml-2">
                          {formatTime(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-theme-text-muted leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-red-500/10 text-theme-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
        
        <div className="p-4 text-center text-[10px] font-bold text-theme-text-muted uppercase tracking-wider bg-theme-nav border-t border-theme-border">
          Sincronizado via Supabase Real-time
        </div>
      </motion.div>
    </>
  );
}
