import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Layout/Navbar';
import { BottomBar } from './components/Layout/BottomBar';
import { HomeDashboard } from './components/Dashboard/HomeDashboard';
import { ScenariosView } from './components/Conversation/ScenariosView';
import { ConversationRoom } from './components/Conversation/ConversationRoom';
import { ShadowingStudio } from './components/Practice/ShadowingStudio';
import { SlangExplorer } from './components/Slang/SlangExplorer';
import { VocabularyBank } from './components/Vocabulary/VocabularyBank';
import { SettingsView } from './components/Settings/SettingsView';
import { ApiKeyModal } from './components/Common/ApiKeyModal';
import { StorageService } from './services/storage';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeScenario, setActiveScenario] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [streakInfo, setStreakInfo] = useState(StorageService.getStreakInfo());

  useEffect(() => {
    checkApiKey();
    setStreakInfo(StorageService.getStreakInfo());
  }, []);

  const checkApiKey = () => {
    const key = StorageService.getApiKey();
    setHasApiKey(!!key);
  };

  const handleStartScenario = (scenario) => {
    setActiveScenario(scenario);
  };

  const handleBackFromScenario = () => {
    setActiveScenario(null);
    setStreakInfo(StorageService.getStreakInfo());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        streakInfo={streakInfo}
        hasApiKey={hasApiKey}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        onOpenSettings={() => {
          setActiveScenario(null);
          setActiveTab('settings');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        {activeScenario ? (
          <ConversationRoom
            scenario={activeScenario}
            onBack={handleBackFromScenario}
            onOpenApiKey={() => setIsApiKeyModalOpen(true)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeDashboard
                streakInfo={streakInfo}
                onStartScenario={handleStartScenario}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenApiKey={() => setIsApiKeyModalOpen(true)}
                hasApiKey={hasApiKey}
              />
            )}

            {activeTab === 'scenarios' && (
              <ScenariosView
                onSelectScenario={handleStartScenario}
              />
            )}

            {activeTab === 'shadowing' && (
              <ShadowingStudio />
            )}

            {activeTab === 'slang' && (
              <SlangExplorer />
            )}

            {activeTab === 'vocab' && (
              <VocabularyBank />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                hasApiKey={hasApiKey}
                onOpenApiKey={() => setIsApiKeyModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Bar (hidden while in full conversation room for maximum screen space) */}
      {!activeScenario && (
        <BottomBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveScenario(null);
            setActiveTab(tab);
          }}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={checkApiKey}
      />

    </div>
  );
}

export default App;
