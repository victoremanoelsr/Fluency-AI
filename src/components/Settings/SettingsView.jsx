import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Key, Sparkles, Check, ArrowLeft } from 'lucide-react';

export const SettingsView = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('conta');
  const [openAiKey, setOpenAiKey] = useState(StorageService.getOpenAiKey());
  const [geminiKey, setGeminiKey] = useState(StorageService.getApiKey());
  const [aiProvider, setAiProvider] = useState(StorageService.getSettings().aiProvider || 'openai');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKeys = () => {
    StorageService.setOpenAiKey(openAiKey);
    StorageService.setApiKey(geminiKey);
    const settings = StorageService.getSettings();
    StorageService.saveSettings({ ...settings, aiProvider });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 select-none animate-fadeIn">
      
      {/* Back Button if present */}
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>
      )}

      {/* Top Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('conta')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'conta' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Conta
          {activeTab === 'conta' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('assinatura')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'assinatura' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Assinatura
          {activeTab === 'assinatura' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-full"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ajuda')}
          className={`pb-3 text-sm font-bold transition-all relative ${
            activeTab === 'ajuda' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Ajuda & Suporte
          {activeTab === 'ajuda' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-600 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Tab: Conta */}
      {activeTab === 'conta' && (
        <div className="space-y-6">
          
          <div>
            <h2 className="text-xl font-black text-slate-800">Conta</h2>
            <p className="text-xs text-slate-400 mt-0.5">Gerencie as configurações da sua conta.</p>
          </div>

          {/* Google Account Card */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-100 flex items-center justify-center">
                <span className="font-black text-lg text-blue-500">G</span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">Conta Google</h4>
                <p className="text-xs text-slate-400">victor.esr6@gmail.com</p>
              </div>
            </div>

            <button 
              onClick={() => alert('Sessão encerrada com sucesso.')}
              className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Sair
            </button>
          </div>

          {/* AI Brain Key Configuration Card */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-sky-500" />
              <h3 className="font-extrabold text-sm text-slate-800">Cérebro da IA (OpenAI / Gemini)</h3>
            </div>
            <p className="text-xs text-slate-500">
              O Learna AI funciona perfeitamente no modo simulado. Se preferir usar sua própria chave da OpenAI (GPT-4o) ou Google Gemini, insira abaixo:
            </p>

            {/* Provider selector */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAiProvider('openai')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  aiProvider === 'openai' 
                    ? 'bg-sky-500 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                OpenAI (GPT-4o)
              </button>
              <button
                type="button"
                onClick={() => setAiProvider('gemini')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  aiProvider === 'gemini' 
                    ? 'bg-sky-500 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Google Gemini
              </button>
              <button
                type="button"
                onClick={() => setAiProvider('simulated')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  aiProvider === 'simulated' 
                    ? 'bg-sky-500 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Modo Simulado (Zero Config)
              </button>
            </div>

            {aiProvider === 'openai' && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Chave de API da OpenAI (sk-...)
                </label>
                <input
                  type="password"
                  value={openAiKey}
                  onChange={(e) => setOpenAiKey(e.target.value)}
                  placeholder="sk-proj-..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            {aiProvider === 'gemini' && (
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Chave de API do Google Gemini (AIzaSy...)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleSaveKeys}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedSuccess ? 'Configurações Salvas!' : 'Salvar Configurações'}</span>
              </button>
            </div>

          </div>

          {/* Delete Account */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="font-extrabold text-sm text-slate-800">Excluir Conta</h4>
            <p className="text-xs text-slate-400">
              Esta ação irá apagar permanentemente sua conta e todos os seus dados.
            </p>
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja apagar sua conta?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="mt-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              Excluir Conta
            </button>
          </div>

        </div>
      )}

      {/* Tab: Assinatura */}
      {activeTab === 'assinatura' && (
        <div className="p-6 rounded-2xl border border-sky-100 bg-sky-50/50 space-y-4">
          <h3 className="font-extrabold text-base text-slate-800">Plano PRO</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sua assinatura atual permite acesso ilimitado a todos os 13 tutores, aulas práticas e reconhecimento de voz.
          </p>
          <div className="font-bold text-sm text-sky-600">Status: Ativo (PRO)</div>
        </div>
      )}

      {/* Tab: Ajuda */}
      {activeTab === 'ajuda' && (
        <div className="p-6 rounded-2xl border border-slate-100 bg-white space-y-3">
          <h3 className="font-extrabold text-base text-slate-800">Perguntas Frequentes & Suporte</h3>
          <p className="text-xs text-slate-500">
            Dúvidas ou problemas com o microfone? Verifique se deu permissão ao navegador para usar o microfone e selecione seu idioma preferido.
          </p>
        </div>
      )}

    </div>
  );
};
