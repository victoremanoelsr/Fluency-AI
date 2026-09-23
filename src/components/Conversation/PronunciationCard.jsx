import React, { useState } from 'react';
import { Volume2, Snail, Mic, Sparkles, CheckCircle2 } from 'lucide-react';
import { speechAudio } from '../../services/speechAudio';

export const PronunciationCard = ({
  cardData,
  onPracticeClick,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState('1.0x'); // '1.0x' | '0.75x'

  if (!cardData || !cardData.phraseTarget) return null;

  const {
    phrasePt = '',
    phraseTarget = '',
    pronunciationGuide = '',
    highlightWord = ''
  } = cardData;

  const handlePlayAudio = (rate = 0.95, label = '1.0x') => {
    setActiveSpeed(label);
    setIsPlaying(true);
    speechAudio.speak(phraseTarget, {
      lang: 'en-US',
      rate,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false)
    });
  };

  // Render text with highlight if specified
  const renderHighlightedTarget = () => {
    if (!highlightWord) {
      return <span>{phraseTarget}</span>;
    }

    const parts = phraseTarget.split(new RegExp(`(${highlightWord})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === highlightWord.toLowerCase() ? (
            <mark key={index} className="bg-yellow-300 text-blue-900 px-1.5 py-0.5 rounded-md font-extrabold mx-0.5 shadow-xs">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className={`w-full max-w-xl my-3 rounded-2xl border-[3px] border-blue-600 bg-white shadow-xl shadow-blue-500/10 overflow-hidden select-none transition-all hover:shadow-2xl hover:shadow-blue-500/15 ${className}`}>
      
      {/* Top Banner Tag */}
      <div className="bg-blue-600 px-4 py-1.5 flex items-center justify-between text-white text-[11px] font-black uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
          <span>Como Falar Corretamente</span>
        </div>
        <span className="text-[10px] bg-blue-700/80 px-2 py-0.5 rounded-full font-mono">
          Inglês Real
        </span>
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-3.5">
        
        {/* Layer 1: Em Português (Preto / Topo) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-100/90 border border-slate-200">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            Significado em Português
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight">
            {phrasePt}
          </div>
        </div>

        {/* Layer 2: Gramática Certa em Inglês (Azul / Meio) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 mb-1">
            Inglês Correto (Como o nativo fala)
          </div>
          <div className="text-lg sm:text-xl font-black text-blue-700 leading-snug tracking-tight">
            {renderHighlightedTarget()}
          </div>
        </div>

        {/* Layer 3: Pronúncia Facilitada Abrasileirada (Vermelho / Abaixo) */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-rose-50/70 border border-rose-100">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 mb-1">
            Pronúncia Facilitada (Leia como está escrito)
          </div>
          <div className="text-lg sm:text-xl font-black text-red-600 tracking-wide font-sans leading-snug">
            {pronunciationGuide}
          </div>
        </div>

        {/* Audio & Practice Controls Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
          
          {/* Audio speed controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayAudio(0.95, '1.0x')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPlaying && activeSpeed === '1.0x'
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
              }`}
              title="Ouvir na velocidade normal"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ouvir Nativo</span>
            </button>

            <button
              onClick={() => handlePlayAudio(0.7, '0.75x')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isPlaying && activeSpeed === '0.75x'
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
              }`}
              title="Ouvir devagar para treinar"
            >
              <Snail className="w-4 h-4 text-amber-600" />
              <span>Lento (0.75x)</span>
            </button>
          </div>

          {/* Practice Action */}
          {onPracticeClick && (
            <button
              onClick={() => onPracticeClick(phraseTarget)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all"
              title="Treinar falar esta frase agora"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Falar Esta Frase</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
