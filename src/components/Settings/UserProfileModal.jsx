import React, { useState } from 'react';
import { 
  X, 
  Edit3, 
  ChevronRight, 
  Target, 
  BarChart3, 
  Smile, 
  Compass, 
  Flag 
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const UserProfileModal = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile
}) => {
  const [currentProfile, setCurrentProfile] = useState(profile);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.name || 'victor');

  if (!isOpen) return null;

  const handleToggleNative = () => {
    const updated = {
      ...currentProfile,
      studyInNativeLanguage: !currentProfile.studyInNativeLanguage
    };
    setCurrentProfile(updated);
    StorageService.saveUserProfile(updated);
    onUpdateProfile(updated);
  };

  const handleSaveName = () => {
    const updated = {
      ...currentProfile,
      name: nameInput.trim() || 'victor'
    };
    setCurrentProfile(updated);
    setIsEditingName(false);
    StorageService.saveUserProfile(updated);
    onUpdateProfile(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 my-6 animate-fadeIn space-y-6">
        
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800">Perfil do Usuário</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2 py-1 border border-sky-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none"
                    autoFocus
                  />
                  <button 
                    onClick={handleSaveName}
                    className="px-2.5 py-1 bg-sky-500 text-white rounded-lg text-xs font-bold"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-800 text-base">{currentProfile.name}</h4>
                  <button 
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-sky-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{currentProfile.email}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 font-black text-lg flex items-center justify-center">
            {currentProfile.name?.charAt(0).toUpperCase() || 'V'}
          </div>
        </div>

        {/* Study in Native Language Switch */}
        <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-xs">
          <span className="text-xs font-bold text-slate-700">Estudar no idioma nativo</span>
          <button
            onClick={handleToggleNative}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              currentProfile.studyInNativeLanguage ? 'bg-sky-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                currentProfile.studyInNativeLanguage ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Preferences List Items */}
        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs">
          
          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-base">🎯</span>
              <span className="text-xs font-bold text-slate-700">Idioma de Estudo</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>{currentProfile.studyLanguage}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-base">📊</span>
              <span className="text-xs font-bold text-slate-700">Nível de Atividade</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>{currentProfile.level}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-base">🧒</span>
              <span className="text-xs font-bold text-slate-700">Idioma nativo</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>{currentProfile.nativeLanguage}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-base">🧗</span>
              <span className="text-xs font-bold text-slate-700">Interesses</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>{currentProfile.interests}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-base">⛳</span>
              <span className="text-xs font-bold text-slate-700">Objetivos</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <span>{currentProfile.goalMinutes} min / dia</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
