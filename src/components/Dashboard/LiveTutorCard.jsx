import React from 'react';
import { ChevronRight, Play, Volume2, Sparkles } from 'lucide-react';

export const LiveTutorCard = ({
  tutor,
  onOpenTutorModal,
  onStartCall,
  activeLesson
}) => {
  return (
    <aside className="w-full lg:w-84 xl:w-96 p-5 border-l border-slate-100 bg-white flex flex-col gap-4 select-none">
      
      {/* Live Video Preview Box */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-800 flex items-center justify-center group">
        
        {/* Robot/Tutor 3D Avatar Image */}
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
          alt={tutor.name}
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Pulsing chest indicator overlay for AI Robot */}
        <div className="absolute top-[68%] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-cyan-400/80 shadow-[0_0_15px_#22d3ee] animate-pulse"></div>

        {/* Timer Badge (04:46) */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/70 backdrop-blur-md text-white font-mono font-bold text-xs border border-white/10 shadow-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>04:46</span>
        </div>

        {/* Overlay Play Button to enter full call */}
        <button
          id="btn-live-tutor-play"
          onClick={onStartCall}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
          title="Iniciar Conversa"
        >
          <Play className="w-5 h-5 fill-white ml-0.5" />
        </button>

      </div>

      {/* Tutor Selector Card */}
      <button
        id="btn-open-tutor-modal"
        onClick={onOpenTutorModal}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-sky-50/50 hover:bg-sky-50/90 transition-all text-left shadow-xs group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-sky-200 bg-slate-900 shadow-xs shrink-0">
            <img 
              src={tutor.avatar} 
              alt={tutor.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              SEU TUTOR
            </div>
            <div className="text-sm font-black text-slate-800 flex items-center gap-1">
              <span>{tutor.name}</span>
            </div>
          </div>
        </div>
        
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Quick Launch Call Banner */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-blue-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-100">Pronto para praticar?</span>
        </div>
        <h5 className="font-extrabold text-sm mt-1">Aula: {activeLesson?.title || 'How Are You?'}</h5>
        <p className="text-xs text-sky-100/80 mt-0.5">
          Converse por voz com o {tutor.name} e receba feedback em tempo real.
        </p>
        <button
          onClick={onStartCall}
          className="w-full mt-3 py-2.5 px-4 rounded-xl bg-white text-blue-600 font-extrabold text-xs shadow-sm hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-blue-600" />
          <span>Começar Aula Agora</span>
        </button>
      </div>

    </aside>
  );
};
