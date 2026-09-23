import React from 'react';
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
  MessageCircle
} from 'lucide-react';
import { ROADMAP_LEVELS } from '../../data/lessons';

export const LearningRoadmap = ({
  completedLessons = ['say-hello'],
  onStartLesson,
  streakInfo
}) => {
  const currentLevel = ROADMAP_LEVELS[0]; // Iniciante / Fluência Fundamental
  const lessons = currentLevel.lessons;

  // Icon mapper
  const renderIcon = (lesson, isCompleted) => {
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
      case 'handshake':
        return <Users className="w-6 h-6 text-white" />;
      case 'home':
        return <Home className="w-6 h-6 text-white" />;
      case 'user':
        return <User className="w-6 h-6 text-white" />;
      default:
        return <MessageCircle className="w-6 h-6 text-white" />;
    }
  };

  // Modern node colors for lessons
  const nodeThemes = [
    { bg: 'from-blue-500 to-indigo-600', ring: 'ring-blue-200/70', shadow: 'shadow-blue-500/25' },
    { bg: 'from-teal-500 to-emerald-600', ring: 'ring-teal-200/70', shadow: 'shadow-teal-500/25' },
    { bg: 'from-purple-500 to-indigo-600', ring: 'ring-purple-200/70', shadow: 'shadow-purple-500/25' },
    { bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-200/70', shadow: 'shadow-amber-500/25' },
    { bg: 'from-rose-500 to-pink-600', ring: 'ring-rose-200/70', shadow: 'shadow-rose-500/25' },
    { bg: 'from-cyan-500 to-blue-600', ring: 'ring-cyan-200/70', shadow: 'shadow-cyan-500/25' }
  ];

  // Positions on the winding path: alternate left, center, right
  const getOffsetStyle = (index) => {
    const pattern = [0, 70, -70, 0, 70, -70, 0, 70, -70];
    const offset = pattern[index % pattern.length];
    return { transform: `translateX(${offset}px)` };
  };

  return (
    <div className="flex-1 flex flex-col items-center py-6 px-4 max-w-xl mx-auto w-full select-none">
      
      {/* Level Header with clean dividers */}
      <div className="w-full flex items-center justify-center gap-4 my-3">
        <div className="flex-1 h-px bg-slate-200"></div>
        <div className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-500 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Módulos de Conversação Prática</span>
        </div>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      {/* Vertical Roadmap Container with curved connector */}
      <div className="relative flex flex-col items-center gap-14 my-6 w-full max-w-md">
        
        {/* Continuous S-curved background SVG line */}
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
               C 74 700, 144 730, 144 780
               C 144 830, 214 860, 214 910
               C 214 960, 74 990, 74 1040"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>

        {/* Nodes (All 100% unlocked and available) */}
        {lessons.map((lesson, idx) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const theme = nodeThemes[idx % nodeThemes.length];

          return (
            <div 
              key={lesson.id} 
              style={getOffsetStyle(idx)} 
              className="relative z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => onStartLesson(lesson)}
            >
              
              {/* Circular Node Button */}
              <button
                id={`lesson-node-${lesson.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onStartLesson(lesson);
                }}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg ${
                  theme.shadow
                } bg-gradient-to-tr ${theme.bg} text-white ring-4 ${theme.ring}`}
                title={`Iniciar aula: ${lesson.title}`}
              >
                {renderIcon(lesson, isCompleted)}

                {/* Floating start play badge on hover */}
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 fill-blue-600 ml-0.5" />
                </div>
              </button>

              {/* Lesson Title & Subtitle Card */}
              <div className="mt-2.5 px-3 py-1 rounded-xl bg-white/90 backdrop-blur-xs border border-slate-100 shadow-xs text-center max-w-[170px] group-hover:border-blue-200 transition-colors">
                <div className="text-xs font-black text-slate-800 leading-snug">
                  {lesson.title}
                </div>
                <div className="text-[10px] font-semibold text-slate-500">
                  {lesson.titlePt}
                </div>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
