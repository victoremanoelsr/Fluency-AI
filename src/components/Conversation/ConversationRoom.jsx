import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Mic, 
  ArrowUp, 
  Trash2, 
  Languages, 
  Star, 
  Clock, 
  Sparkles,
  Send,
  Lightbulb,
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { speechRecognition } from '../../services/speechRecognition';
import { speechAudio } from '../../services/speechAudio';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';
import { PronunciationCard } from './PronunciationCard';

export const ConversationRoom = ({
  lesson,
  tutor,
  onBack,
  onCompleteSession
}) => {
  const [messages, setMessages] = useState([]);
  const [translationsVisible, setTranslationsVisible] = useState({});
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  // Timer counting elapsed time
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Recording & Input states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio controls
  const [isMuted, setIsMuted] = useState(false);

  // Completion modal state
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [starRating, setStarRating] = useState(5);
  const [uniqueWordsCount, setUniqueWordsCount] = useState(4);

  const messagesEndRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const inputRef = useRef(null);

  // Session timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Auto scroll messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  // Initial greeting from Tutor
  useEffect(() => {
    const initialText = lesson.phase1?.intro || `Oi, Victor! Sou o ${tutor.name}. Hoje vamos aprender e praticar a aula "${lesson.title}". Vamos começar?`;
    const initialCard = lesson.phase1?.initialCard || null;
    
    const initialMsg = {
      id: 'msg-init-1',
      sender: 'ai',
      text: initialText,
      messagePt: initialText,
      card: initialCard,
      translationPt: initialText,
      timestamp: new Date()
    };
    
    setMessages([initialMsg]);

    // Speak initial intro with natural voice
    if (!isMuted) {
      setIsAiSpeaking(true);
      if (initialCard?.phraseTarget) {
        speechAudio.speakBilingual({
          introPt: initialText,
          phraseEn: initialCard.phraseTarget,
          onEnd: () => setIsAiSpeaking(false)
        });
      } else {
        speechAudio.speak(initialText, {
          lang: 'pt-BR',
          onEnd: () => setIsAiSpeaking(false)
        });
      }
    }
  }, [lesson, tutor]);

  // Recording duration timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Handle Push-to-Talk recording
  const handleStartRecording = () => {
    if (isAiSpeaking) speechAudio.stop();
    setIsRecording(true);

    speechRecognition.startListening({
      onResult: (transcript, isFinal) => {
        if (isFinal && transcript.trim()) {
          handleUserSend(transcript.trim());
          setIsRecording(false);
        }
      },
      onError: (err) => {
        console.warn('Speech Recognition error:', err);
        setIsRecording(false);
      }
    });
  };

  const handleStopRecordingAndSend = () => {
    speechRecognition.stopListening();
    setIsRecording(false);
  };

  const handleCancelRecording = () => {
    speechRecognition.stopListening();
    setIsRecording(false);
  };

  // Send user message and get AI reply
  const handleUserSend = async (userText) => {
    if (!userText.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setIsProcessing(true);

    const totalUserMsgs = messages.filter(m => m.sender === 'user').length + 1;

    try {
      const aiResponse = await AIService.sendMessage({
        lesson,
        tutor,
        phase: totalUserMsgs >= 3 ? 'pratica' : 'aula',
        history: [...messages, userMsg],
        userMessage: userText
      });

      setIsProcessing(false);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse.messagePt || aiResponse.text,
        messagePt: aiResponse.messagePt || aiResponse.text,
        card: aiResponse.card || null,
        translationPt: aiResponse.translationPt || aiResponse.messagePt,
        correctionPt: aiResponse.correctionPt,
        isFeedbackReport: aiResponse.isFeedbackReport,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Speak response with natural voices
      if (!isMuted && !aiResponse.isFeedbackReport) {
        setIsAiSpeaking(true);
        if (aiResponse.card?.phraseTarget) {
          speechAudio.speakBilingual({
            introPt: aiResponse.messagePt || aiResponse.text,
            phraseEn: aiResponse.card.phraseTarget,
            onEnd: () => setIsAiSpeaking(false)
          });
        } else {
          speechAudio.speak(aiResponse.messagePt || aiResponse.text, {
            lang: 'pt-BR',
            onEnd: () => setIsAiSpeaking(false)
          });
        }
      }

      // If feedback report is returned, complete lesson and show modal
      if (aiResponse.isFeedbackReport || aiResponse.sessionCompleted) {
        StorageService.completeLesson(lesson.id);
        StorageService.updateStreakOnActivity(3, totalUserMsgs);
        setTimeout(() => {
          setIsCompletionModalOpen(true);
        }, 3000);
      }

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const toggleTranslation = (msgId) => {
    setTranslationsVisible(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleInspireHint = (hintText) => {
    setTextInput(hintText);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col select-none overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Professional Header Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between shadow-xs shrink-0">
        
        {/* Left: Back button + Tutor Profile info */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Voltar ao início"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {/* Tutor Avatar with Online Indicator */}
            <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-slate-900 border-2 border-blue-500 shadow-sm shrink-0">
              <img 
                src={tutor.avatar} 
                alt={tutor.name} 
                className="w-full h-full object-cover" 
              />
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white ${isAiSpeaking ? 'animate-ping' : ''}`}></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-slate-800 leading-none">{tutor.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {tutor.origin}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isAiSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                {isAiSpeaking ? 'Falando agora...' : 'Online • Pronto para conversar'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Lesson Topic */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-slate-100/80 border border-slate-200/60">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold text-slate-700">Aula: {lesson.title}</span>
          <span className="text-[11px] font-medium text-slate-400">({lesson.titlePt})</span>
        </div>

        {/* Right: Audio control + Timer + Exit */}
        <div className="flex items-center gap-2.5">
          
          {/* Elapsed Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-mono font-bold text-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              if (isAiSpeaking) speechAudio.stop();
              setIsMuted(!isMuted);
            }}
            title={isMuted ? 'Ativar som do tutor' : 'Silenciar som do tutor'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isMuted ? 'bg-slate-200 text-slate-500' : 'bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Exit Class Button */}
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-200/60 transition-colors"
          >
            Finalizar
          </button>

        </div>

      </header>

      {/* Central Immersive Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Messages Stream */}
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const showTrans = translationsVisible[msg.id];

            return (
              <div 
                key={msg.id}
                className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'} animate-fadeIn`}
              >
                {/* Tutor Avatar beside AI message */}
                {isAi && (
                  <div className="w-9 h-9 rounded-2xl overflow-hidden bg-slate-900 border border-blue-300 shadow-sm shrink-0 mt-1">
                    <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`max-w-xl flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                  
                  <div className={`p-4 sm:p-5 rounded-3xl text-sm sm:text-base leading-relaxed shadow-sm ${
                    isAi 
                      ? 'bg-white text-slate-800 rounded-tl-sm border border-slate-200/80' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm font-semibold shadow-blue-500/20'
                  }`}>
                    
                    {/* Main text (Conversational Portuguese from Tutor or User Response) */}
                    <div className="whitespace-pre-wrap">
                      {showTrans && msg.translationPt ? msg.translationPt : msg.text}
                    </div>

                    {/* Correction Tip if provided */}
                    {msg.correctionPt && (
                      <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold space-y-1">
                        <div className="font-extrabold flex items-center gap-1 text-amber-800">
                          <span>💡 Dica do Tutor</span>
                        </div>
                        <p>{msg.correctionPt}</p>
                      </div>
                    )}

                    {/* Pedagogical 3-Layer Card (Portuguese, English, Pronunciation Guide) */}
                    {isAi && msg.card && (
                      <div className="mt-3">
                        <PronunciationCard
                          cardData={msg.card}
                          onPracticeClick={(targetPhrase) => {
                            setTextInput(targetPhrase);
                            inputRef.current?.focus();
                          }}
                        />
                      </div>
                    )}

                  </div>

                  {/* Message timestamp and translation toggle */}
                  <div className="flex items-center gap-2 mt-1.5 px-2 text-[11px] text-slate-400 font-medium">
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isAi && (
                      <button
                        onClick={() => toggleTranslation(msg.id)}
                        className="hover:text-blue-600 font-semibold transition-colors flex items-center gap-1"
                        title="Alternar tradução"
                      >
                        <Languages className="w-3 h-3" />
                        <span>{showTrans ? 'Ver original' : 'Traduzir'}</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* User Avatar beside User message */}
                {!isAi && (
                  <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center shadow-sm shrink-0 mt-1">
                    V
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isProcessing && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl overflow-hidden bg-slate-900 border border-blue-300 shadow-sm shrink-0">
                <img src={tutor.avatar} alt={tutor.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-slate-200 text-slate-400 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs font-semibold text-slate-500 ml-1">{tutor.name} está ouvindo e formulando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Bottom Professional Dual Console (Always-Visible Input + Mic + Hints) */}
      <footer className="p-3 sm:p-4 px-4 sm:px-8 border-t border-slate-200 bg-white shadow-lg shrink-0">
        <div className="max-w-3xl mx-auto space-y-3">
          
          {/* Quick Inspiring Hints Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0 text-[11px]">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              Respostas rápidas:
            </span>
            
            {[
              "Hello! Nice to meet you.",
              "I'm good, and you?",
              "Can I get a black coffee, please?",
              "What's your name?",
              "Where are you from?"
            ].map((hint, idx) => (
              <button
                key={idx}
                onClick={() => handleInspireHint(hint)}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-semibold shrink-0 transition-colors border border-slate-200/60"
              >
                {hint}
              </button>
            ))}
          </div>

          {/* Active Audio Recording Bar (If Recording) */}
          {isRecording ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-inner animate-pulse">
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                <span className="text-xs font-black text-emerald-800">
                  Ouvindo sua voz... Fale em inglês ({formatTimer(recordingSeconds)})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Cancel recording */}
                <button
                  onClick={handleCancelRecording}
                  className="p-2.5 rounded-xl bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-xs transition-colors"
                  title="Cancelar gravação"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Send recording */}
                <button
                  onClick={handleStopRecordingAndSend}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <ArrowUp className="w-4 h-4 stroke-[3]" />
                  <span>Enviar Áudio</span>
                </button>
              </div>

            </div>
          ) : (
            /* Standard Dual Input Bar: Text input + Mic Button + Send Button */
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSend(textInput);
              }}
              className="flex items-center gap-2.5"
            >
              {/* Text Input */}
              <div className="flex-1 relative flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Digite sua resposta em inglês ou aperte no microfone ao lado..."
                  className="w-full px-4 py-3 sm:py-3.5 pr-10 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>

              {/* Push-to-Talk Mic Button */}
              <button
                type="button"
                id="btn-voice-record"
                onClick={handleStartRecording}
                className="w-12 h-12 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs active:scale-95 transition-all shrink-0"
                title="Aperte para falar por voz"
              >
                <Mic className="w-5 h-5" />
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="px-5 py-3 sm:py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-black text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2 shrink-0"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>
      </footer>

      {/* Completion Modal */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 text-center space-y-5">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-base font-black">🏁 Sessão Concluída com Sucesso!</h3>
              <p className="text-xs text-blue-100">Como você avalia sua prática de hoje?</p>
              
              <div className="flex justify-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setStarRating(s)} className="p-1 hover:scale-110 transition-transform">
                    <Star className={`w-5 h-5 ${s <= starRating ? 'text-amber-300 fill-amber-300' : 'text-blue-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100">
                <span className="text-[10px] font-bold text-slate-400 block">Palavras</span>
                <span className="text-sm font-black text-blue-600">{uniqueWordsCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 block">Tempo</span>
                <span className="text-sm font-black text-emerald-600">{formatTimer(secondsElapsed)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] font-bold text-slate-400 block">Ofensiva</span>
                <span className="text-sm font-black text-amber-600">+1 dia 🔥</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  if (onCompleteSession) onCompleteSession();
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all"
              >
                Próxima Aula
              </button>
              <button
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  onBack();
                }}
                className="w-full py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Voltar à Trilha
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
