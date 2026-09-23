import React from 'react';
import { ChevronRight, Play, Volume2, Sparkles, MessageSquare, Headphones } from 'lucide-react';

export const LiveTutorCard = ({
  tutor,
  onOpenTutorModal,
  onStartCall,
  activeLesson
}) => {
  return (
    <aside className="w-full lg:w-84 xl:w-96 p-5 border-l border-slate-100 bg-white flex flex-col gap-4 select-none shrink-0">
      
      {/* Tutor Profile Banner Card */}
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-800 flex items-center justify-center group">
        
        {/* Tutor Portrait Image */}
        <img
          src={tutor.avatar}
          alt={tutor.name}
          className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Live Active Pulse Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-xs border border-white/10 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Tutor Online</span>
        </div>

        {/* Tutor info at bottom of card */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div>
            <h4 className="font-black text-base leading-tight">{tutor.name}</h4>
            <span className="text-[11px] font-semibold text-slate-300">{tutor.origin} • Fluency AI</span>
          </div>

          <button
            onClick={onStartCall}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Iniciar Conversa"
          >
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </button>
        </div>

      </div>

      {/* Tutor Selector Card */}
      <button
        id="btn-open-tutor-modal"
        onClick={onOpenTutorModal}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-blue-50/50 hover:bg-blue-50/90 transition-all text-left shadow-xs group"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-blue-200 bg-slate-900 shadow-xs shrink-0">
            <img 
              src={tutor.avatar} 
              alt={tutor.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Trocar de Tutor
            </div>
            <div className="text-sm font-black text-slate-800 flex items-center gap-1">
              <span>{tutor.name}</span>
              <span className="text-[11px] font-medium text-slate-500">({tutor.traits[0]})</span>
            </div>
          </div>
        </div>
        
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Quick Launch Practice Card */}
      <div className="mt-auto p-5 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white shadow-xl shadow-blue-600/20 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          <span className="text-xs font-black uppercase tracking-wider text-blue-100">Pronto para falar?</span>
        </div>
        
        <div>
          <h5 className="font-black text-base">{activeLesson?.title || 'Prática Livre'}</h5>
          <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
            Converse em tempo real com o tutor por áudio ou texto, com correções e fonética facilitada.
          </p>
        </div>

        <button
          onClick={onStartCall}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Headphones className="w-4 h-4 text-blue-600" />
          <span>Iniciar Sala de Conversação</span>
        </button>
      </div>

    </aside>
  );
};
