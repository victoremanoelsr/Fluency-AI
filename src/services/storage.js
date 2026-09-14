import { supabaseService } from './supabase';

const STORAGE_KEYS = {
  API_KEY: 'learna_gemini_api_key',
  SETTINGS: 'learna_settings',
  VOCABULARY: 'learna_vocabulary_bank',
  STREAK: 'learna_user_streak',
  CONVERSATIONS: 'learna_conversation_history',
  SAVED_PROGRESS: 'learna_lesson_progress',
};

export const defaultSettings = {
  geminiModel: 'gemini-1.5-flash',
  voiceSpeed: 0.95,
  voicePitch: 1.0,
  preferredVoice: '',
  autoPlayAudio: true,
  showPhoneticHints: true,
  userName: 'User',
  userLevel: 'intermediate',
};

export const StorageService = {
  // API Key
  getApiKey: () => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
  },
  setApiKey: (key) => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  },
  removeApiKey: () => {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  },

  // Settings
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  },
  saveSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Vocabulary Bank
  getVocabulary: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addVocabularyItem: (item) => {
    const list = StorageService.getVocabulary();
    if (!list.some(v => v.phrase.toLowerCase() === item.phrase.toLowerCase())) {
      const newItem = {
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
        phrase: item.phrase,
        meaning: item.meaning,
        nativeForm: item.nativeForm || '',
        example: item.example || '',
        category: item.category || 'General',
        mastered: false,
      };
      const updated = [newItem, ...list];
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));

      // Sync to Supabase
      supabaseService.saveVocabularyItem(newItem);

      return updated;
    }
    return list;
  },
  removeVocabularyItem: (id) => {
    const list = StorageService.getVocabulary().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(list));

    // Sync to Supabase
    supabaseService.deleteVocabularyItem(id);

    return list;
  },
  toggleVocabularyMastered: (id) => {
    let modified = null;
    const list = StorageService.getVocabulary().map(item => {
      if (item.id === id) {
        modified = { ...item, mastered: !item.mastered };
        return modified;
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(list));

    if (modified) {
      supabaseService.saveVocabularyItem(modified);
    }

    return list;
  },

  // Streak & Stats
  getStreakInfo: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (!data) return { currentStreak: 1, lastActiveDate: new Date().toDateString(), totalMinutes: 15, phrasesSpoken: 0 };
      const parsed = JSON.parse(data);
      
      const today = new Date().toDateString();
      const last = new Date(parsed.lastActiveDate).toDateString();
      
      const diffTime = Math.abs(new Date(today) - new Date(last));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let streak = parsed.currentStreak || 1;
      if (diffDays > 1) {
        streak = 1;
      }
      
      return {
        ...parsed,
        currentStreak: streak,
      };
    } catch {
      return { currentStreak: 1, lastActiveDate: new Date().toDateString(), totalMinutes: 15, phrasesSpoken: 0 };
    }
  },
  updateStreakOnActivity: (phrasesCount = 1) => {
    const streakInfo = StorageService.getStreakInfo();
    const today = new Date().toDateString();
    
    let currentStreak = streakInfo.currentStreak;
    if (streakInfo.lastActiveDate !== today) {
      currentStreak += 1;
    }
    
    const updated = {
      currentStreak,
      lastActiveDate: today,
      totalMinutes: (streakInfo.totalMinutes || 0) + 1,
      phrasesSpoken: (streakInfo.phrasesSpoken || 0) + phrasesCount,
    };
    
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));

    // Sync to Supabase
    supabaseService.syncProgress(updated);

    return updated;
  },

  // Lesson Progress
  getLessonProgress: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PROGRESS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  saveLessonProgress: (lessonId, score) => {
    const progress = StorageService.getLessonProgress();
    progress[lessonId] = {
      completedAt: new Date().toISOString(),
      score,
    };
    localStorage.setItem(STORAGE_KEYS.SAVED_PROGRESS, JSON.stringify(progress));
    return progress;
  }
};
