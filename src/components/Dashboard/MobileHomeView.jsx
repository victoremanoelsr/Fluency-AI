import React from 'react';
import { 
  Users, 
  Flame, 
  Crown, 
  Video, 
  Lock, 
  Home, 
  Theater, 
  TrendingUp, 
  User,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const MobileHomeView = ({
  tutor,
  completedDays = [1],
  currentDay = 2,
  onStartDay,
  onStartFreeTalk,
  onOpenTutorSelect,
  activeTab = 'home',
  onTabChange,
  streakCount = 0
}) => {
  // Lista de 31 dias para o mês de Outubro
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Posições alternadas para criar a curva suave em S
  const getOffsetClass = (day) => {
    const cycle = (day - 1) % 4;
    if (cycle === 0) return 'translate-x-0';       // Centro
    if (cycle === 1) return 'translate-x-16 sm:translate-x-24';  // Direita
    if (cycle === 2) return '-translate-x-16 sm:-translate-x-24'; // Esquerda
    return 'translate-x-0';                        // Centro
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col shadow-2xl relative overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. TOPO: AVATAR DA TUTORA COM FUNDO AZUL GRADIENTE */}
      <div className="relative w-full bg-gradient-to-b from-[#1e3a8a] via-[#2563eb] to-[#1d4ed8] pt-3 pb-6 px-4 flex flex-col items-center">
        
        {/* Status Bar Mobile Mockup (09:19) */}
        <div className="w-full flex items-center justify-between text-white/90 text-xs font-bold mb-3 px-1">
          <span>09:19</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2 rounded-xs border border-white/80 p-0.5">
              <div className="w-full h-full bg-white rounded-xs"></div>
            </div>
          </div>
        </div>

        {/* Top Badges (EN, Comunidade, Streak, PRO) */}
        <div className="w-full flex items-center justify-between z-10">
          {/* Esquerda: Bandeira EN */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/20">
              <span>🇺🇸</span>
              <span>EN</span>
            </div>
          </div>

          {/* Direita: Streak + PRO */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{streakCount}</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm border border-blue-400/40">
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>PRO</span>
            </div>
          </div>
        </div>

        {/* Botão de Comunidade abaixo da bandeira */}
        <div className="w-full flex justify-start mt-4 z-10">
          <button 
            onClick={onOpenTutorSelect}
            className="w-10 h-7 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center gap-0.5 hover:bg-white/30 transition-all border border-white/20"
            title="Trocar de Tutor"
          >
            <Users className="w-3.5 h-3.5" />
            <ChevronRight className="w-3 h-3 text-white/80" />
          </button>
        </div>

        {/* Foto da Tutora Centralizada (com recorte natural e expressão viva) */}
        <div className="relative -mt-6 w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
          <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl relative bg-blue-900/40">
            <img 
              src={tutor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"} 
              alt={tutor?.name || "Tutor"} 
              className="w-full h-full object-cover object-top scale-105"
            />
          </div>

          {/* Botão "Conversa Livre" Flutuante no canto da foto */}
          <button
            onClick={onStartFreeTalk}
            className="absolute bottom-1 right-0 sm:right-2 px-3.5 py-1.5 rounded-full bg-sky-400 hover:bg-sky-500 text-white font-extrabold text-xs shadow-lg shadow-sky-500/40 flex items-center gap-1.5 border border-white/40 active:scale-95 transition-all z-20"
          >
            <Video className="w-3.5 h-3.5 fill-white" />
            <span>Conversa Livre</span>
          </button>
        </div>

      </div>

      {/* 2. CABEÇALHO DO MÊS: "Outubro" */}
      <div className="w-full py-4 bg-white flex items-center justify-center relative">
        <div className="w-3/4 border-b border-slate-200 absolute"></div>
        <span className="bg-white px-6 text-sm font-black text-slate-800 tracking-wide z-10">
          Outubro
        </span>
      </div>

      {/* 3. A TRILHA EM S (DIAS 1, 2, 3, 4...) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-28 flex flex-col items-center relative">
        
        {/* Curva suave de fundo conectando os dias (SVG S-Curve) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-200" 
          fill="none" 
          strokeWidth="6" 
          strokeLinecap="round"
        >
          {/* Curvas conectando os primeiros nós */}
          <path d="M 210 60 Q 300 130 250 200" stroke="#0ea5e9" strokeWidth="6" />
          <path d="M 250 200 Q 150 270 160 340" stroke="#e2e8f0" strokeWidth="6" />
          <path d="M 160 340 Q 200 410 210 480" stroke="#e2e8f0" strokeWidth="6" />
        </svg>

        <div className="w-full space-y-12 flex flex-col items-center z-10">
          {days.slice(0, 10).map((day) => {
            const isCompleted = completedDays.includes(day);
            const isCurrent = day === currentDay;
            const isLocked = day > currentDay && !isCompleted;
            const offsetClass = getOffsetClass(day);

            return (
              <div 
                key={day} 
                className={`flex flex-col items-center transition-all ${offsetClass}`}
              >
                {/* O CÍRCULO DO DIA */}
                <button
                  disabled={isLocked}
                  onClick={() => onStartDay(day)}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl transition-all shadow-md active:scale-95 ${
                    isCompleted
                      ? 'bg-gradient-to-b from-orange-500 to-red-500 text-white shadow-orange-500/30'
                      : isCurrent
                      ? 'bg-gradient-to-b from-teal-400 to-emerald-500 text-white ring-4 ring-teal-200 ring-offset-2 shadow-teal-500/40 animate-pulse'
                      : 'bg-slate-300 text-slate-500 opacity-80 cursor-not-allowed'
                  }`}
                >
                  <span>{day}</span>

                  {/* Cadeado se estiver bloqueado */}
                  {isLocked && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-400/90 text-white flex items-center justify-center border-2 border-white shadow-xs">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Ícone de concluído se já fez */}
                  {isCompleted && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center border-2 border-white text-xs font-black">
                      ✓
                    </div>
                  )}
                </button>

                {/* LABEL: "Dia X" */}
                <span className={`mt-2 text-xs font-black ${
                  isCurrent ? 'text-teal-800' : 'text-slate-500'
                }`}>
                  Dia {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. BARRA DE NAVEGAÇÃO INFERIOR MOBILE: Início | Simulação | Progresso | Perfil */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 py-2.5 px-6 flex items-center justify-between shadow-2xl z-30">
        
        {/* Início */}
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'home' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-semibold hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px]">Início</span>
        </button>

        {/* Simulação */}
        <button 
          onClick={() => onTabChange('simulation')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'simulation' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-semibold hover:text-slate-600'
          }`}
        >
          <Theater className="w-5 h-5" />
          <span className="text-[11px]">Simulação</span>
        </button>

        {/* Progresso */}
        <button 
          onClick={() => onTabChange('progress')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'progress' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-semibold hover:text-slate-600'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[11px]">Progresso</span>
        </button>

        {/* Perfil */}
        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === 'profile' ? 'text-blue-600 font-extrabold' : 'text-slate-400 font-semibold hover:text-slate-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">Perfil</span>
        </button>

      </nav>

    </div>
  );
};
