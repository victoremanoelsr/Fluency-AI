import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  BarChart2, 
  Crown, 
  ChevronRight, 
  Check, 
  User, 
  Settings, 
  LogOut, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({
  activeTab,
  onTabChange,
  profile,
  onOpenProfile,
  onOpenSettings,
  onOpenUpgrade
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.studyLanguageCode || 'GB');

  const langRef = useRef(null);
  const profileRef = useRef(null);

  // Close menus on outside click
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
    { code: 'GB', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-100 flex flex-col justify-between p-5 min-h-screen select-none">
      
      {/* Top Header & Navigation */}
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 px-2 py-1 cursor-pointer" onClick={() => onTabChange('home')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-lg">
            L
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl text-slate-800 tracking-tight">Learna</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">AI</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <button
            id="nav-inicio"
            onClick={() => onTabChange('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'home'
                ? 'bg-sky-50 text-sky-600 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span>Início</span>
          </button>

          <button
            id="nav-progresso"
            onClick={() => onTabChange('progresso')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
              activeTab === 'progresso'
                ? 'bg-sky-50 text-sky-600 font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BarChart2 className={`w-5 h-5 ${activeTab === 'progresso' ? 'text-sky-600' : 'text-slate-400'}`} />
            <span>Progresso</span>
          </button>
        </nav>

        {/* PRO Upgrade Card */}
        <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-b from-sky-50/80 to-blue-50/50 border border-sky-100 shadow-xs">
          <div className="flex items-start justify-between">
            <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
              60% de desconto PRO!
            </h4>
            <Crown className="w-4 h-4 text-sky-500 fill-sky-400 shrink-0" />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Tenha Acesso Ilimitado</p>
          
          <div className="mt-3">
            <span className="text-xs text-slate-400 line-through">R$130.00</span>
            <div className="text-base font-black text-sky-600">
              R$52.00 <span className="text-xs font-semibold text-slate-500">/ Semana</span>
            </div>
          </div>

          <button 
            onClick={onOpenUpgrade}
            className="w-full mt-3.5 py-2.5 px-3 rounded-xl bg-white hover:bg-sky-50 text-sky-600 font-bold text-xs border border-sky-200 shadow-xs transition-colors"
          >
            Assine o Pro
          </button>
        </div>

      </div>

      {/* Bottom Profile & Language Selectors */}
      <div className="space-y-3 pt-6 border-t border-slate-100">
        
        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm text-slate-900">{selectedLanguage}</span>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AULAS</div>
                <div className="text-xs font-bold text-slate-700">
                  {languages.find(l => l.code === selectedLanguage)?.name || 'English'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Language Popover Menu */}
          {isLangOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setIsLangOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-xs text-slate-800">{lang.code}</span>
                    <span className="text-xs font-semibold text-slate-700">{lang.name}</span>
                  </div>
                  {selectedLanguage === lang.code && (
                    <Check className="w-4 h-4 text-sky-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile Card & Context Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-200 text-sky-700 font-extrabold text-sm flex items-center justify-center">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'V'}
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PERFIL</div>
                <div className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                  {profile?.name || 'victor'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Popover Menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Ver Perfil</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onOpenSettings();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Configurações</span>
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  alert('Sessão encerrada.');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>

        {/* Floating Help icon */}
        <div className="pt-2 flex items-center justify-between text-slate-400">
          <button 
            title="Dicas e Suporte"
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:text-sky-600 hover:border-sky-300 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-medium text-slate-400">v2.4 Imersão</span>
        </div>

      </div>

    </aside>
  );
};
