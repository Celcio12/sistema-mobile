import React from 'react';
import { Users, Clock, Search, Filter, Loader2, Activity } from 'lucide-react';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';

export default function Funcionarios() {
  const { data: funcionarios, loading } = useSupabaseTable<any>('funcionarios');

  const onlineCount = funcionarios.filter(f => (f.status || '').toLowerCase() === 'online').length;
  const offlineCount = funcionarios.filter(f => (f.status || '').toLowerCase() !== 'online').length;

  const formatRole = (role: string, gender: string) => {
    if (!role) return 'Funcionário';
    if (role.toLowerCase() === 'funcionário' || role.toLowerCase() === 'funcionario') {
      return gender === 'Feminino' ? 'Funcionária' : 'Funcionário';
    }
    return role;
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col pb-20">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-theme-text flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-500" />
          Monitoramento da Equipa
        </h2>
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-muted" />
          <input 
            type="text" 
            placeholder="Pesquisar funcionário..." 
            className="w-full bg-theme-card border border-theme-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-theme-text focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button className="p-2.5 bg-theme-card border border-theme-border rounded-xl text-theme-text-muted hover:text-theme-text transition-colors flex items-center justify-center">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="bg-emerald-500/10 p-4 rounded-3xl border border-emerald-500/20 glass-blur">
          <span className="text-3xl font-black text-emerald-500 block mb-1">{loading ? '-' : onlineCount}</span>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            Online
          </span>
        </div>
        <div className="bg-theme-card p-4 rounded-3xl border border-theme-border glass-blur">
          <span className="text-3xl font-black text-theme-text-muted block mb-1">{loading ? '-' : offlineCount}</span>
          <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
            Offline
          </span>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            <p className="text-theme-text-muted">Sincronizando equipe em tempo real...</p>
          </div>
        ) : funcionarios.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-theme-text-muted">Nenhum funcionário cadastrado no sistema do PC.</p>
          </div>
        ) : (
          funcionarios.map((emp) => {
            const isOnline = (emp.status || '').toLowerCase() === 'online';
            const role = formatRole(emp.cargo || emp.role, emp.genero);
            
            // Format last activity if it's a timestamp
            let lastActivityDate = '';
            let lastActivityTime = '';
            
            const rawActivity = emp.ultimo_acesso || emp.lastActive;
            if (rawActivity) {
              try {
                const dateObj = new Date(rawActivity);
                if (!isNaN(dateObj.getTime())) {
                  lastActivityDate = dateObj.toLocaleDateString('pt-BR');
                  lastActivityTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                } else {
                  // If it's just a string like "14:30" or "Hoje"
                  lastActivityTime = rawActivity;
                }
              } catch (e) {
                lastActivityTime = rawActivity;
              }
            } else {
              lastActivityTime = 'Desconhecido';
            }

            return (
              <div key={emp.id} className="bg-theme-card glass-blur p-4 rounded-3xl shadow-sm border border-theme-border flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-theme-nav rounded-full flex items-center justify-center text-theme-text-muted font-bold text-lg">
                      {(emp.nome || emp.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-theme-card ${isOnline ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-theme-text text-sm">{emp.nome || emp.name}</h3>
                    <span className="text-xs text-theme-text-muted block">{role}</span>
                    {isOnline ? (
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center mt-1">
                        <Activity className="w-3 h-3 mr-1" /> Status: Online
                      </span>
                    ) : (
                      <span className="text-[10px] text-theme-text-muted flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" /> 
                        Status: Offline {lastActivityTime !== 'Desconhecido' && `(Visto às ${lastActivityTime})`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
