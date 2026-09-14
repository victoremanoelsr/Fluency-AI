import React, { useState, useEffect } from 'react';
import { StorageService } from '../../services/storage';
import { supabaseService } from '../../services/supabase';
import { speechAudio } from '../../services/speechAudio';
import { 
  KeyRound, Volume2, Sparkles, Sliders, ShieldCheck, 
  RotateCcw, Info, CheckCircle2, User, Database, ExternalLink 
} from 'lucide-react';

export const SettingsView = ({ onOpenApiKey, hasApiKey }) => {
  const [settings, setSettings] = useState(StorageService.getSettings());
  const [voices, setVoices] = useState([]);
  const [saved, setSaved] = useState(false);

  // Supabase states
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseService.getCredentials().url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(supabaseService.getCredentials().anonKey);
  const [isSupabaseSaved, setIsSupabaseSaved] = useState(false);

  useEffect(() => {
    const list = speechAudio.getAvailableVoices();
    setVoices(list);
  }, []);

  const handleChange = (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    StorageService.saveSettings(updated);

    if (key === 'preferredVoice') {
      speechAudio.setVoiceByName(value);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    supabaseService.setCredentials(supabaseUrl, supabaseAnonKey);
    setIsSupabaseSaved(true);
    setTimeout(() => setIsSupabaseSaved(false), 2000);
  };

  const handleTestVoice = () => {
    speechAudio.speak("Hey there! This is what spoken English sounds like with your current settings.", {
      rate: settings.voiceSpeed,
      pitch: settings.voicePitch
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-5 animate-fadeIn">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Configurações & Banco de Dados</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ajuste voz, Gemini Flash e banco de dados Supabase.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5" /> Salvo!
          </span>
        )}
      </div>

      {/* Gemini Flash API Key Box */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Google Gemini Flash</h3>
              <p className="text-xs text-slate-400">
                {hasApiKey ? 'Chave de API ativa' : 'Configure sua chave gratuita'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApiKey}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            {hasApiKey ? 'Alterar Chave' : 'Adicionar Chave'}
          </button>
        </div>
      </div>

      {/* Supabase Cloud Database Box */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>Banco de Dados Supabase</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  supabaseService.isConfigured() ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {supabaseService.isConfigured() ? 'Conectado na Nuvem' : 'Modo Offline/Local'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sincronize histórico, vocabulário e progresso entre Celular e PC
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSupabase} className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project URL do Supabase:
            </label>
            <input
              type="text"
              placeholder="https://seu-projeto.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Anon / Public API Key:
            </label>
            <input
              type="password"
              placeholder="Cole sua chave anon/public aqui"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Criar projeto grátis no Supabase</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              {isSupabaseSaved ? <CheckCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isSupabaseSaved ? 'Salvo no Supabase!' : 'Salvar Conexão'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Voice & Audio Controls */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-indigo-400" />
          <span>Configurações de Voz & Áudio</span>
        </h3>

        {/* Speed Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Velocidade da Fala:</span>
            <span className="font-mono text-indigo-400 font-bold">{settings.voiceSpeed}x</span>
          </div>
          <input
            type="range"
            min="0.6"
            max="1.2"
            step="0.05"
            value={settings.voiceSpeed}
            onChange={(e) => handleChange('voiceSpeed', parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Auto-play Audio Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            <p className="text-xs font-semibold text-white">Reprodução Automática de Áudio</p>
            <p className="text-[11px] text-slate-400">Tocar voz da IA automaticamente nas respostas</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoPlayAudio}
            onChange={(e) => handleChange('autoPlayAudio', e.target.checked)}
            className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
          />
        </div>

        {/* Test voice button */}
        <div className="pt-2">
          <button
            onClick={handleTestVoice}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Testar Voz Agora</span>
          </button>
        </div>
      </div>

    </div>
  );
};
