import React, { useState } from 'react';
import { Volume2, Check, X } from 'lucide-react';
import { TUTORS } from '../../data/tutors';
import { speechAudio } from '../../services/speechAudio';

export const TutorSelectModal = ({
  isOpen,
  currentTutor,
  onSelectTutor,
  onClose
}) => {
  const [selected, setSelected] = useState(currentTutor || TUTORS[0]);

  if (!isOpen) return null;

  const handlePlayVoice = (tutor, e) => {
    e?.stopPropagation();
    const samplePhrases = {
      'learna-x': "Hello Victor! I am Learna-X. Let's make learning English simple and enjoyable together.",
      'learna': "Hi there! I am Learna. I will help you speak American English with total confidence.",
      'mateo': "Hey! I am Mateo. Get ready to speak English for travel and socializing anywhere!",
      'hazel': "Hello darling! I'm Hazel from London. Let's have a lovely chat today.",
      'skye': "G'day! I'm Skye. Let's practice relaxed, natural Australian expressions.",
      'jasmine': "Hello! I am Jasmine. Don't be shy, we will learn together step by step.",
      'darius': "Greetings Victor. I am Darius. Let's sharpen your professional communication skills.",
      'aiko': "Konnichiwa! I am Aiko. We will study systematically and clearly.",
      'anisha': "Hello! I am Anisha. Let's explore global English and cultural conversations.",
      'reina': "Hey! I am Reina. Let's bring high energy to your everyday conversation!",
      'layla': "Hola Victor! I am Layla. Together we will overcome any translation traps.",
      'santa-claus': "Ho ho ho! Merry learning! Speaking English is wonderful fun!",
      'mrs-claus': "Hello dear Victor! Take your time, we will practice with warmth and care."
    };
    speechAudio.speak(samplePhrases[tutor.id] || `Hello Victor, I am ${tutor.name}.`);
  };

  const handleConfirm = () => {
    onSelectTutor(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Top Selected Tutor Banner */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white flex flex-col sm:flex-row items-center sm:items-start gap-5 shrink-0">
          
          {/* Avatar with Sound Button */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-800 border-2 border-sky-400/40 shadow-lg shrink-0">
            <img 
              src={selected.avatar} 
              alt={selected.name} 
              className="w-full h-full object-cover" 
            />
            <button
              onClick={(e) => handlePlayVoice(selected, e)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 hover:bg-sky-500 text-white flex items-center justify-center transition-colors shadow-sm"
              title="Ouvir voz do tutor"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-black text-white">{selected.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                {selected.origin}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-xl">
              {selected.bio}
            </p>
          </div>

          {/* Close X */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

        {/* Modal Body: Tutors Grid */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <h4 className="text-lg font-black text-slate-800">Escolha o Tutor</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {TUTORS.map((tutor) => {
              const isSelected = selected.id === tutor.id;

              return (
                <div
                  key={tutor.id}
                  id={`tutor-card-${tutor.id}`}
                  onClick={() => setSelected(tutor)}
                  className={`relative rounded-2xl p-3.5 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                    isSelected 
                      ? 'border-sky-500 bg-sky-50/40 shadow-sm ring-2 ring-sky-200' 
                      : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  {/* Avatar Banner */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 mb-3 relative group">
                    <img 
                      src={tutor.avatar} 
                      alt={tutor.name} 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      onClick={(e) => handlePlayVoice(tutor, e)}
                      className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 hover:bg-sky-500 text-white flex items-center justify-center transition-colors shadow-sm"
                      title="Ouvir voz"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-sm text-slate-800">{tutor.name}</h5>
                      <span className="text-[10px] text-slate-400 font-semibold">{tutor.origin}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      {tutor.traits.join(' • ')}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {tutor.tags.map((tag, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          <span>{tag.icon}</span>
                          <span>{tag.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            id="btn-confirm-tutor"
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
          >
            Continuar com {selected.name}
          </button>
        </div>

      </div>

    </div>
  );
};
