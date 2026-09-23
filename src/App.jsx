import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { LearningRoadmap } from './components/Dashboard/LearningRoadmap';
import { LiveTutorCard } from './components/Dashboard/LiveTutorCard';
import { ProgressView } from './components/Dashboard/ProgressView';
import { SettingsView } from './components/Settings/SettingsView';
import { ConversationRoom } from './components/Conversation/ConversationRoom';
import { TutorSelectModal } from './components/Common/TutorSelectModal';
import { UserProfileModal } from './components/Settings/UserProfileModal';
import { TUTORS, DEFAULT_TUTOR } from './data/tutors';
import { ROADMAP_LEVELS, ALL_LESSONS } from './data/lessons';
import { StorageService } from './services/storage';

export function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'progresso' | 'settings'
  const [selectedTutor, setSelectedTutor] = useState(DEFAULT_TUTOR);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(['say-hello']);
  const [userProfile, setUserProfile] = useState(StorageService.getUserProfile());
  const [streakInfo, setStreakInfo] = useState(StorageService.getStreakInfo());

  // Modals
  const [isTutorModalOpen, setIsTutorModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    // Load saved tutor
    const savedTutorId = StorageService.getSelectedTutorId();
    const foundTutor = TUTORS.find(t => t.id === savedTutorId);
    if (foundTutor) setSelectedTutor(foundTutor);

    // Load completed lessons
    setCompletedLessons(StorageService.getCompletedLessons());
    setUserProfile(StorageService.getUserProfile());
    setStreakInfo(StorageService.getStreakInfo());
  }, []);

  const handleSelectTutor = (tutor) => {
    setSelectedTutor(tutor);
    StorageService.setSelectedTutorId(tutor.id);
  };

  const handleStartLesson = (lesson) => {
    setActiveLesson(lesson);
  };

  const handleStartActiveCall = () => {
    // Start currently unlocked lesson (e.g. 'how-are-you' or first incomplete)
    const currentLesson = ALL_LESSONS.find(l => !completedLessons.includes(l.id)) || ALL_LESSONS[1];
    setActiveLesson(currentLesson);
  };

  const handleCompleteSession = () => {
    if (activeLesson) {
      const updated = StorageService.completeLesson(activeLesson.id);
      setCompletedLessons(updated);
      setStreakInfo(StorageService.getStreakInfo());

      // Move to next lesson
      const currentIndex = ALL_LESSONS.findIndex(l => l.id === activeLesson.id);
      const nextLesson = ALL_LESSONS[currentIndex + 1];
      if (nextLesson) {
        setActiveLesson(nextLesson);
      } else {
        setActiveLesson(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Full Classroom Call View if a lesson is active */}
      {activeLesson ? (
        <ConversationRoom
          lesson={activeLesson}
          tutor={selectedTutor}
          onBack={() => {
            setActiveLesson(null);
            setCompletedLessons(StorageService.getCompletedLessons());
            setStreakInfo(StorageService.getStreakInfo());
          }}
          onCompleteSession={handleCompleteSession}
        />
      ) : (
        /* Main 3-Column Learna AI App Shell */
        <div className="flex flex-col lg:flex-row min-h-screen w-full">
          
          {/* Column 1: Sidebar (20%) */}
          <Sidebar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            profile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenSettings={() => setActiveTab('settings')}
            onOpenUpgrade={() => alert('Parabéns! Sua conta PRO com 60% de desconto está ativa nesta demonstração.')}
          />

          {/* Main Area: Column 2 (50%) + Column 3 (30%) when on Home */}
          <main className="flex-1 flex flex-col overflow-x-hidden">
            
            {activeTab === 'home' && (
              <div className="flex-1 flex flex-col lg:flex-row">
                
                {/* Column 2: Central Roadmap (50%) */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50 py-4">
                  {/* Top Bar on Central Column */}
                  <div className="px-8 py-3 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-2 font-black text-slate-800 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      <span>Trilha de Conversação Ativa</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                      <span>Fluency AI Studio</span>
                    </div>
                  </div>

                  <LearningRoadmap
                    completedLessons={completedLessons}
                    onStartLesson={handleStartLesson}
                    streakInfo={streakInfo}
                  />
                </div>

                {/* Column 3: Live Tutor Card & Video (30%) */}
                <LiveTutorCard
                  tutor={selectedTutor}
                  onOpenTutorModal={() => setIsTutorModalOpen(true)}
                  onStartCall={handleStartActiveCall}
                  activeLesson={ALL_LESSONS.find(l => !completedLessons.includes(l.id)) || ALL_LESSONS[1]}
                />

              </div>
            )}

            {/* Progresso View */}
            {activeTab === 'progresso' && (
              <ProgressView 
                onSelectCallHistory={(call) => {
                  const lesson = ALL_LESSONS.find(l => l.id === call.lessonId) || ALL_LESSONS[0];
                  setActiveLesson(lesson);
                }}
              />
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
              <SettingsView 
                onBack={() => setActiveTab('home')}
              />
            )}

          </main>

        </div>
      )}

      {/* Tutor Selection Modal */}
      <TutorSelectModal
        isOpen={isTutorModalOpen}
        currentTutor={selectedTutor}
        onSelectTutor={handleSelectTutor}
        onClose={() => setIsTutorModalOpen(false)}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        profile={userProfile}
        onUpdateProfile={(p) => setUserProfile(p)}
        onClose={() => setIsProfileModalOpen(false)}
      />

    </div>
  );
}

export default App;
