import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Clock, 
  Target, 
  Headphones, 
  Flame, 
  Volume2, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { ELEVENLABS_TUTORS } from '../../services/elevenlabs';
import { speechAudio } from '../../services/speechAudio';
import { StorageService } from '../../services/storage';

export const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [level, setLevel] = useState('Iniciante');
  const [goal, setGoal] = useState('Falar como nativo no dia a dia');
  const [interest, setInterest] = useState('Futebol e Esportes');
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [selectedTutorId, setSelectedTutorId] = useState('ana-alice');
  const [name, setName] = useState('Victor');

  const levels = [
    { id: 'Iniciante', label: 'Iniciante (Do Zero)', desc: 'Nunca estudei ou travo completamente para falar', icon: '🌱' },
    { id: 'Básico', label: 'Básico', desc: 'Entendo palavras soltas, mas não consigo formular frases completas', icon: '🚶' },
    { id: 'Intermediário', label: 'Intermediário', desc: 'Já estudei gramática antes, mas quero falar com naturalidade e sem medo', icon: '🚀' }
  ];

  const goals = [
    { id: 'Falar como nativo no dia a dia', label: 'Inglês do Dia a Dia', desc: 'Falar de forma natural como um americano, sem regras chatas', icon: '💬' },
    { id: 'Viagens Internacionais', label: 'Viagens & Turismo', desc: 'Se virar sozinho em aeroportos, hotéis, restaurantes e ruas', icon: '✈️' },
    { id: 'Trabalho e Carreira', label: 'Trabalho & Entrevistas', desc: 'Conseguir vagas no exterior ou reuniões de negócios', icon: '💼' },
    { id: 'Filmes e Séries', label: 'Filmes, Séries & Games', desc: 'Entender diálogos reais sem depender de legendas', icon: '🎬' }
  ];

  const interests = [
    { id: 'Futebol e Esportes', label: '⚽ Futebol & Esportes' },
    { id: 'Filmes, Séries & Música', label: '🍿 Filmes & Séries' },
    { id: 'Tecnologia & Games', label: '🎮 Games & Tecnologia' },
    { id: 'Carreira & Negócios', label: '📈 Trabalho & Negócios' },
    { id: 'Viagens & Culturas', label: '🌎 Viagens & Aventuras' },
    { id: 'Dia a dia e Festas', label: '🍕 Dia a Dia & Resenha' }
  ];

  const times = [
    { minutes: 10, label: '10 minutos / dia', tag: 'Rápido & Focado' },
    { minutes: 15, label: '15 minutos / dia', tag: 'Recomendado ⭐' },
    { minutes: 30, label: '30 minutos / dia', tag: 'Imersão Total' }
  ];

  const handlePlayVoice = (tutor, e) => {
    e.stopPropagation();
    speechAudio.speak(`Olá ${name}! Sou ${tutor.name}. Vamos aprender a falar inglês como um nativo?`, {
      voiceId: tutor.voiceId
    });
  };

  const handleFinish = () => {
    const chosenTutor = ELEVENLABS_TUTORS.find(t => t.id === selectedTutorId) || ELEVENLABS_TUTORS[0];
    
    const profile = {
      name: name.trim() || 'Victor',
      level,
      goal,
      interest,
      goalMinutes: dailyMinutes,
      tutorId: chosenTutor.id,
      onboardingCompleted: true
    };

    StorageService.setUserProfile(profile);
    StorageService.setSelectedTutorId(chosenTutor.id);
    localStorage.setItem('fluency_onboarding_done', 'true');
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col my-auto animate-fadeIn">
        
        {/* Top Progress Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white">
          <div className="flex items-center justify-between text-xs font-bold text-blue-100 mb-2">
            <span>Passo {step} de 5</span>
            <span>Diagnóstico do Aluno</span>
          </div>

          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          <h2 className="text-xl font-black text-white mt-4">
            {step === 1 && "Qual é o seu nome e nível de inglês?"}
            {step === 2 && "Qual é o seu objetivo principal?"}
            {step === 3 && "Qual assunto você mais gosta de falar?"}
            {step === 4 && "Quanto tempo você quer praticar por dia?"}
            {step === 5 && "Escolha a voz do seu Tutor Nativo"}
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            {step === 1 && "A IA vai calibrar as falas para você nunca travar."}
            {step === 2 && "Vamos focar no que você realmente precisa usar na vida real."}
            {step === 3 && "Você aprende 10x mais rápido falando sobre o que gosta."}
            {step === 4 && "As aulas diárias no calendário respeitarão essa duração."}
            {step === 5 && "Vozes ultra-realistas com sotaque americano autêntico."}
          </p>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* STEP 1: NOME & NÍVEL */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">Como a IA deve te chamar?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-600">Seu nível atual:</label>
                {levels.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLevel(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      level === item.id 
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-slate-800">{item.label}</h4>
                        {level === item.id && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: OBJETIVO */}
          {step === 2 && (
            <div className="space-y-2.5">
              {goals.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setGoal(item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    goal === item.id 
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm text-slate-800">{item.label}</h4>
                      {goal === item.id && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: INTERESSES */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-2.5">
              {interests.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setInterest(item.id)}
                  className={`p-3.5 rounded-2xl border text-center font-bold text-xs transition-all ${
                    interest === item.id
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* STEP 4: TEMPO DIÁRIO */}
          {step === 4 && (
            <div className="space-y-3">
              {times.map((item) => (
                <button
                  key={item.minutes}
                  onClick={() => setDailyMinutes(item.minutes)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    dailyMinutes === item.minutes 
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-black text-sm text-slate-800">{item.label}</h4>
                      <span className="text-[11px] font-bold text-blue-600">{item.tag}</span>
                    </div>
                  </div>
                  {dailyMinutes === item.minutes && <Check className="w-5 h-5 text-blue-600 stroke-[3]" />}
                </button>
              ))}
            </div>
          )}

          {/* STEP 5: ESCOLHA DA VOZ DO ELEVENLABS */}
          {step === 5 && (
            <div className="space-y-3">
              {ELEVENLABS_TUTORS.map((tutor) => (
                <div
                  key={tutor.id}
                  onClick={() => setSelectedTutorId(tutor.id)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedTutorId === tutor.id
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-sm text-slate-800">{tutor.name}</h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {tutor.origin}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tutor.style}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handlePlayVoice(tutor, e)}
                      className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                      title="Ouvir voz de teste"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {selectedTutorId === tutor.id && (
                      <Check className="w-5 h-5 text-blue-600 stroke-[3]" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              Voltar
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all"
            >
              <span>Começar Minha Trilha 🚀</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
