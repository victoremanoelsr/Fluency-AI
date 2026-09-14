import React from 'react';
import { Flame, Clock, Sparkles, KeyRound, Volume2 } from 'lucide-react';

export const Navbar = ({ streakInfo, onOpenApiKey, hasApiKey, onOpenSettings }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                Fluency
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
                Flash AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5">Inglês Falado Real dos EUA</p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2">
          {/* Daily Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{streakInfo.currentStreak || 1}d</span>
          </div>

          {/* Minutes */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{streakInfo.totalMinutes || 0}m</span>
          </div>

          {/* API Key Indicator */}
          <button
            onClick={onOpenApiKey}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              hasApiKey
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 animate-pulse'
            }`}
            title="Configurar Chave Gemini"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'Gemini Ativo' : 'Adicionar Chave'}</span>
            <span className="sm:hidden">{hasApiKey ? 'OK' : 'Chave'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
