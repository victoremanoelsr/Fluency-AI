import React, { useState } from 'react';
import { SLANG_AND_REDUCTIONS } from '../../data/slangDatabase';
import { Volume2, Sparkles, BookMarked, Check, Play, Search } from 'lucide-react';
import { speechAudio } from '../../services/speechAudio';
import { StorageService } from '../../services/storage';
import confetti from 'canvas-confetti';

export const SlangExplorer = () => {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());

  const filtered = SLANG_AND_REDUCTIONS.filter(item =>
    item.phrase.toLowerCase().includes(search.toLowerCase()) ||
    item.meaningPt.toLowerCase().includes(search.toLowerCase()) ||
    item.categoryPt.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlayAudio = (phrase, rate = 0.95) => {
    speechAudio.speak(phrase, { rate });
  };

  const handleSaveToVocab = (item) => {
    StorageService.addVocabularyItem({
      phrase: item.phrase,
      meaning: item.meaningPt,
      nativeForm: item.realSoundsLike,
      example: item.examples[0]?.en || item.audioSample,
      category: item.categoryPt
    });

    setSavedIds(prev => new Set([...prev, item.id]));
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.85 }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-5 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>Gírias & Reduções dos EUA</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
            Inglês da Vida Real
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Como os americanos realmente falam na rua, filmes, séries e no dia a dia.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Buscar gíria, redução ou expressão..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-pink-500 transition-colors"
        />
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isSaved = savedIds.has(item.id);

          return (
            <div
              key={item.id}
              className="glass-panel p-4 sm:p-5 rounded-2xl border-slate-800 hover:border-pink-500/40 transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    {item.categoryPt}
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1.5 flex items-center gap-2">
                    {item.phrase}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(item.audioSample || item.phrase)}
                    className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white transition-colors"
                    title="Ouvir pronúncia e exemplo"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleSaveToVocab(item)}
                    className={`p-2 rounded-xl transition-colors ${
                      isSaved
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                    }`}
                    title="Salvar no meu Vocabulário"
                  >
                    <BookMarked className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Phonetic & Meaning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pronúncia falada:</span>
                  <span className="font-mono text-pink-300 font-semibold text-xs">"{item.realSoundsLike}"</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">O que significa:</span>
                  <span className="text-white font-semibold">{item.meaningPt}</span>
                </div>
              </div>

              {/* Explanation */}
              <p className="text-xs text-slate-300 leading-relaxed">
                💡 {item.explanation}
              </p>

              {/* Real Examples */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Exemplos reais:</span>
                {item.examples.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="text-white font-medium">"{ex.en}"</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{ex.pt}</p>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(ex.en)}
                      className="p-1 text-indigo-400 hover:text-white shrink-0 ml-2"
                      title="Ouvir exemplo"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
