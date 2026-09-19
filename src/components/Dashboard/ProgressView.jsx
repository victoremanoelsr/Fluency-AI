import React from 'react';
import { 
  BarChart2, 
  Crown, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Bookmark,
  Flag,
  Calendar
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const ProgressView = ({ onSelectCallHistory }) => {
  const streakInfo = StorageService.getStreakInfo();
  const callHistory = StorageService.getCallHistory();

  // Weekly bar data
  const weeklyData = [
    { day: 'Sáb', minutes: 0 },
    { day: 'Dom', minutes: 0 },
    { day: 'Seg', minutes: 0.35, height: '65%' },
    { day: 'Ter', minutes: 0 },
    { day: 'Qua', minutes: 0 },
    { day: 'Qui', minutes: 0 },
    { day: 'Sex', minutes: 0.28, height: '52%' }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 select-none animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <BarChart2 className="w-5 h-5 text-sky-500" />
          <h1 className="text-lg font-black text-slate-800">Progresso</h1>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-900 text-white font-extrabold text-xs shadow-xs">
          <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          <span>PRO</span>
        </div>
      </div>

      {/* Grid: Tempo em chamadas & Histórico de chamadas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tempo em chamadas (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800">Tempo em chamadas</h2>

          <div className="p-6 rounded-3xl border border-slate-100 bg-white shadow-xs space-y-6">
            
            {/* 3 Metric counters */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Total acumulado</span>
                <div className="flex items-center justify-center gap-1 mt-1 font-bold text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>{streakInfo.totalMinutes || 0.52}min</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Média diária</span>
                <div className="flex items-center justify-center gap-1 mt-1 font-bold text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>0.07min</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Meta diária</span>
                <div className="flex items-center justify-center gap-1 mt-1 font-bold text-xs text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>30min</span>
                </div>
              </div>
            </div>

            {/* Weekly Bar Chart */}
            <div className="pt-4 flex items-end justify-between h-44 px-3 border-t border-slate-50">
              {weeklyData.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end flex-1">
                  <div className="w-8 flex items-end justify-center h-32 bg-slate-50 rounded-t-lg">
                    {item.height ? (
                      <div 
                        style={{ height: item.height }}
                        className="w-full bg-blue-200/90 hover:bg-blue-300 rounded-t-md transition-all shadow-xs"
                        title={`${item.minutes} min`}
                      ></div>
                    ) : null}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Column: Histórico de chamadas (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800">Histórico de chamadas</h2>

          <div className="rounded-3xl border border-slate-100 bg-white p-3 shadow-xs divide-y divide-slate-100">
            {callHistory.map((call) => (
              <div 
                key={call.id}
                onClick={() => onSelectCallHistory && onSelectCallHistory(call)}
                className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div 
                    style={{ backgroundColor: call.color || '#0d9488' }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xs"
                  >
                    <Flag className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800">{call.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{call.date}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section: Prática de vocabulário */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-extrabold text-slate-800">Prática de vocabulário</h2>

        <div className="p-5 rounded-3xl border border-slate-100 bg-white shadow-xs space-y-4">
          
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-sky-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full w-[3%]"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sky-500">📘</span>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Palavras novas</span>
                  <span className="font-extrabold text-sm text-slate-800">3</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">🔖</span>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Próximas palavras</span>
                  <span className="font-extrabold text-sm text-slate-800">2274</span>
                </div>
              </div>
            </div>

            <button 
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-sky-50 text-slate-400 hover:text-sky-600 flex items-center justify-center transition-colors shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
