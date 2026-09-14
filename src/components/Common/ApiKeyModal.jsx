import React, { useState } from 'react';
import { KeyRound, X, ExternalLink, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../../services/storage';

export const ApiKeyModal = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(StorageService.getApiKey());
  const [selectedModel, setSelectedModel] = useState(StorageService.getSettings().geminiModel || 'gemini-1.5-flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      StorageService.removeApiKey();
    } else {
      StorageService.setApiKey(apiKey.trim());
    }

    const currentSettings = StorageService.getSettings();
    StorageService.saveSettings({ ...currentSettings, geminiModel: selectedModel });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onKeySaved) onKeySaved();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Chave Google Gemini
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                100% Grátis
              </span>
            </h3>
            <p className="text-xs text-slate-400">Personalize sua IA com Gemini Flash</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-3.5 mb-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p>
              O <strong>Gemini Flash</strong> é gratuito no Google AI Studio. Sua chave é guardada <strong>apenas no seu navegador</strong> para sua total privacidade e controle.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Sua Chave de API (Gemini API Key):
            </label>
            <input
              type="password"
              placeholder="Cole sua AIzaSy... aqui"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Modelo Gemini:
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultrarrápido & Gratuito)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Mais Recente & Inteligente)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Mais Profundo)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-indigo-400">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline hover:text-indigo-300"
            >
              <span>Gerar chave gratuita no AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Configuração Salva com Sucesso!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Salvar e Começar a Praticar</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
