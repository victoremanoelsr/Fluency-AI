import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Sparkles, ArrowLeft, Send, 
  BookMarked, Check, ChevronDown, ChevronUp, AlertCircle, 
  RotateCcw, VolumeX, Lightbulb, Play
} from 'lucide-react';
import { GeminiService } from '../../services/gemini';
import { speechAudio } from '../../services/speechAudio';
import { speechRecognition } from '../../services/speechRecognition';
import { StorageService } from '../../services/storage';
import { AudioWave } from '../Common/AudioWave';
import confetti from 'canvas-confetti';

export const ConversationRoom = ({ scenario, onBack, onOpenApiKey }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: scenario.starterPrompt,
      textPt: scenario.contextPt,
      userCorrection: null,
      quickSuggestions: scenario.usefulPhrases.map(p => p.en).slice(0, 3),
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showTranslations, setShowTranslations] = useState({});
  const [savedPhrases, setSavedPhrases] = useState(new Set());
  const [showGoals, setShowGoals] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);

  const chatEndRef = useRef(null);
  const settings = StorageService.getSettings();

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding, interimText]);

  // Initial speech audio
  useEffect(() => {
    if (settings.autoPlayAudio && messages.length === 1) {
      handleSpeak(scenario.starterPrompt);
    }
    return () => {
      speechAudio.stop();
      speechRecognition.stopListening();
    };
  }, []);

  const handleSpeak = (text, rate = settings.voiceSpeed || 0.95) => {
    speechAudio.speak(text, {
      rate,
      onStart: () => setIsAiSpeaking(true),
      onEnd: () => setIsAiSpeaking(false),
      onError: () => setIsAiSpeaking(false)
    });
  };

  const toggleListen = () => {
    if (isListening) {
      speechRecognition.stopListening();
      setIsListening(false);
      setInterimText('');
    } else {
      speechAudio.stop();
      setIsListening(true);
      setInterimText('');

      speechRecognition.startListening({
        lang: 'en-US',
        onInterim: (text) => setInterimText(text),
        onResult: (finalText) => {
          setIsListening(false);
          setInterimText('');
          if (finalText) {
            handleSendMessage(finalText);
          }
        },
        onError: (err) => {
          setIsListening(false);
          setInterimText('');
          console.warn('Speech err:', err);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiResponding) return;

    setInputText('');
    setInterimText('');

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsAiResponding(true);

    try {
      const response = await GeminiService.sendConversationMessage({
        scenario,
        history: updatedHistory,
        userMessage: text
      });

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.reply,
        textPt: response.replyPt,
        userCorrection: response.userCorrection?.hasFeedback ? response.userCorrection : null,
        quickSuggestions: response.quickSuggestions || [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsAiResponding(false);

      // Trigger streak progress
      StorageService.updateStreakOnActivity(1);

      // If there's feedback, display it nicely
      if (response.userCorrection?.hasFeedback) {
        setActiveFeedback(response.userCorrection);
      }

      // Play AI Audio
      if (settings.autoPlayAudio) {
        handleSpeak(response.reply);
      }
    } catch (err) {
      setIsAiResponding(false);
      const errMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I couldn't catch that clearly. Could you try again?",
        textPt: "Não consegui entender com clareza. Você pode tentar de novo?",
        error: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    }
  };

  const handleSaveToVocab = (item) => {
    StorageService.addVocabularyItem({
      phrase: item.nativeWay || item.text,
      meaning: item.whyNative || item.textPt || 'Expressão do dia a dia',
      nativeForm: item.nativeWay || item.text,
      example: item.example || scenario.title,
      category: scenario.category
    });
    setSavedPhrases(prev => new Set([...prev, item.text || item.nativeWay]));
    
    confetti({
      particleCount: 25,
      spread: 40,
      origin: { y: 0.85 }
    });
  };

  const toggleTranslation = (id) => {
    setShowTranslations(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px-65px)] max-w-2xl mx-auto w-full">
      
      {/* Scenario Header */}
      <div className="glass-panel border-b border-slate-800/80 p-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Voltar aos Cenários"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{scenario.character.avatar}</span>
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-1.5">
                {scenario.character.name}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h2>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">{scenario.title}</p>
            </div>
          </div>
        </div>

        {/* Goals Accordion Toggle */}
        <button
          onClick={() => setShowGoals(!showGoals)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Objetivos</span>
          {showGoals ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Goals Drawer */}
      {showGoals && (
        <div className="glass-card bg-indigo-950/40 border-b border-indigo-500/20 p-3.5 text-xs text-indigo-100 animate-fadeIn shrink-0">
          <p className="font-bold text-indigo-300 mb-1.5 flex items-center gap-1.5">
            🎯 Seus objetivos nesta conversa real:
          </p>
          <ul className="space-y-1 list-disc list-inside text-slate-300">
            {scenario.goals.map((g, idx) => (
              <li key={idx}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isTranslated = showTranslations[msg.id];
          const isSaved = savedPhrases.has(msg.text);

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}>
              
              <div className="flex items-end gap-2 max-w-[88%]">
                {!isUser && (
                  <span className="text-xl mb-1 shrink-0">{scenario.character.avatar}</span>
                )}

                <div
                  className={`relative p-3.5 rounded-2xl ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-sm shadow-md shadow-indigo-500/10'
                      : 'glass-card bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed font-medium">
                    {msg.text}
                  </p>

                  {/* Translation if toggled */}
                  {isTranslated && msg.textPt && (
                    <div className="mt-2 pt-2 border-t border-slate-700/60 text-xs text-indigo-300 italic">
                      🇧🇷 {msg.textPt}
                    </div>
                  )}

                  {/* Message Tools for AI messages */}
                  {!isUser && (
                    <div className="mt-2.5 flex items-center gap-3 text-slate-400 text-xs pt-1 border-t border-slate-700/40">
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
                        title="Ouvir na velocidade normal"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Ouvir</span>
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.text, 0.72)}
                        className="flex items-center gap-1 hover:text-indigo-300 transition-colors"
                        title="Ouvir devagar para treinar o ouvido"
                      >
                        <Play className="w-3 h-3 text-amber-400" />
                        <span className="text-amber-300/90 font-mono">0.7x</span>
                      </button>

                      <button
                        onClick={() => toggleTranslation(msg.id)}
                        className="hover:text-indigo-300 transition-colors ml-auto"
                      >
                        {isTranslated ? 'Ocultar' : 'Traduzir'}
                      </button>

                      <button
                        onClick={() => handleSaveToVocab(msg)}
                        className={`transition-colors ${isSaved ? 'text-emerald-400 font-bold' : 'hover:text-amber-400'}`}
                        title="Salvar no meu Vocabulário"
                      >
                        <BookMarked className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Spoken Native Correction Card */}
              {!isUser && msg.userCorrection && (
                <div className="ml-7 max-w-[88%] glass-panel bg-amber-950/25 border border-amber-500/30 rounded-2xl p-3 animate-fadeIn text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Como um americano diria no dia a dia:</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-amber-500/20 mb-1.5">
                    <span className="font-semibold text-white text-xs">{msg.userCorrection.nativeWay}</span>
                    <button
                      onClick={() => handleSpeak(msg.userCorrection.nativeWay)}
                      className="p-1 text-amber-400 hover:text-white"
                      title="Ouvir forma nativa"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    💡 {msg.userCorrection.whyNative}
                  </p>

                  {msg.userCorrection.slangOrReduction && (
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-mono text-[10px] border border-amber-500/30">
                      Redução: {msg.userCorrection.slangOrReduction}
                    </div>
                  )}
                </div>
              )}

              {/* Quick suggestion chips */}
              {!isUser && msg.quickSuggestions && msg.quickSuggestions.length > 0 && (
                <div className="ml-7 max-w-[88%] flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider self-center mr-1">Sugestões:</span>
                  {msg.quickSuggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(sug)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/60 hover:border-indigo-500/40 text-slate-300 hover:text-white transition-all text-left"
                    >
                      "{sug}"
                    </button>
                  ))}
                </div>
              )}

            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAiResponding && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 ml-7">
            <span className="text-xl animate-bounce">{scenario.character.avatar}</span>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-200" />
              <span className="text-[11px] text-slate-400 ml-1">Respondendo...</span>
            </div>
          </div>
        )}

        {/* Interim Speech Transcription Live */}
        {interimText && (
          <div className="flex justify-end">
            <div className="bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 px-3.5 py-2 rounded-2xl text-xs italic animate-pulse">
              🎙️ "{interimText}"
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Spoken Action Bar & Microphone Button */}
      <div className="glass-panel border-t border-slate-800/80 p-3 shrink-0">
        <div className="flex items-center gap-2">
          
          {/* Main Voice Button */}
          <button
            onClick={toggleListen}
            className={`relative flex items-center justify-center p-3.5 rounded-2xl font-bold transition-all shadow-lg ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-600/50 scale-105 animate-pulse'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
            }`}
            title={isListening ? "Clique para finalizar a fala" : "Pressione para falar em inglês"}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Text Input for typing alternative */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={isListening ? "Ouvindo você falar em inglês..." : "Fale pelo microfone ou digite aqui..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isAiResponding}
            className={`p-2.5 rounded-xl transition-all ${
              inputText.trim() && !isAiResponding
                ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Status helper text */}
        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            {isListening ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                Ouvindo... Fale sua frase em inglês!
              </span>
            ) : isAiSpeaking ? (
              <span className="text-indigo-400 flex items-center gap-1 font-semibold">
                <Volume2 className="w-3 h-3 animate-pulse" />
                {scenario.character.name} falando...
              </span>
            ) : (
              <span>💡 Dica: Toque no microfone e fale naturalmente.</span>
            )}
          </span>
          <button 
            onClick={() => {
              setMessages([{
                id: 'reset',
                sender: 'ai',
                text: scenario.starterPrompt,
                textPt: scenario.contextPt,
                timestamp: new Date()
              }]);
            }}
            className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            title="Recomeçar conversa"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Recomeçar</span>
          </button>
        </div>
      </div>

    </div>
  );
};
