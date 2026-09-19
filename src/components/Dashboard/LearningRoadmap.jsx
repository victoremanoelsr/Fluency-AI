import React from 'react';
import { 
  Check, 
  Lock, 
  Play, 
  Flag, 
  HandMetal, 
  Book, 
  Users, 
  Coffee, 
  Home, 
  User, 
  Sparkles,
  Flame
} from 'lucide-react';
import { ROADMAP_LEVELS } from '../../data/lessons';

export const LearningRoadmap = ({
  completedLessons = ['say-hello'],
  onStartLesson,
  streakInfo
}) => {
  const currentLevel = ROADMAP_LEVELS[0]; // Iniciante
  const lessons = currentLevel.lessons;

  // Icon mapper
  const renderIcon = (lesson, isCompleted, isCurrent) => {
    if (isCompleted) {
      return (
        <div className="relative flex items-center justify-center">
          <span className="text-2xl">👋</span>
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        </div>
      );
    }

    if (isCurrent) {
      return <Flag className="w-6 h-6 text-white fill-white" />;
    }

    // Locked nodes
    switch (lesson.icon) {
      case 'book':
        return <Book className="w-5 h-5 text-slate-400" />;
      case 'coffee':
        return <Coffee className="w-5 h-5 text-slate-400" />;
      case 'users':
        return <Users className="w-5 h-5 text-slate-400" />;
      case 'home':
        return <Home className="w-5 h-5 text-slate-400" />;
      case 'user':
        return <User className="w-5 h-5 text-slate-400" />;
      default:
        return <Book className="w-5 h-5 text-slate-400" />;
    }
  };

  // Positions on the winding path: alternate left, center, right
  // Pattern: 0: center (0px), 1: right (75px), 2: left (-75px), 3: center (0px), 4: right (75px), 5: left (-75px), etc.
  const getOffsetStyle = (index) => {
    const pattern = [0, 80, -80, 0, 80, -80, 0, 80, -80];
    const offset = pattern[index % pattern.length];
    return { transform: `translateX(${offset}px)` };
  };

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 max-w-xl mx-auto w-full select-none">
      
      {/* Level Header with clean dividers */}
      <div className="w-full flex items-center justify-center gap-4 my-4">
        <div className="flex-1 h-px bg-slate-200"></div>
        <div className="text-xs font-black tracking-widest text-slate-400 uppercase">
          {currentLevel.name}
        </div>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      {/* Vertical Roadmap Container with curved connector */}
      <div className="relative flex flex-col items-center gap-12 my-6 w-full max-w-md">
        
        {/* Continuous S-curved background SVG line */}
        <svg 
          className="absolute top-8 left-1/2 -translate-x-1/2 w-72 h-[calc(100%-60px)] pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 144 0 
               C 144 50, 224 80, 224 130 
               C 224 180, 64 210, 64 260 
               C 64 310, 144 340, 144 390 
               C 144 440, 224 470, 224 520
               C 224 570, 64 600, 64 650
               C 64 700, 144 730, 144 780
               C 144 830, 224 860, 224 910
               C 224 960, 64 990, 64 1040"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>

        {/* Nodes */}
        {lessons.map((lesson, idx) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = !isCompleted && (idx === 0 || completedLessons.includes(lessons[idx - 1]?.id));
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div 
              key={lesson.id} 
              style={getOffsetStyle(idx)} 
              className="relative z-10 flex flex-col items-center transition-transform"
            >
              
              {/* Circular Node Button */}
              <button
                id={`lesson-node-${lesson.id}`}
                disabled={isLocked}
                onClick={() => onStartLesson(lesson)}
                className={`group relative w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-b from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-500/25 ring-4 ring-rose-100 hover:scale-105 active:scale-95'
                    : isCurrent
                    ? 'bg-gradient-to-b from-teal-400 to-teal-500 text-white shadow-xl shadow-teal-500/30 ring-6 ring-teal-100 animate-pulse hover:scale-110 active:scale-95'
                    : 'bg-slate-200/90 text-slate-400 cursor-not-allowed border-4 border-slate-300/60'
                }`}
              >
                {renderIcon(lesson, isCompleted, isCurrent)}

                {/* Padlock badge on locked nodes */}
                {isLocked && (
                  <div className="absolute -bottom-1 -right-1 bg-slate-400 text-white rounded-full p-1 shadow-xs">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </button>

              {/* Lesson Title Label */}
              <div className="mt-2 text-center">
                <span className={`text-xs font-bold transition-colors ${
                  isCurrent ? 'text-teal-700 font-extrabold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {lesson.title}
                </span>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};
