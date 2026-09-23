import React, { useState } from 'react';
import { 
  Check, 
  Play, 
  Flag, 
  Book, 
  Users, 
  Coffee, 
  Home, 
  User, 
  Sparkles,
  Trophy,
  ShieldAlert,
  ChevronRight,
  Award
} from 'lucide-react';
import { CEFR_MODULES } from '../../data/modules';

export const LearningRoadmap = ({
  completedLessons = ['day-01-hello'],
  onStartLesson,
  streakInfo
}) => {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const currentModule = CEFR_MODULES[selectedModuleIndex] || CEFR_MODULES[0];
  const days = currentModule.days;

  const renderIcon = (lesson, isCompleted) => {
    if (lesson.nodeType === 'exam') {
      return (
        <div className="relative flex items-center justify-center">
          <Trophy className="w-8 h-8 text-amber-300 fill-amber-300 animate-bounce" />
        </div>
      );
    }

    if (isCompleted) {
      return (
        <div className="relative flex items-center justify-center">
          <Check className="w-7 h-7 text-white stroke-[3]" />
        </div>
      );
    }

    switch (lesson.icon) {
      case 'hand-wave':
        return <span className="text-2xl">👋</span>;
      case 'flag':
        return <Flag className="w-6 h-6 text-white fill-white" />;
      case 'book':
        return <Book className="w-6 h-6 text-white" />;
      case 'coffee':
        return <Coffee className="w-6 h-6 text-white" />;
      case 'users':
        return <Users className="w-6 h-6 text-white" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  const nodeThemes = [
    { bg: 'from-blue-500 to-indigo-600', ring: 'ring-blue-200/70', shadow: 'shadow-blue-500/25' },
    { bg: 'from-teal-500 to-emerald-600', ring: 'ring-teal-200/70', shadow: 'shadow-teal-500/25' },
    { bg: 'from-purple-500 to-indigo-600', ring: 'ring-purple-200/70', shadow: 'shadow-purple-500/25' },
    { bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-200/70', shadow: 'shadow-amber-500/25' },
    { bg: 'from-rose-500 to-pink-600', ring: 'ring-rose-200/70', shadow: 'shadow-rose-500/25' }
  ];

  const getOffsetStyle = (index) => {
    const pattern = [0, 70, -70, 0, 70, -70, 0];
    const offset = pattern[index % pattern.length];
    return { transform: `translateX(${offset}px)` };
  };

  return (
    <div className="flex-1 flex flex-col items-center py-6 px-4 max-w-xl mx-auto w-full select-none">
      
      {/* Module Switcher Tabs (Months / CEFR Levels) */}
      <div className="w-full mb-6 space-y-3">
        <div className="flex items-center justify-between px-2 text-xs font-black uppercase tracking-wider text-slate-400">
          <span>Selecione o Módulo</span>
          <span className="text-blue-600">Método Natural (A1 ao B1)</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CEFR_MODULES.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModuleIndex(idx)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedModuleIndex === idx
                  ? 'border-blue-600 bg-white shadow-md shadow-blue-500/10 ring-2 ring-blue-100'
                  : 'border-slate-200 bg-slate-100/60 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${selectedModuleIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {mod.code}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Mês {mod.monthNumber}</span>
              </div>
              <div className="text-xs font-black text-slate-800 truncate">{mod.titlePt.split(':')[1] || mod.title}</div>
            </button>
          ))}
        </div>

        {/* Current Module Summary Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-black text-slate-900">{currentModule.title}</div>
            <p className="text-[11px] text-slate-500 mt-0.5">{currentModule.description}</p>
          </div>
          <div className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-extrabold text-xs shrink-0 border border-blue-100">
            Teto: {currentModule.vocabLimit} palavras
          </div>
        </div>
      </div>

      {/* Vertical Roadmap */}
      <div className="relative flex flex-col items-center gap-14 my-4 w-full max-w-md">
        
        {/* Curved Path line */}
        <svg 
          className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-[calc(100%-60px)] pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 144 0 
               C 144 50, 214 80, 214 130 
               C 214 180, 74 210, 74 260 
               C 74 310, 144 340, 144 390 
               C 144 440, 214 470, 214 520
               C 214 570, 74 600, 74 650
               C 74 700, 144 730, 144 780"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Nodes of the selected module */}
        {days.map((dayNode, idx) => {
          const isCompleted = completedLessons.includes(dayNode.id);
          const isExam = dayNode.nodeType === 'exam';
          const theme = isExam 
            ? { bg: 'from-amber-500 via-orange-500 to-amber-600', ring: 'ring-amber-200/80', shadow: 'shadow-amber-500/30' }
            : nodeThemes[idx % nodeThemes.length];

          return (
            <div 
              key={dayNode.id} 
              style={getOffsetStyle(idx)} 
              className="relative z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => onStartLesson(dayNode)}
            >
              
              {/* Circular Node */}
              <button
                id={`lesson-node-${dayNode.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStartLesson(dayNode);
                }}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                  theme.shadow
                } bg-gradient-to-tr ${theme.bg} text-white ring-4 ${theme.ring}`}
                title={isExam ? `Iniciar Avaliação Prática: ${dayNode.title}` : `Iniciar Dia ${dayNode.dayNumber}: ${dayNode.title}`}
              >
                {renderIcon(dayNode, isCompleted)}

                {/* Badge Indicator */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 fill-blue-600 ml-0.5" />
                </div>
              </button>

              {/* Title & Tag */}
              <div className={`mt-2.5 px-3 py-1.5 rounded-xl border shadow-xs text-center max-w-[190px] transition-colors ${
                isExam ? 'bg-amber-50/90 border-amber-200 text-amber-900' : 'bg-white/90 border-slate-100 text-slate-800'
              }`}>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {isExam ? '🏆 PROVA PRÁTICA' : `DIA ${dayNode.dayNumber}`}
                </div>
                <div className="text-xs font-black leading-snug">
                  {dayNode.title}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  {dayNode.titlePt}
                </div>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
