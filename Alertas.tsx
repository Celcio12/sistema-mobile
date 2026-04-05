import { TriangleAlert, PackageX, ShieldAlert, PackageMinus, Loader2, Check, Trash2, CheckCircle2, Trash, DollarSign, Info } from 'lucide-react';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';
import { supabase } from '../../lib/supabase';

export default function Alertas() {
  const { data: alertas, loading } = useSupabaseTable<any>('alertas');

  const getIcon = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'danger': return PackageX;
      case 'warning': return PackageMinus;
      case 'security': return ShieldAlert;
      case 'success': return DollarSign;
      case 'info': return Info;
      default: return TriangleAlert;
    }
  };

  const getColor = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'danger': return 'text-red-500';
      case 'warning': return 'text-[#FF7A00]';
      case 'security': return 'text-purple-500';
      case 'success': return 'text-emerald-500';
      case 'info': return 'text-blue-500';
      default: return 'text-blue-500';
    }
  };

  const getBg = (type: string) => {
    switch ((type || '').toLowerCase()) {
      case 'danger': return 'bg-red-500/10';
      case 'warning': return 'bg-[#FF7A00]/10';
      case 'security': return 'bg-purple-500/10';
      case 'success': return 'bg-emerald-500/10';
      case 'info': return 'bg-blue-500/10';
      default: return 'bg-blue-500/10';
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await supabase.from('alertas').update({ lida: true }).eq('id', id);
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('alertas').delete().eq('id', id);
    } catch (error) {
      console.error('Erro ao apagar notificação:', error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Tem certeza que deseja limpar todas as notificações?')) return;
    try {
      // Deleta todos os alertas sincronizados com a chave atual
      const SYNC_KEY = '1ee0e3e8-af4c-49f5-8d86-4b80fce48cdd';
      await supabase.from('alertas').delete().eq('sync_key', SYNC_KEY);
    } catch (error) {
      console.error('Erro ao limpar notificações:', error);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-theme-text flex items-center">
          <TriangleAlert className="w-6 h-6 mr-2 text-[#FF4400]" />
          Caixa de Notificações
        </h2>
        
        {alertas.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="flex items-center text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-xl transition-colors"
          >
            <Trash className="w-4 h-4 mr-1.5" />
            Limpar Tudo
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-theme-card glass-blur rounded-3xl border border-theme-border">
            <Loader2 className="w-8 h-8 text-[#FF4400] animate-spin mb-2" />
            <p className="text-theme-text-muted">Sincronizando notificações...</p>
          </div>
        ) : alertas.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-theme-card glass-blur rounded-3xl border border-theme-border">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 opacity-50" />
            <p className="text-theme-text font-bold">Tudo limpo!</p>
            <p className="text-theme-text-muted text-sm mt-1">Nenhuma notificação no momento.</p>
          </div>
        ) : (
          alertas.map((alert) => {
            const Icon = getIcon(alert.tipo || alert.type);
            const isRead = alert.lida === true;
            
            return (
              <div key={alert.id} className={`bg-theme-card glass-blur p-4 rounded-3xl shadow-sm border ${isRead ? 'border-theme-border opacity-70' : 'border-[#FF7A00]/30'} flex items-start space-x-4 transition-all`}>
                <div className={`p-3 rounded-2xl ${getBg(alert.tipo || alert.type)} shrink-0`}>
                  <Icon className={`w-6 h-6 ${getColor(alert.tipo || alert.type)}`} />
                </div>
                <div className="flex-1 pt-1 min-w-0">
                  <h3 className={`font-bold text-sm mb-1 truncate ${isRead ? 'text-theme-text-muted' : 'text-theme-text'}`}>
                    {alert.titulo || alert.title}
                  </h3>
                  <p className="text-xs text-theme-text-muted line-clamp-2">{alert.descricao || alert.desc}</p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    {!isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Marcar como lida
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(alert.id)}
                      className="flex items-center text-[10px] font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Apagar
                    </button>
                  </div>
                </div>
                
                {!isRead && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF7A00] shrink-0 mt-2 shadow-[0_0_8px_rgba(255,122,0,0.5)]"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
