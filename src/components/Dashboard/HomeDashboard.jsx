import React from 'react';
import { 
  Flame, Sparkles, MessageSquare, Mic, BookMarked, 
  ArrowRight, Volume2, Play, Award, Zap, Compass 
} from 'lucide-react';
import { SCENARIOS } from '../../data/scenarios';
import { SLANG_AND_REDUCTIONS } from '../../data/slangDatabase';
import { LESSONS } from '../../data/lessons';
import { speechAudio } from '../../services/speechAudio';

export const HomeDashboard = ({ 
  streakInfo, 
  onStartScenario, 
  onNavigateTab, 
  onOpenApiKey, 
  hasApiKey 
}) => {
  const featuredScenario = SCENARIOS[0]; // Starbucks or House Party
  const slangOfTheDay = SLANG_AND_REDUCTIONS[0]; // Gonna / Wanna / Gotta
  const quickLesson = LESSONS[0];

  const handlePlayAudio = (phrase) => {
    speechAudio.speak(phrase);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-5 animate-fadeIn">
      
      {/* Welcome & Streak Banner */}
      <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-500/30 shadow-2xl">
        <div className="relative z-10 space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Imersão Diária
            </span>
            <div className="flex items-center gap-1.5 font-bold text-xs text-orange-400">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{streakInfo.currentStreak} dias seguidos</span>
            </div>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Aprenda o inglês que os americanos realmente falam.
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 mt-1">
              Escute, repita e converse em cenários reais com o Gemini Flash.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onStartScenario(featuredScenario)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Praticar Conversa Agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('shadowing')}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-bold text-xs border border-slate-700/80 flex items-center gap-2 transition-all"
            >
              <Mic className="w-4 h-4 text-purple-400" />
              <span>Treino de Escuta</span>
            </button>
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Daily Slang Spotlight */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Redução do Dia
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('slang')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            Ver todas <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-start justify-between gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-white">
              {slangOfTheDay.phrase}
            </h3>
            <p className="text-xs text-pink-300 font-mono mt-0.5">
              🗣️ Som real: "{slangOfTheDay.realSoundsLike}"
            </p>
            <p className="text-xs text-slate-300 mt-1">
              {slangOfTheDay.meaningPt} — {slangOfTheDay.explanation}
            </p>
          </div>

          <button
            onClick={() => handlePlayAudio(slangOfTheDay.audioSample)}
            className="p-3 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/20 shrink-0 transition-colors"
            title="Ouvir pronúncia"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggested Scenarios Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Cenários em Destaque</span>
          </h2>
          <button
            onClick={() => onNavigateTab('scenarios')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            Ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCENARIOS.slice(0, 4).map((scen) => (
            <div
              key={scen.id}
              onClick={() => onStartScenario(scen)}
              className="group glass-panel p-3.5 rounded-2xl border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                {scen.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-indigo-400 block truncate">
                  {scen.categoryPt}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-indigo-300">
                  {scen.title}
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {scen.character.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="glass-panel p-3 rounded-2xl text-center border-slate-800">
          <span className="text-lg font-black text-indigo-400 block">{streakInfo.currentStreak}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Dias Seguidos</span>
        </div>
        <div className="glass-panel p-3 rounded-2xl text-center border-slate-800">
          <span className="text-lg font-black text-purple-400 block">{streakInfo.totalMinutes || 15}m</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Minutos Falados</span>
        </div>
        <div className="glass-panel p-3 rounded-2xl text-center border-slate-800">
          <span className="text-lg font-black text-emerald-400 block">{streakInfo.phrasesSpoken || 0}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Frases Praticadas</span>
        </div>
      </div>

    </div>
  );
};
