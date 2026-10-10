import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize2, 
  Volume2, 
  Languages, 
  Mic, 
  Lightbulb, 
  Send, 
  Trash2, 
  Sparkles,
  CheckCircle2,
  Trophy,
  Star
} from 'lucide-react';
import { speechAudio } from '../../services/speechAudio';
import { AIService } from '../../services/aiService';
import { StorageService } from '../../services/storage';

export const MobileCallRoom = ({
  tutor,
  dayNumber = 2,
  onBack,
  onCompleteSession
}) => {
  const [messages, setMessages] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [currentStage, setCurrentStage] = useState('aula'); // 'aula' | 'pratica'
  const [audioSpeed, setAudioSpeed] = useState('1x');
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 minutos padrão
  
  // Gravação de voz
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showInspire, setShowInspire] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [turnCount, setTurnCount] = useState(1);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const lessonTimerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Formatar tempo regressivo (ex: 04:48 ou 14:59)
  const formatTimer = (totalSecs) => {
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Timer decrescente da aula
  useEffect(() => {
    lessonTimerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(lessonTimerRef.current);
          setIsCompletionOpen(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(lessonTimerRef.current);
  }, []);

  // Timer de gravação de voz
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
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  // Mensagem inicial de abertura com voz do ElevenLabs
  useEffect(() => {
    const profile = StorageService.getUserProfile();
    const studentName = profile.name || 'Victor';
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

    const openingText = `Oi, ${studentName}! ${greeting}! Hoje vamos focar no inglês falado do dia a dia americano, sem regras chatas de escola. Você tem preferência de assunto pra gente treinar hoje? Quer falar sobre futebol, viagens, filmes, trabalho ou outro tema do seu dia?`;

    const initialMsg = {
      id: 'ai-init',
      sender: 'ai',
      text: openingText,
      timestamp: new Date()
    };

    setMessages([initialMsg]);

    setIsAiSpeaking(true);
    speechAudio.speak(openingText, {
      lang: 'pt-BR',
      voiceId: tutor?.voiceId,
      onEnd: () => setIsAiSpeaking(false)
    });
  }, [tutor]);

  // Gravar áudio real com microfone
  const startRecordingAudio = async () => {
    if (isAiSpeaking) speechAudio.stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Simula transcrição/reconhecimento da fala do usuário
        handleUserSpeechTurn("I want to talk about soccer and learn how Americans celebrate!");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.warn('Erro ao acessar microfone:', err);
      // Fallback para input de texto
      setShowKeyboard(true);
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const cancelRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Enviar mensagem do usuário (por fala ou texto)
  const handleUserSpeechTurn = async (userText) => {
    if (!userText?.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setIsProcessing(true);
    const nextTurn = turnCount + 1;
    setTurnCount(nextTurn);

    // Na segunda rodada, muda para fase 'pratica'
    if (nextTurn >= 3) {
      setCurrentStage('pratica');
    }

    try {
      const aiResponse = await AIService.sendMessage({
        lesson: { title: `Dia ${dayNumber}`, topic: 'Inglês do Dia a Dia' },
        tutor,
        phase: nextTurn >= 3 ? 'PHASE_2_PRACTICE' : 'PHASE_1_INPUT',
        history: [...messages, userMsg],
        userMessage: userText,
        currentTurn: nextTurn
      });

      setIsProcessing(false);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse.messagePt || aiResponse.text,
        card: aiResponse.card,
        correctionPt: aiResponse.correctionPt,
        isFeedbackReport: aiResponse.isFeedbackReport,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);

      // Tocar fala da IA com ElevenLabs
      setIsAiSpeaking(true);
      const textToSpeak = aiResponse.card?.phraseTarget 
        ? `${aiMsg.text}. ${aiResponse.card.phraseTarget}`
        : aiMsg.text;

      speechAudio.speak(textToSpeak, {
        lang: 'pt-BR',
        voiceId: tutor?.voiceId,
        onEnd: () => setIsAiSpeaking(false)
      });

      if (aiResponse.isFeedbackReport || nextTurn >= 7) {
        setTimeout(() => setIsCompletionOpen(true), 3000);
      }

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleToggleSpeed = () => {
    setAudioSpeed(prev => prev === '1x' ? '1.25x' : prev === '1.25x' ? '0.75x' : '1x');
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-white flex flex-col shadow-2xl relative overflow-hidden select-none font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. TOPO AZUL GRADIENTE COM A FOTO DA TUTORA (IDÊNTICO À IMAGEM 2) */}
      <div className="relative w-full bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#2563eb] pt-3 pb-6 px-4 flex flex-col items-center">
        
        {/* Status Bar (09:38) */}
        <div className="w-full flex items-center justify-between text-white/90 text-xs font-bold mb-3 px-1">
          <span>09:38</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2 rounded-xs border border-white/80 p-0.5">
              <div className="w-full h-full bg-white rounded-xs"></div>
            </div>
          </div>
        </div>

        {/* Top Controls: [X] [Timer 04:48] ... [1x] */}
        <div className="w-full flex items-center justify-between z-20">
          
          {/* Esquerda: Botão X + Timer */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition-all border border-white/20 shadow-xs"
              title="Fechar chamada"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-mono font-bold border border-white/20 shadow-xs">
              {formatTimer(secondsRemaining)}
            </div>
          </div>

          {/* Direita: Velocidade 1x */}
          <button
            onClick={handleToggleSpeed}
            className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold border border-white/20 shadow-xs hover:bg-white/30 transition-all"
            title="Velocidade da voz"
          >
            {audioSpeed}
          </button>
        </div>

        {/* Imagem Central da Tutora (Ruiva com jaqueta jeans da referência) */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 my-1 flex items-center justify-center z-10">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/40 shadow-2xl bg-blue-950/60">
            <img 
              src={tutor?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"} 
              alt={tutor?.name || "Tutor"} 
              className="w-full h-full object-cover object-top scale-110"
            />
          </div>
        </div>

        {/* Indicador de Estágios: Aula / Prática & Botão Expandir */}
        <div className="w-full flex items-center justify-between text-xs z-20 px-1">
          {/* Indicador com bolinhas e traço */}
          <div className="flex flex-col gap-1.5 text-white text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentStage === 'aula' ? 'bg-white shadow-xs' : 'bg-white/40'}`}></span>
              <span className={currentStage === 'aula' ? 'text-white' : 'text-white/60'}>Aula</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentStage === 'pratica' ? 'bg-white shadow-xs' : 'bg-white/40'}`}></span>
              <span className={currentStage === 'pratica' ? 'text-white' : 'text-white/60'}>Prática</span>
            </div>
          </div>

          {/* Botão de Expandir no canto direito */}
          <button 
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition-colors"
            title="Expandir"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. PAINEL BRANCO INFERIOR ARREDONDADO (COM O CHAT) */}
      <div className="flex-1 bg-white -mt-4 rounded-t-3xl shadow-xl flex flex-col p-4 z-20 overflow-hidden">
        
        {/* Banner Laranja "Aula" no Topo do Painel */}
        <div className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm flex items-center gap-2 shadow-xs mb-3">
          <Languages className="w-4 h-4 stroke-[2.5]" />
          <span>Aula</span>
        </div>

        {/* Área de Mensagens da Conversa */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 pb-2">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div key={msg.id} className={`flex items-start gap-2 ${isAi ? 'justify-start' : 'justify-end'}`}>
                
                {/* Balão de Fala */}
                <div className={`p-4 rounded-3xl text-sm leading-relaxed max-w-[85%] ${
                  isAi 
                    ? 'bg-slate-100/90 text-slate-800 rounded-tl-sm border border-slate-200/60 font-medium' 
                    : 'bg-blue-600 text-white rounded-tr-sm font-semibold shadow-md shadow-blue-500/20'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Card de Frase em Inglês Nativo se houver */}
                  {isAi && msg.card && (
                    <div className="mt-3 p-3 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-1">
                      <span className="text-[10px] font-black uppercase text-blue-600 block">Como o americano fala:</span>
                      <div className="text-base font-black text-slate-900">{msg.card.phraseTarget}</div>
                      <div className="text-xs text-slate-500 font-semibold">{msg.card.phrasePt}</div>
                      {msg.card.pronunciationGuide && (
                        <div className="text-[11px] font-mono text-emerald-600 pt-0.5">
                          🗣️ Som: {msg.card.pronunciationGuide}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dica de pronúncia se houver */}
                  {isAi && msg.correctionPt && (
                    <div className="mt-2.5 p-2 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200/60">
                      💡 {msg.correctionPt}
                    </div>
                  )}
                </div>

                {/* Botões laterais do balão da IA: Traduzir e Ouvir */}
                {isAi && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <button
                      onClick={() => alert(`Tradução: ${msg.text}`)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                      title="Traduzir"
                    >
                      <Languages className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        speechAudio.speak(msg.text, {
                          lang: 'pt-BR',
                          voiceId: tutor?.voiceId
                        });
                      }}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-colors"
                      title="Ouvir novamente"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            );
          })}

          {/* Feedback digitando/pensando */}
          {isProcessing && (
            <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 p-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-spin" />
              <span>{tutor?.name || 'Tutor'} está escutando sua pronúncia...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Menu "Inspirar" com sugestões rápidas */}
        {showInspire && (
          <div className="p-2.5 mb-2 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-center gap-2 overflow-x-auto text-xs animate-fadeIn">
            <span className="text-blue-700 font-bold shrink-0">Sugestões:</span>
            {[
              "Quero falar de futebol!",
              "Como um americano pede café?",
              "Me ensina gírias do dia a dia!",
              "Pode repetir a pronúncia?"
            ].map((sug, i) => (
              <button
                key={i}
                onClick={() => {
                  handleUserSpeechTurn(sug);
                  setShowInspire(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-600 hover:text-white text-slate-700 font-bold shadow-2xs shrink-0 border border-slate-200 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* 3. RODAPÉ DE ENTRADA: Tipo | Botão Azul Redondo Grande | Inspirar */}
        <div className="pt-2 pb-1 border-t border-slate-100">
          
          {isRecording ? (
            /* Gravando Áudio */
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-300 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-ping"></span>
                <span className="text-xs font-black text-blue-900">
                  Ouvindo sua voz... ({formatTimer(recordingSeconds)})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelRecordingAudio}
                  className="p-2 rounded-xl bg-white text-rose-600 border border-rose-200 text-xs font-bold"
                  title="Cancelar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={stopRecordingAudio}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          ) : showKeyboard ? (
            /* Modo Digitação ("Tipo") */
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleUserSpeechTurn(textInput);
              }}
              className="flex items-center gap-2 animate-fadeIn"
            >
              <button
                type="button"
                onClick={() => setShowKeyboard(false)}
                className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold"
              >
                Voz
              </button>
              <input
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Digite sua resposta..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="p-2.5 rounded-xl bg-blue-600 disabled:opacity-40 text-white font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Modo Padrão da Foto: Tipo | Botão Azul Grande no Centro | Inspirar */
            <div className="flex items-center justify-around py-1">
              
              {/* Botão "Tipo" */}
              <button
                onClick={() => {
                  setShowKeyboard(true);
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-all"
              >
                <div className="w-13 h-13 rounded-full bg-blue-50 group-hover:bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-500 shadow-2xs">
                  <Languages className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-[11px] font-bold text-slate-500">Tipo</span>
              </button>

              {/* Botão Azul Redondo Grande de Microfone no Centro */}
              <button
                onClick={startRecordingAudio}
                className="relative -top-1 w-18 h-18 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 hover:from-blue-700 hover:to-sky-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 active:scale-90 transition-all ring-4 ring-blue-100"
                title="Aperte para falar"
              >
                <Mic className="w-8 h-8 stroke-[2.2]" />
              </button>

              {/* Botão "Inspirar" */}
              <button
                onClick={() => setShowInspire(prev => !prev)}
                className="flex flex-col items-center gap-1 group active:scale-95 transition-all"
              >
                <div className="w-13 h-13 rounded-full bg-blue-50 group-hover:bg-blue-100 border border-blue-100 flex items-center justify-center text-blue-500 shadow-2xs">
                  <Lightbulb className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-[11px] font-bold text-slate-500">Inspirar</span>
              </button>

            </div>
          )}

          {/* Indicador Home Bar de Smartphone */}
          <div className="w-32 h-1 bg-slate-900 rounded-full mx-auto mt-2"></div>
        </div>

      </div>

      {/* Modal de Conclusão da Aula com Mini-Teste */}
      {isCompletionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white space-y-2">
              <Trophy className="w-12 h-12 text-amber-300 mx-auto animate-bounce" />
              <h3 className="text-lg font-black">🎉 Aula do Dia Concluída!</h3>
              <p className="text-xs text-emerald-100">Você praticou escuta e repetição de inglês nativo hoje.</p>
              
              <div className="text-2xl font-black pt-1">
                95% <span className="text-xs font-normal">de precisão</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsCompletionOpen(false);
                  if (onCompleteSession) onCompleteSession();
                }}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                Liberar Próximo Dia 🚀
              </button>
              <button
                onClick={() => {
                  setIsCompletionOpen(false);
                  onBack();
                }}
                className="w-full py-2.5 rounded-2xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors"
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
