import React, { useState } from 'react';
import { SCENARIOS } from '../../data/scenarios';
import { MessageSquare, Sparkles, ChevronRight, Filter } from 'lucide-react';

export const ScenariosView = ({ onSelectScenario }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Daily Life', 'Travel', 'Social', 'Career'];
  const categoryLabels = {
    'All': 'Todos',
    'Daily Life': 'Dia a Dia',
    'Travel': 'Viagens',
    'Social': 'Social & Amigos',
    'Career': 'Trabalho'
  };

  const filtered = selectedCategory === 'All'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.category === selectedCategory);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-5 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>Cenários da Vida Real</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
            {SCENARIOS.length} Cenários
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pratique situações reais que você enfrentará nos EUA sem medo de errar.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-3.5">
        {filtered.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => onSelectScenario(scenario)}
            className="group glass-panel hover:border-indigo-500/50 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/10 flex items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                {scenario.emoji}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-400 border border-slate-700">
                    {scenario.categoryPt}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {scenario.character.name}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {scenario.contextPt}
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center text-slate-400 group-hover:text-white shrink-0 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
