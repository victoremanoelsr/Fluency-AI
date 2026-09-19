import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Maximize2, 
  FileText, 
  Keyboard, 
  Lightbulb, 
  ArrowUp, 
  Trash2, 
  Languages, 
  Star, 
  CheckCircle,
  Clock,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { speechRecognition } from '../../services/speechRecognition';
import { speechAudio } from '../../services/speechAudio';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';

export const ConversationRoom = ({
  lesson,
  tutor,
  onBack,
  onCompleteSession
}) => {
  // Lesson phase: 'aula' (Phase 1) | 'pratica' (Phase 2)
  const [phase, setPhase] = useState('aula');
  const [messages, setMessages] = useState([]);
  const [translationsVisible, setTranslationsVisible] = useState({});
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  // Timer (e.g. starting at 04:46 = 286 seconds)
  const [timeLeft, setTimeLeft] = useState(286);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [inputMode, setInputMode] = useState('voice'); // 'voice' | 'text'
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio controls
  const [isMuted, setIsMuted] = useState(false);

  // Completion modal state
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [starRating, setStarRating] = useState(5);
  const [uniqueWordsCount, setUniqueWordsCount] = useState(3);
  const [sessionStartTime] = useState(Date.now());

  const messagesEndRef = useRef(null);
  const recordingTimerRef = useRef(null);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
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

  // Initial greeting from Tutor in Phase 1 (Aula)
  useEffect(() => {
    const initialText = lesson.phase1?.intro || `Oi, Victor! Hoje vamos aprender e praticar a aula "${lesson.title}". Pronto para começar?`;
    const initialMsg = {
      id: 'msg-init-1',
      sender: 'ai',
      text: initialText,
      translationPt: initialText,
      timestamp: new Date()
    };
    
    setMessages([initialMsg]);

    // Speak initial intro
    if (!isMuted) {
      setIsAiSpeaking(true);
      speechAudio.speak(initialText, () => setIsAiSpeaking(false));
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

    // If we are in Phase 1 and user finishes check question, transition to Phase 2 (Prática)
    const totalUserMsgs = messages.filter(m => m.sender === 'user').length + 1;

    try {
      // Check if should trigger transition to Phase 2 (Prática)
      if (phase === 'aula' && totalUserMsgs >= 2) {
        setPhase('pratica');
        const transitionMsgText = lesson.phase2?.scenarioPrompt || "Vamos praticar agora em uma conversa simples. A conversa começa agora!";
        
        setTimeout(() => {
          const transMsg = {
            id: `ai-trans-${Date.now()}`,
            sender: 'ai',
            text: transitionMsgText,
            translationPt: "Vamos praticar em uma conversa de situação real.",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, transMsg]);
          setIsProcessing(false);
          if (!isMuted) {
            setIsAiSpeaking(true);
            speechAudio.speak(transitionMsgText, () => setIsAiSpeaking(false));
          }
        }, 1000);
        return;
      }

      const aiResponse = await AIService.sendMessage({
        lesson,
        tutor,
        phase,
        history: [...messages, userMsg],
        userMessage: userText
      });

      setIsProcessing(false);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse.text,
        translationPt: aiResponse.translationPt,
        correctionPt: aiResponse.correctionPt,
        isFeedbackReport: aiResponse.isFeedbackReport,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Speak response
      if (!isMuted && !aiResponse.isFeedbackReport) {
        setIsAiSpeaking(true);
        speechAudio.speak(aiResponse.text, () => setIsAiSpeaking(false));
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

  // Toggle translation button A/文
  const toggleTranslation = (msgId) => {
    setTranslationsVisible(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  // Provide inspiration hint
  const handleInspireHint = () => {
    const hints = [
      "Hello! Nice to meet you.",
      "Good morning, my name is Victor.",
      "I would like a coffee, please.",
      "I'm good, how about you?",
      "Goodbye, have a great day!"
    ];
    const picked = hints[Math.floor(Math.random() * hints.length)];
    setTextInput(picked);
    setInputMode('text');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col select-none overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Controls Bar */}
      <header className="h-14 px-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
        
        {/* Left: Phase indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs">
            <span className={`w-2 h-2 rounded-full ${phase === 'aula' ? 'bg-amber-500' : 'bg-purple-600'} animate-pulse`}></span>
            <span>{phase === 'aula' ? 'Aula Interativa' : 'Prática / Conversação'}</span>
          </div>
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">
            {lesson.title}
          </span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          
          {/* Countdown timer (04:46) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 font-mono font-bold text-xs text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          {/* Notes button */}
          <button 
            title="Anotações da aula"
            className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Audio Speaker Mute Toggle */}
          <button
            onClick={() => {
              if (isAiSpeaking) speechAudio.stop();
              setIsMuted(!isMuted);
            }}
            title={isMuted ? 'Ativar som do tutor' : 'Silenciar som do tutor'}
            className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Close red button */}
          <button
            id="btn-close-call"
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-xs"
            title="Encerrar aula"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>

        </div>

      </header>

      {/* Main Classroom Screen: 2 Columns */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Video Panel (45%) */}
        <div className="w-full md:w-[45%] lg:w-[42%] p-4 bg-slate-50 flex flex-col gap-4 border-r border-slate-100 justify-between shrink-0">
          
          {/* Top Video: AI Tutor Avatar */}
          <div className="relative flex-1 rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-800 flex items-center justify-center">
            
            <img 
              src={tutor.avatar} 
              alt={tutor.name} 
              className={`w-full h-full object-cover transition-transform duration-700 ${isAiSpeaking ? 'scale-105' : 'scale-100'}`} 
            />

            {/* Glowing robot chest indicator for Learna-X */}
            <div className={`absolute top-[68%] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] ${isAiSpeaking ? 'animate-ping' : 'opacity-80'}`}></div>

            {/* Stage indicator pill */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
              <span className={`w-2 h-2 rounded-full ${phase === 'aula' ? 'bg-amber-400' : 'bg-purple-400'} animate-pulse`}></span>
              <span>{phase === 'aula' ? '• Aula' : '• Prática'}</span>
            </div>

            {/* Tutor Name label */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold">
              {tutor.name}
            </div>

            {/* Fullscreen icon */}
            <button className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-colors">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* Bottom Video: Student Preview */}
          <div className="relative h-44 rounded-3xl overflow-hidden bg-sky-50/80 border border-sky-100 shadow-xs flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-sky-200 text-sky-700 font-black text-2xl flex items-center justify-center shadow-inner">
              V
            </div>
            <div className="absolute bottom-3 left-4 text-xs font-bold text-slate-500">
              Victor (Você)
            </div>
          </div>

        </div>

        {/* Right Chat & Interactive Stream Panel (55%) */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          
          {/* Phase Banner */}
          <div className={`px-6 py-2.5 font-extrabold text-xs flex items-center gap-2 ${
            phase === 'aula' ? 'bg-amber-500 text-white' : 'bg-purple-600 text-white'
          }`}>
            <span>{phase === 'aula' ? '🔤 Aula' : '🟣 Prática'}</span>
            <span className="text-[11px] font-semibold opacity-90">
              {phase === 'aula' ? 'Aprenda os conceitos e vocabulário' : 'Roleplay em tempo real'}
            </span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              const showTrans = translationsVisible[msg.id];

              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} group`}
                >
                  <div className="flex items-start gap-2 max-w-lg">
                    
                    {/* Message Bubble */}
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                      isAi 
                        ? 'bg-slate-100 text-slate-800 rounded-tl-sm' 
                        : 'bg-sky-500 text-white rounded-tr-sm font-medium'
                    }`}>
                      
                      {/* Formatted body */}
                      <div className="whitespace-pre-wrap">
                        {showTrans && msg.translationPt ? msg.translationPt : msg.text}
                      </div>

                      {/* Gentle Portuguese correction tip if present */}
                      {msg.correctionPt && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-xs font-semibold text-amber-800 bg-amber-50/80 p-2 rounded-xl">
                          💡 {msg.correctionPt}
                        </div>
                      )}
                    </div>

                    {/* Instant Translation Icon A/文 */}
                    {isAi && (
                      <button
                        onClick={() => toggleTranslation(msg.id)}
                        className={`p-1.5 rounded-full border transition-colors shrink-0 mt-1 ${
                          showTrans 
                            ? 'bg-sky-500 text-white border-sky-500 shadow-xs' 
                            : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                        title="Alternar tradução"
                      >
                        <Languages className="w-3.5 h-3.5" />
                      </button>
                    )}

                  </div>
                </div>
              );
            })}

            {/* Typing / Processing indicator */}
            {isProcessing && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-100 text-slate-400 w-16">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Actions Bar */}
          <div className="p-4 px-6 border-t border-slate-100 bg-white flex flex-col gap-3 shrink-0">
            
            {/* Input field if text mode enabled */}
            {inputMode === 'text' && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserSend(textInput);
                }}
                className="flex items-center gap-2 w-full"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Digite sua resposta em inglês..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-sky-500"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs disabled:opacity-50"
                >
                  Enviar
                </button>
              </form>
            )}

            {/* Bottom Controls Row: Digitar | Push-to-Talk Mic | Inspirar */}
            <div className="flex items-center justify-between w-full">
              
              {/* Digitar (Toggle text mode) */}
              <button
                onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
                className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
                  inputMode === 'text' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Keyboard className="w-4 h-4" />
                </div>
                <span>Digitar</span>
              </button>

              {/* Central Audio Recording Button */}
              {isRecording ? (
                /* Active Recording State: Green Button with Arrow + Trash + Timer */
                <div className="flex items-center gap-4">
                  {/* Cancel / Trash */}
                  <button
                    onClick={handleCancelRecording}
                    className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-200 transition-colors shadow-xs"
                    title="Descartar gravação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Send recorded audio */}
                  <button
                    onClick={handleStopRecordingAndSend}
                    className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-all animate-bounce"
                    title="Enviar áudio"
                  >
                    <ArrowUp className="w-7 h-7 stroke-[3]" />
                  </button>

                  {/* Recording Timer */}
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{formatTimer(recordingSeconds)}</span>
                  </div>
                </div>
              ) : (
                /* Normal Mic Button */
                <div className="flex flex-col items-center gap-1">
                  <button
                    id="btn-push-to-talk"
                    onClick={handleStartRecording}
                    className="w-16 h-16 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 active:scale-95 transition-all"
                    title="Aperte para falar"
                  >
                    <Mic className="w-7 h-7" />
                  </button>
                  <span className="text-[10px] font-bold text-slate-400">Aperte para falar</span>
                </div>
              )}

              {/* Inspirar button */}
              <button
                onClick={handleInspireHint}
                className="flex flex-col items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-sky-600 transition-colors"
                title="Sugerir frase para falar"
              >
                <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span>Inspirar</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Final Completion Modal */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 text-center space-y-5 animate-fadeIn">
            
            {/* Header banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white space-y-2">
              <h3 className="text-base font-black">🏁 Prática finalizada!</h3>
              <p className="text-xs text-purple-100">O quanto esta prática foi útil para você?</p>
              <div className="flex justify-center gap-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setStarRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= starRating ? 'text-amber-300 fill-amber-300' : 'text-purple-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Metrics Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
                <span className="text-[10px] font-bold text-slate-400 block">Palavras únicas</span>
                <span className="text-sm font-black text-sky-600">{uniqueWordsCount}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] font-bold text-slate-400 block">Duração</span>
                <span className="text-sm font-black text-emerald-600">02:49</span>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] font-bold text-slate-400 block">Total sessões</span>
                <span className="text-sm font-black text-amber-600">1</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                id="btn-next-session"
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  onCompleteSession && onCompleteSession();
                }}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs shadow-md shadow-sky-500/20 transition-all"
              >
                Ir para a próxima sessão
              </button>

              <button
                onClick={() => {
                  setIsCompletionModalOpen(false);
                  onBack();
                }}
                className="w-full py-2.5 rounded-xl text-sky-600 font-bold text-xs hover:bg-sky-50 transition-colors"
              >
                Ir para a página inicial
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
