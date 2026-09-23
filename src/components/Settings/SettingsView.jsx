import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { speechAudio } from '../../services/speechAudio';
import { Key, Sparkles, Check, ArrowLeft, Volume2, Mic, Sliders, Shield } from 'lucide-react';

export const SettingsView = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('conta');
  const [openAiKey, setOpenAiKey] = useState(StorageService.getOpenAiKey());
  const [geminiKey, setGeminiKey] = useState(StorageService.getApiKey());
  const [aiProvider, setAiProvider] = useState(StorageService.getSettings().aiProvider || 'simulated');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSpeechPlaying, setTestSpeechPlaying] = useState(false);

  const handleSaveKeys = () => {
    StorageService.setOpenAiKey(openAiKey);
    StorageService.setApiKey(geminiKey);
    const settings = StorageService.getSettings();
    StorageService.saveSettings({ ...settings, aiProvider });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestVoice = () => {
    setTestSpeechPlaying(true);
    speechAudio.speakBilingual({
      introPt: "Olá, Victor! Este é o teste de voz do Fluency AI em português brasileiro.",
      phraseEn: "Welcome to your smart English speaking practice!",
      onEnd: () => setTestSpeechPlaying(false)
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 select-none animate-fadeIn">
      
      {/* Back Button */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Trilha</span>
        </button>
      )}

      {/* Top Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('conta')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'conta' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          IA & Conexão
          {activeTab === 'conta' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('voz')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'voz' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Voz & Áudio
          {activeTab === 'voz' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ajuda')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'ajuda' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Ajuda & Microfone
          {activeTab === 'ajuda' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Tab: IA & Conexão */}
      {activeTab === 'conta' && (
        <div className="space-y-6">
          
          <div>
            <h2 className="text-xl font-black text-slate-800">Inteligência Artificial & Chaves</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              O Fluency AI funciona de forma inteligente com motor simulado imediato ou conectado à sua chave de API para respostas infinitas.
            </p>
          </div>

          {/* AI Provider selector */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h4 className="font-extrabold text-sm text-slate-800">Motor de Inteligência Artificial</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'simulated', name: 'Motor Local (Zero Config)', desc: 'Respostas rápidas sem gastar créditos de API' },
                { id: 'gemini', name: 'Google Gemini', desc: 'Conexão direta com Gemini 1.5 Flash' },
                { id: 'openai', name: 'OpenAI GPT-4o', desc: 'Respostas avançadas com voz ultra-humana' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAiProvider(p.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    aiProvider === p.id 
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-200 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-black text-xs text-slate-800">{p.name}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">{p.desc}</div>
                </button>
              ))}
            </div>

            {/* OpenAI Key input */}
            {aiProvider === 'openai' && (
              <div className="pt-2 space-y-1.5 animate-fadeIn">
                <label className="text-xs font-extrabold text-slate-700">Chave da API OpenAI (sk-...)</label>
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400">Ativa também o TTS ultra-realista OpenAI `tts-1`.</span>
              </div>
            )}

            {/* Gemini Key input */}
            {aiProvider === 'gemini' && (
              <div className="pt-2 space-y-1.5 animate-fadeIn">
                <label className="text-xs font-extrabold text-slate-700">Chave da API Google Gemini</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSaveKeys}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedSuccess ? 'Configurações Salvas!' : 'Salvar Preferências'}</span>
              </button>
            </div>

          </div>

          {/* Reset storage */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-extrabold text-sm text-slate-800">Restaurar Dados da Sessão</h4>
            <p className="text-xs text-slate-400">
              Redefine o histórico de conversas e volta ao estado inicial se necessário.
            </p>
            <button
              onClick={() => {
                if (confirm('Deseja resetar o progresso das aulas e reiniciar?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              Resetar Progresso
            </button>
          </div>

        </div>
      )}

      {/* Tab: Voz & Áudio */}
      {activeTab === 'voz' && (
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-5">
          <div>
            <h3 className="font-black text-lg text-slate-800">Voz do Tutor e Áudio</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              O motor bilíngue fala explicações em português do Brasil e pronuncia frases com sotaque americano nativo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">Teste de Pronúncia e Voz</h4>
                <p className="text-xs text-slate-500">Ouça o exemplo em português com transição para o inglês.</p>
              </div>
            </div>

            <button
              onClick={handleTestVoice}
              disabled={testSpeechPlaying}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors"
            >
              {testSpeechPlaying ? 'Reproduzindo...' : 'Testar Agora'}
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed">
            <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Dica para melhor qualidade sonora:</span>
            </div>
            <p>
              Navegadores como o <strong>Microsoft Edge</strong> e o <strong>Google Chrome</strong> possuem as vozes neurais mais humanas disponíveis nativamente no Windows e celulares (*Microsoft Natural* e *Google Natural*). Elas são ativadas automaticamente pelo Fluency AI.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Ajuda */}
      {activeTab === 'ajuda' && (
        <div className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4">
          <h3 className="font-black text-lg text-slate-800">Dúvidas & Microfone</h3>
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <p>
              <strong>1. O microfone não grava?</strong> Verifique se você concedeu permissão ao navegador para usar o microfone clicando no ícone de cadeado na barra de endereço.
            </p>
            <p>
              <strong>2. Como funciona o Card de Pronúncia?</strong> Cada card possui o significado em português, a frase certa em inglês e o guia de pronúncia abrasileirada em vermelho para ler sem travar, além dos botões para ouvir normal (1.0x) ou lento (0.75x).
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
