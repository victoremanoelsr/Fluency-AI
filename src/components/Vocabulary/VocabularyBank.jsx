import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { BookMarked, Volume2, Trash2, CheckCircle2, Circle, Sparkles, Search } from 'lucide-react';
import { speechAudio } from '../../services/speechAudio';

export const VocabularyBank = () => {
  const [vocabList, setVocabList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadVocab();
  }, []);

  const loadVocab = () => {
    setVocabList(StorageService.getVocabulary());
  };

  const handleToggleMastered = (id) => {
    const updated = StorageService.toggleVocabularyMastered(id);
    setVocabList(updated);
  };

  const handleDelete = (id) => {
    const updated = StorageService.removeVocabularyItem(id);
    setVocabList(updated);
  };

  const handleSpeak = (phrase) => {
    speechAudio.speak(phrase);
  };

  const filtered = vocabList.filter(item =>
    item.phrase.toLowerCase().includes(search.toLowerCase()) ||
    item.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-5 animate-fadeIn">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Meu Banco de Vocabulário</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              {vocabList.length} Salvos
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Expressões, gírias e frases salvas durante suas conversas.
          </p>
        </div>
      </div>

      {/* Search */}
      {vocabList.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Buscar no meu vocabulário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      )}

      {/* List */}
      {vocabList.length === 0 ? (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-3 border-dashed border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <BookMarked className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-white text-base">Nenhuma expressão salva ainda</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Durante os cenários de conversa ou na aba de gírias, clique no ícone de marcador para salvar frases aqui!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`glass-panel p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item.mastered ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleMastered(item.id)}
                  className="mt-1 text-slate-500 hover:text-emerald-400 transition-colors"
                  title={item.mastered ? "Marcar como a praticar" : "Marcar como dominado"}
                >
                  {item.mastered ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-sm sm:text-base text-white ${item.mastered ? 'line-through text-slate-400' : ''}`}>
                      "{item.phrase}"
                    </h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-xs text-indigo-300 mt-0.5">
                    {item.meaning}
                  </p>

                  {item.nativeForm && item.nativeForm !== item.phrase && (
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">
                      🗣️ {item.nativeForm}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleSpeak(item.phrase)}
                  className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 transition-colors"
                  title="Ouvir áudio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
