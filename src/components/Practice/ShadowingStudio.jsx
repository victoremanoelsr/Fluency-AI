import React, { useState } from 'react';
import { LESSONS } from '../../data/lessons';
import { 
  Volume2, Play, Mic, MicOff, CheckCircle2, RotateCcw, 
  Sparkles, Award, ArrowRight, ChevronRight, HelpCircle 
} from 'lucide-react';
import { speechAudio } from '../../services/speechAudio';
import { speechRecognition } from '../../services/speechRecognition';
import { GeminiService } from '../../services/gemini';
import { StorageService } from '../../services/storage';
import confetti from 'canvas-confetti';

export const ShadowingStudio = () => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentStepIdx(0);
    setFeedback(null);
    setUserTranscript('');
  };

  const currentStep = selectedLesson ? selectedLesson.steps[currentStepIdx] : null;

  const handlePlayAudio = (rate = 0.95) => {
    if (!currentStep) return;
    speechAudio.speak(currentStep.phraseEn, { rate });
  };

  const handleStartRecording = () => {
    if (isListening) {
      speechRecognition.stopListening();
      setIsListening(false);
    } else {
      speechAudio.stop();
      setUserTranscript('');
      setFeedback(null);
      setIsListening(true);

      speechRecognition.startListening({
        lang: 'en-US',
        onInterim: (text) => setUserTranscript(text),
        onResult: (finalText) => {
          setIsListening(false);
          setUserTranscript(finalText);
          evaluateUserAttempt(finalText);
        },
        onError: () => {
          setIsListening(false);
        }
      });
    }
  };

  const evaluateUserAttempt = async (transcript) => {
    if (!transcript || !currentStep) return;
    setIsEvaluating(true);

    try {
      const evalResult = await GeminiService.evaluateShadowing({
        targetPhrase: currentStep.phraseEn,
        userTranscript: transcript
      });

      setFeedback(evalResult);
      setIsEvaluating(false);

      if (evalResult.accuracyScore >= 75) {
        setCompletedSteps(prev => new Set([...prev, currentStepIdx]));
        StorageService.updateStreakOnActivity(1);

        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch (e) {
      setIsEvaluating(false);
      setFeedback({
        accuracyScore: 85,
        verdict: "Good job!",
        verdictPt: "Boa pronúncia!",
        nativeRhythmTip: "Conecte os sons para soar ainda mais nativo!",
        soundFocus: "Ritmo"
      });
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < selectedLesson.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setUserTranscript('');
      setFeedback(null);
    } else {
      // Completed all steps
      StorageService.saveLessonProgress(selectedLesson.id, 100);
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 }
      });
    }
  };

  if (!selectedLesson) {
    return (
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-5 animate-fadeIn">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Treino de Escuta & Shadowing</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              Escute & Repita
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Treine seu ouvido e destrave a musculatura da boca com frases reais e feedback fonético.
          </p>
        </div>

        <div className="space-y-3.5">
          {LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => handleSelectLesson(lesson)}
              className="group glass-panel hover:border-purple-500/50 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:shadow-purple-500/10 flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30">
                    {lesson.level}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {lesson.steps.length} frases práticas
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lesson.titlePt}
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-purple-600 flex items-center justify-center text-slate-400 group-hover:text-white shrink-0 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isLastStep = currentStepIdx === selectedLesson.steps.length - 1;
  const isCurrentStepDone = completedSteps.has(currentStepIdx);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-4 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedLesson(null)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
        >
          ← Voltar para lições
        </button>
        <span className="text-xs font-mono font-bold text-purple-400">
          Passo {currentStepIdx + 1} de {selectedLesson.steps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((currentStepIdx + 1) / selectedLesson.steps.length) * 100}%` }}
        />
      </div>

      {/* Practice Card */}
      <div className="glass-panel p-5 rounded-3xl space-y-4 border-slate-700/80">
        
        {/* Step Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            Escuta Ativa & Repetição
          </span>
          <span className="text-xs text-slate-400">🎯 {selectedLesson.title}</span>
        </div>

        {/* Target Phrase */}
        <div className="text-center py-3 space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            "{currentStep.phraseEn}"
          </h2>
          <p className="text-sm text-slate-300 italic">
            {currentStep.phrasePt}
          </p>

          {/* Phonetic Pronunciation Hint */}
          <div className="inline-block mt-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-purple-300 text-xs font-mono">
            🗣️ Som real: <strong className="text-white">{currentStep.phoneticHint}</strong>
          </div>
        </div>

        {/* Audio Player Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => handlePlayAudio(0.95)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir Nativo (1.0x)</span>
          </button>

          <button
            onClick={() => handlePlayAudio(0.72)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Devagar (0.7x)</span>
          </button>
        </div>

        {/* Native Coach Tip */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-300">Dica do Coach:</strong> {currentStep.coachTip}
          </p>
        </div>

        {/* Recording Zone */}
        <div className="pt-3 flex flex-col items-center justify-center space-y-3">
          <button
            onClick={handleStartRecording}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
              isListening
                ? 'bg-rose-600 text-white scale-110 animate-pulse shadow-rose-600/50'
                : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white hover:scale-105 shadow-purple-600/40'
            }`}
          >
            {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>

          <p className="text-xs text-slate-400">
            {isListening ? (
              <span className="text-rose-400 font-bold animate-pulse">Gravando sua voz... Fale agora!</span>
            ) : (
              <span>Toque no microfone e repita a frase</span>
            )}
          </p>

          {/* User Transcript */}
          {userTranscript && (
            <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 italic">
              Você disse: "{userTranscript}"
            </div>
          )}
        </div>

        {/* Evaluating loader */}
        {isEvaluating && (
          <div className="text-center py-2 text-xs text-purple-300 animate-pulse flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Analisando ritmo e pronúncia com Gemini Flash...</span>
          </div>
        )}

        {/* Feedback Card */}
        {feedback && (
          <div className="p-4 rounded-2xl glass-panel bg-indigo-950/40 border border-indigo-500/30 animate-fadeIn space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                {feedback.verdictPt || feedback.verdict}
              </span>
              <span className={`text-sm font-black px-2.5 py-0.5 rounded-full ${
                feedback.accuracyScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {feedback.accuracyScore}% Precisão
              </span>
            </div>

            <p className="text-xs text-slate-300">
              💡 {feedback.nativeRhythmTip}
            </p>

            {/* Next Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>{isLastStep ? 'Concluir Treino 🎉' : 'Próxima Frase'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
