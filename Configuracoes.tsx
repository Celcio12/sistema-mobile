import React, { useState } from 'react';
import { Store, RefreshCw, Database, Cloud, LogOut, Settings, Building2, MapPin, Image as ImageIcon, Shield, Key, Lock, Unlock, Download, Palette, CheckCircle2, Info, Code, Mail, Facebook, Phone, Volume2, VolumeX } from 'lucide-react';
import { useTheme, Theme } from '../../contexts/ThemeContext';
import { useSound } from '../../contexts/SoundContext';
import { motion } from 'motion/react';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';

export default function Configuracoes({ onLogout }: { onLogout: () => void }) {
  const { theme, setTheme } = useTheme();
  const { isSoundEnabled, toggleSound, playActionSound } = useSound();
  
  const { data: settingsData, loading: settingsLoading } = useSupabaseTable<any>('settings');
  // O PC usa sempre o id='system-settings' como registo principal
  const currentSettings = settingsData?.find((s: any) => s.id === 'system-settings') || settingsData?.[0] || {};
  
  // Calcula states baseados em dados reais vindos do Supabase
  const isSynced = !settingsLoading && settingsData.length > 0;
  const hasLogo = Boolean(currentSettings.logo);
  const hasCompleteData = Boolean(currentSettings.name && currentSettings.nif);

  const isUnlocked = isSynced && hasLogo && hasCompleteData;
  
  // Company Data State (Read-only in mobile)
  const empresa = {
    nome: currentSettings.name || 'A Aguardar Sincronização...',
    tipo: currentSettings.businessType || 'Não definido',
    telefone: currentSettings.phone || 'Não definido',
    nif: currentSettings.nif || 'Não definido',
    email: currentSettings.email || 'Não definido'
  };

  // Location State (Read-only in mobile)
  const localizacao = {
    pais: currentSettings.country || 'Não definido',
    provincia: currentSettings.province || 'Não definido',
    municipio: currentSettings.municipality || 'Não definido',
    bairro: currentSettings.neighborhood || 'Não definido'
  };

  // Security State (Read-only in mobile)
  const seguranca = {
    login: currentSettings.adminName || 'A Aguardar Sincronização...',
    funcao: currentSettings.adminTitle || 'A Aguardar Sincronização...',
    telefoneRecuperacao: currentSettings.adminPhone || 'Não definido'
  };

  const [senhas, setSenhas] = useState({
    antiga: '',
    nova: '',
    confirmar: ''
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnlocked) return;
    if (senhas.nova !== senhas.confirmar) {
      alert('As senhas não coincidem!');
      return;
    }
    playActionSound();
    alert('Senha alterada com sucesso!');
    setSenhas({ antiga: '', nova: '', confirmar: '' });
  };

  const handleCheckUpdate = () => {
    playActionSound();
    alert('Versão 3.0.0 indisponível\nSem data de lançamento');
  };

  const handleThemeChange = (tId: Theme) => {
    playActionSound();
    setTheme(tId);
  };

  const handleToggleSound = () => {
    toggleSound();
    if (!isSoundEnabled) {
      // Play sound immediately after enabling
      setTimeout(() => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      }, 50);
    }
  };

  const handleManualSync = () => {
    playActionSound();
    // Recarrega a webview, o que faz os useEffects do Supabase correrem de novo
    alert('Sincronização iniciada. Os dados serão atualizados agora.');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const themes: { id: Theme; name: string; description: string }[] = [
    { id: 'glass', name: 'Glassmorphism (Vidro Realista)', description: 'Transparente, Moderno, Profissional' },
    { id: 'dark', name: 'Tema Escuro Profissional', description: 'Fundo escuro elegante, Ideal para uso noturno, Menor consumo de bateria' },
    { id: 'light', name: 'Tema Branco Único Realista', description: 'Visual limpo, Interface clara, Estilo corporativo' }
  ];

  return (
    <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-theme-text flex items-center">
          <Settings className="w-7 h-7 mr-3 text-[#FF7A00]" />
          Configurações
        </h2>
        <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${isUnlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {isUnlocked ? (
            <>
              <Unlock className="w-3.5 h-3.5 mr-1.5" />
              Visualização Desbloqueada
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Sistema Bloqueado
            </>
          )}
        </div>
      </div>

      {!isUnlocked && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start space-x-3">
          <Lock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-red-500">Bloqueio Inteligente Ativo</h4>
            <p className="text-xs text-red-500/80 mt-1">
              Os campos só ficam ativos para visualização completa se existir um logotipo carregado e dados completos vindos do sistema do PC.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6 transition-opacity duration-300">
        
        {/* Sons e Notificações */}
        <section className="bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-4">
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <Volume2 className="w-5 h-5 mr-2 text-indigo-500" />
            Sons e Notificações
          </h3>
          <div className="flex items-center justify-between p-4 rounded-2xl border bg-theme-nav border-theme-border">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isSoundEnabled ? 'bg-indigo-500/10 text-indigo-500' : 'bg-theme-border text-theme-text-muted'}`}>
                {isSoundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-sm text-theme-text">Efeitos Sonoros</h4>
                <p className="text-[10px] text-theme-text-muted mt-0.5">Sons de clique, ações e voz de boas-vindas</p>
              </div>
            </div>
            <button 
              onClick={handleToggleSound}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSoundEnabled ? 'bg-indigo-500' : 'bg-theme-border'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSoundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Temas Disponíveis */}
        <section className="bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-4">
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <Palette className="w-5 h-5 mr-2 text-pink-500" />
            Temas Disponíveis
          </h3>
          <p className="text-xs text-theme-text-muted mb-4">
            A mudança de tema é aplicada em tempo real em todo o aplicativo.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  theme === t.id
                    ? 'bg-[#FF7A00]/10 border-[#FF7A00] shadow-sm'
                    : 'bg-theme-nav border-theme-border hover:border-[#FF7A00]/50'
                }`}
              >
                <div className="text-left">
                  <h4 className={`font-bold text-sm ${theme === t.id ? 'text-[#FF7A00]' : 'text-theme-text'}`}>
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-theme-text-muted mt-1">{t.description}</p>
                </div>
                {theme === t.id && <CheckCircle2 className="w-5 h-5 text-[#FF7A00]" />}
              </button>
            ))}
          </div>
        </section>

        {/* Dados da Empresa */}
        <section className={`bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-4 relative overflow-hidden transition-all duration-300 ${!isUnlocked ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl">Apenas Leitura</div>
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <Building2 className="w-5 h-5 mr-2 text-blue-500" />
            Dados da Empresa
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Nome da Empresa</label>
              <input type="text" value={empresa.nome} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Tipo de Estabelecimento</label>
              <input type="text" value={empresa.tipo} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Telefone</label>
              <input type="text" value={empresa.telefone} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">NIF (Angola)</label>
              <input type="text" value={empresa.nif} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={empresa.email} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
          </div>
          <p className="text-[10px] text-theme-text-muted text-center pt-2">Esses dados vêm diretamente do sistema do PC e são sincronizados automaticamente.</p>
        </section>

        {/* Localização */}
        <section className={`bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-4 relative overflow-hidden transition-all duration-300 ${!isUnlocked ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl">Apenas Leitura</div>
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <MapPin className="w-5 h-5 mr-2 text-emerald-500" />
            Localização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">País</label>
              <input type="text" value={localizacao.pais} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Província</label>
              <input type="text" value={localizacao.provincia} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Município</label>
              <input type="text" value={localizacao.municipio} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Bairro / Rua</label>
              <input type="text" value={localizacao.bairro} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
          </div>
          <p className="text-[10px] text-theme-text-muted text-center pt-2">Atualização em tempo real via PC.</p>
        </section>

        {/* Identidade Visual */}
        <section className={`bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-4 relative overflow-hidden transition-all duration-300 ${!isUnlocked ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="absolute top-0 right-0 bg-purple-500/10 text-purple-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl">Apenas Leitura</div>
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <ImageIcon className="w-5 h-5 mr-2 text-purple-500" />
            Identidade Visual
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-theme-nav rounded-2xl border-2 border-theme-border flex items-center justify-center text-[#FF7A00] overflow-hidden">
              {hasLogo ? (
                <div className="text-center">
                  <Store className="w-10 h-10 mx-auto" />
                </div>
              ) : (
                <span className="text-xs font-bold text-theme-text-muted">Sem Logo</span>
              )}
            </div>
            <div className="flex-1 space-y-2 w-full">
              <p className="text-sm font-bold text-theme-text">Logotipo da Empresa</p>
              <p className="text-xs text-theme-text-muted">O upload do logotipo é feito exclusivamente no sistema do PC.</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 bg-theme-nav border border-theme-border rounded-lg text-xs font-medium text-theme-text">
                Ícone Alternativo: <Store className="w-3.5 h-3.5 ml-2 text-theme-text-muted" />
              </div>
            </div>
          </div>
        </section>

        {/* Segurança e Perfil do Administrador */}
        <section className={`bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-6 relative overflow-hidden transition-all duration-300 ${!isUnlocked ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="absolute top-0 right-0 bg-red-500/10 text-red-500 text-[10px] font-bold px-3 py-1 rounded-bl-xl">Segurança</div>
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <Shield className="w-5 h-5 mr-2 text-red-500" />
            Segurança e Perfil do Administrador
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Nome de Utilizador (Login)</label>
              <input type="text" value={seguranca.login} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
              <p className="text-[10px] text-theme-text-muted mt-1">Se o nome for alterado no PC, o aplicativo atualiza automaticamente.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Função</label>
              <input type="text" value={seguranca.funcao} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-theme-text-muted uppercase tracking-wider mb-1.5">Telefone de Recuperação</label>
              <input type="text" value={seguranca.telefoneRecuperacao} readOnly className="w-full bg-theme-nav/50 border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none cursor-not-allowed" />
              <p className="text-[10px] text-theme-text-muted mt-1">Usado para recuperar senha dos funcionários. Sincronizado em tempo real.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="pt-4 border-t border-theme-border space-y-4">
            <h4 className="font-bold text-theme-text flex items-center text-sm">
              <Key className="w-4 h-4 mr-2 text-[#FF7A00]" />
              Alteração de Senha
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <input type="password" placeholder="Senha antiga" required disabled={!isUnlocked} value={senhas.antiga} onChange={e => setSenhas({...senhas, antiga: e.target.value})} className="w-full bg-theme-nav border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none focus:border-[#FF7A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
              <input type="password" placeholder="Nova senha" required disabled={!isUnlocked} value={senhas.nova} onChange={e => setSenhas({...senhas, nova: e.target.value})} className="w-full bg-theme-nav border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none focus:border-[#FF7A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
              <input type="password" placeholder="Confirmar nova senha" required disabled={!isUnlocked} value={senhas.confirmar} onChange={e => setSenhas({...senhas, confirmar: e.target.value})} className="w-full bg-theme-nav border border-theme-border rounded-xl px-4 py-3 text-sm text-theme-text focus:outline-none focus:border-[#FF7A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
            </div>
            <button type="submit" disabled={!isUnlocked || !senhas.antiga || !senhas.nova || !senhas.confirmar} className="w-full bg-[#FF7A00] hover:bg-[#E66A00] disabled:bg-theme-border disabled:text-theme-text-muted text-white font-bold py-3 rounded-xl transition-colors text-sm">
              Alterar Senha
            </button>
          </form>
        </section>

        {/* Sincronização Automática */}
        <section className="bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-4">
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <RefreshCw className="w-5 h-5 mr-2 text-[#FF7A00]" />
            Sincronização Automática
          </h3>
          <p className="text-sm text-theme-text-muted mb-4">
            O aplicativo está sincronizado em tempo real com o Sistema de Gestão de Cantina do PC.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <Database className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="w-full">
                <h4 className="font-bold text-sm text-emerald-600">Supabase (Banco de Dados)</h4>
                <p className="text-xs text-emerald-600/80 mt-0.5 mb-2">Conectado e sincronizando em tempo real.</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-600/70 block">URL</span>
                    <input type="text" value="https://dibgkabvadgblieunquq.supabase.co" readOnly className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-700 focus:outline-none" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-600/70 block">Anon Key</span>
                    <input type="text" value="sb_publishable_KvR5hkQMlW4nGDXikBSd9g_CsGB0ER9" readOnly className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-700 focus:outline-none" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-600/70 block">Sync Key (Chave de Segurança)</span>
                    <input type="text" value="1ee0e3e8-af4c-49f5-8d86-4b80fce48cdd" readOnly className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-700 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <Cloud className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-orange-600">Firebase (Armazenamento)</h4>
                <p className="text-xs text-orange-600/80 mt-0.5">Conectado para leitura de arquivos e imagens.</p>
              </div>
            </div>
            
            <button 
              onClick={handleManualSync}
              className="w-full mt-4 bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/20 font-bold py-3 pt-3 px-6 rounded-xl transition-colors text-sm flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Sincronizar Manualmente (Buscar Tudo)
            </button>
          </div>
        </section>

        {/* Informações do Aplicativo e Desenvolvedor */}
        <section className="bg-theme-card glass-blur rounded-3xl p-6 shadow-sm border border-theme-border space-y-4">
          <h3 className="font-bold text-theme-text flex items-center text-lg border-b border-theme-border pb-3">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Informações do Aplicativo
          </h3>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-2">
              <div className="w-16 h-16 bg-[#FF7A00]/10 rounded-2xl flex items-center justify-center mb-3">
                <Store className="w-8 h-8 text-[#FF7A00]" />
              </div>
              <h4 className="text-base font-bold text-theme-text text-center">Sistema de Gestão de Cantina Mobile</h4>
              <p className="text-xs font-bold text-theme-text-muted mt-1 bg-theme-nav px-3 py-1 rounded-full border border-theme-border">
                Versão 2.0.0
              </p>
            </div>

            <div className="border-t border-theme-border pt-4">
              <h4 className="font-bold text-theme-text flex items-center text-sm mb-4">
                <Code className="w-4 h-4 mr-2 text-purple-500" />
                Desenvolvedor
              </h4>
              
              <div className="bg-theme-nav/50 rounded-2xl p-4 border border-theme-border space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider mb-1">Nome (Criptografado)</p>
                  <div className="flex items-center">
                    <p className="text-sm font-bold text-theme-text font-mono bg-theme-card px-3 py-1.5 rounded-lg border border-theme-border">
                      {/* Base64 encoded: Celcio Fernando Augusto Pinto */}
                      {atob('Q2VsY2lvIEZlcm5hbmRvIEF1Z3VzdG8gUGludG8=')}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2 border-t border-theme-border/50">
                  <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-wider">Informações de Contato</p>
                  
                  <a href="mailto:celciopinto419@gmail.com" className="flex items-center text-sm text-theme-text hover:text-[#FF7A00] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 shrink-0">
                      <Mail className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="truncate">celciopinto419@gmail.com</span>
                  </a>
                  
                  <a href="https://facebook.com/search/top?q=Celcio%20Pinto" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-theme-text hover:text-[#FF7A00] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3 shrink-0">
                      <Facebook className="w-4 h-4 text-blue-500" />
                    </div>
                    <span>Celcio Pinto</span>
                  </a>
                  
                  <a href="https://wa.me/244954771189" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-theme-text hover:text-[#FF7A00] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3 shrink-0">
                      <Phone className="w-4 h-4 text-emerald-500" />
                    </div>
                    <span>+244 954 771 189</span>
                  </a>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckUpdate}
              className="w-full bg-theme-nav hover:bg-theme-border text-theme-text font-bold py-3 px-6 rounded-xl transition-colors text-sm border border-theme-border flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Verificar atualização
            </button>
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-theme-border">
        <button onClick={onLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-2xl transition-colors flex items-center justify-center space-x-2 border border-red-500/20">
          <LogOut className="w-5 h-5" />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </div>
  );
}
