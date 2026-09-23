import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  BarChart2, 
  Flame, 
  ChevronRight, 
  Check, 
  User, 
  Settings, 
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onTabChange,
  profile,
  onOpenProfile,
  onOpenSettings
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.studyLanguageCode || 'US');

  const langRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'US', name: 'Inglês (EUA)', flag: '🇺🇸' },
    { code: 'GB', name: 'Inglês (UK)', flag: '🇬🇧' },
    { code: 'ES', name: 'Espanhol', flag: '🇪🇸' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-100 flex flex-col justify-between p-5 min-h-screen select-none shrink-0">
      
      {/* Top Header & Navigation */}
      <div className="space-y-6">
        
        {/* Fluency AI Brand Logo */}
        <div 
          className="flex items-center gap-3 px-2 py-1.5 cursor-pointer group" 
          onClick={() => onTabChange('home')}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white font-black text-xl group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl text-slate-900 tracking-tight">Fluency</span>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">AI</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Conversação Inteligente</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <button
            id="nav-inicio"
            onClick={() => onTabChange('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-blue-50 text-blue-600 shadow-xs ring-1 ring-blue-200/60'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Trilha de Conversação</span>
          </button>

          <button
            id="nav-progresso"
            onClick={() => onTabChange('progresso')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'progresso'
                ? 'bg-blue-50 text-blue-600 shadow-xs ring-1 ring-blue-200/60'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart2 className={`w-5 h-5 ${activeTab === 'progresso' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Desempenho & Fluência</span>
          </button>
        </nav>

        {/* Daily Goal & Progress Widget (No Fake Paywall) */}
        <div className="rounded-3xl p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md shadow-indigo-950/15 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Meta Diária</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>3 dias</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-300">
              <span>Prática de fala</span>
              <span className="text-emerald-400 font-mono">15 / 20 min</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full w-[75%] transition-all"></div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10">
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              Todas aulas liberadas
            </span>
            <span className="text-emerald-400 font-bold">100% Livre</span>
          </div>
        </div>

      </div>

      {/* Bottom Profile & Language Selectors */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        
        {/* Language Switcher Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🇺🇸</span>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Idioma de Estudo</div>
                <div className="text-xs font-black text-slate-800">Inglês Americano</div>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isLangOpen ? 'rotate-90' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-30 space-y-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setSelectedLanguage(l.code);
                    setIsLangOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-bold text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.name}</span>
                  </span>
                  {selectedLanguage === l.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Bar */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-black text-base flex items-center justify-center shadow-inner">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'V'}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black text-slate-800 truncate">
                  {profile?.name || 'Victor'}
                </div>
                <div className="text-[11px] font-semibold text-slate-400 truncate">
                  {profile?.level || 'Iniciante'} • Fluency AI
                </div>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-90' : ''}`} />
          </div>

          {isProfileOpen && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-30 space-y-1">
              <button
                onClick={() => {
                  onOpenProfile();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-bold text-slate-700"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Meu Perfil</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 text-left text-xs font-bold text-slate-700"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Configurações & Voz</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </aside>
  );
};
