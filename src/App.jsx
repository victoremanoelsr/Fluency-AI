import React, { useState, useEffect } from 'react';
import { MobileHomeView } from './components/Dashboard/MobileHomeView';
import { MobileCallRoom } from './components/Conversation/MobileCallRoom';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { TutorSelectModal } from './components/Common/TutorSelectModal';
import { UserProfileModal } from './components/Settings/UserProfileModal';
import { TUTORS, DEFAULT_TUTOR } from './data/tutors';
import { StorageService } from './services/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'simulation' | 'progress' | 'profile'
  const [selectedTutor, setSelectedTutor] = useState(DEFAULT_TUTOR);
  const [activeCallDay, setActiveCallDay] = useState(null);
  const [completedDays, setCompletedDays] = useState([1]);
  const [currentDay, setCurrentDay] = useState(2);
  const [userProfile, setUserProfile] = useState(StorageService.getUserProfile());
  const [streakCount, setStreakCount] = useState(1);
  
  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    // Checar se já completou onboarding
    const isDone = localStorage.getItem('fluency_onboarding_done');
    if (!isDone) {
      setShowOnboarding(true);
    }

    // Carregar tutor salvo
    const savedTutorId = StorageService.getSelectedTutorId();
    const foundTutor = TUTORS.find(t => t.id === savedTutorId);
    if (foundTutor) setSelectedTutor(foundTutor);

    // Carregar progresso
    const savedCompleted = JSON.parse(localStorage.getItem('fluency_completed_days') || '[1]');
    setCompletedDays(savedCompleted);
    const maxCompleted = Math.max(0, ...savedCompleted);
    setCurrentDay(maxCompleted + 1);

    setUserProfile(StorageService.getUserProfile());
    const streak = StorageService.getStreakInfo();
    setStreakCount(streak?.currentStreak || 1);
  }, []);

  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
    StorageService.setSelectedTutorId(tutor.id);
  };

  const handleStartDay = (day) => {
    setActiveCallDay(day);
  };

  const handleStartFreeTalk = () => {
    setActiveCallDay(currentDay);
  };

  const handleCompleteSession = () => {
    if (activeCallDay) {
      const updated = Array.from(new Set([...completedDays, activeCallDay]));
      setCompletedDays(updated);
      localStorage.setItem('fluency_completed_days', JSON.stringify(updated));
      const nextDay = Math.max(...updated) + 1;
      setCurrentDay(nextDay);
      setActiveCallDay(null);
      setStreakCount(prev => prev + 1);
    }
  };

  const handleOnboardingComplete = (newProfile) => {
    setUserProfile(newProfile);
    setShowOnboarding(false);
    const tutorFound = TUTORS.find(t => t.id === newProfile.tutorId);
    if (tutorFound) setSelectedTutor(tutorFound);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. Modal de Onboarding (1ª vez na conta) */}
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}

      {/* 2. Tela de Chamada / Aula Ativa (Idêntica à Imagem 2) */}
      {activeCallDay ? (
        <MobileCallRoom
          tutor={selectedTutor}
          dayNumber={activeCallDay}
          onBack={() => setActiveCallDay(null)}
          onCompleteSession={handleCompleteSession}
        />
      ) : (
        /* 3. Tela Inicial Mobile (Idêntica à Imagem 1) */
        <MobileHomeView
          tutor={selectedTutor}
          completedDays={completedDays}
          currentDay={currentDay}
          onStartDay={handleStartDay}
          onStartFreeTalk={handleStartFreeTalk}
          onOpenTutorSelect={() => setIsTutorModalOpen(true)}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab === 'profile') setIsProfileModalOpen(true);
            if (tab === 'simulation') setIsTutorModalOpen(true);
          }}
          streakCount={streakCount}
        />
      )}

      {/* 4. Modal para Escolher e Ouvir as 4 Vozes do ElevenLabs */}
      <TutorSelectModal
        isOpen={isTutorModalOpen}
        currentTutor={selectedTutor}
        onSelectTutor={handleSelectTutor}
        onClose={() => setIsTutorModalOpen(false)}
      />

      {/* 5. Modal de Perfil e Configurações */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        profile={userProfile}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={(updated) => {
          setUserProfile(updated);
          StorageService.setUserProfile(updated);
        }}
        onResetOnboarding={() => {
          localStorage.removeItem('fluency_onboarding_done');
          setShowOnboarding(true);
          setIsProfileModalOpen(false);
        }}
      />

    </div>
  );
}
