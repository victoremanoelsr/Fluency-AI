import { supabaseService } from './supabase';

const STORAGE_KEYS = {
  API_KEY: 'learna_gemini_api_key',
  OPENAI_KEY: 'learna_openai_api_key',
  SETTINGS: 'learna_settings',
  VOCABULARY: 'learna_vocabulary_bank',
  STREAK: 'learna_user_streak',
  CONVERSATIONS: 'learna_conversation_history',
  SAVED_PROGRESS: 'learna_lesson_progress',
  SELECTED_TUTOR: 'learna_selected_tutor_id',
  USER_PROFILE: 'learna_user_profile',
  CALL_HISTORY: 'learna_call_history',
  COMPLETED_LESSONS: 'learna_completed_lessons_list'
};

export const defaultSettings = {
  aiProvider: 'openai', // 'openai' | 'gemini' | 'simulated'
  geminiModel: 'gemini-1.5-flash',
  openaiModel: 'gpt-4o',
  voiceSpeed: 0.95,
  voicePitch: 1.0,
  autoPlayAudio: true,
  showPhoneticHints: true,
  studyInNativeLanguage: true
};

export const defaultProfile = {
  name: 'victor',
  email: 'victor.esr6@gmail.com',
  studyLanguage: 'Inglês',
  studyLanguageCode: 'GB',
  nativeLanguage: 'Português (Brasil)',
  level: 'Iniciante',
  interests: 'Carreiras',
  goalMinutes: 30,
  studyInNativeLanguage: true
};

export const defaultCallHistory = [
  {
    id: 'call-1',
    lessonId: 'how-are-you',
    title: 'How Are You?',
    date: '14 de setembro de 2026 às 17:50',
    duration: '02:49',
    wordsCount: 3,
    color: '#0d9488'
  },
  {
    id: 'call-2',
    lessonId: 'say-hello',
    title: 'Say Hello',
    date: '20 de maio de 2026 às 23:43',
    duration: '03:12',
    wordsCount: 5,
    color: '#f97316'
  }
];

export const StorageService = {
  // OpenAI & Gemini Keys
  getApiKey: () => {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
  },
  setApiKey: (key) => {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
  },
  getOpenAiKey: () => {
    return localStorage.getItem(STORAGE_KEYS.OPENAI_KEY) || import.meta.env.VITE_OPENAI_API_KEY || '';
  },
  setOpenAiKey: (key) => {
    localStorage.setItem(STORAGE_KEYS.OPENAI_KEY, key.trim());
  },

  // Selected Tutor
  getSelectedTutorId: () => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_TUTOR) || 'learna-x';
  },
  setSelectedTutorId: (id) => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_TUTOR, id);
  },

  // User Profile
  getUserProfile: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? { ...defaultProfile, ...JSON.parse(data) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  },
  saveUserProfile: (profile) => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  // Call History
  getCallHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CALL_HISTORY);
      return data ? JSON.parse(data) : defaultCallHistory;
    } catch {
      return defaultCallHistory;
    }
  },
  addCallHistoryItem: (item) => {
    const history = StorageService.getCallHistory();
    const updated = [item, ...history];
    localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(updated));
    return updated;
  },

  // Completed Lessons
  getCompletedLessons: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      return data ? JSON.parse(data) : ['say-hello'];
    } catch {
      return ['say-hello'];
    }
  },
  completeLesson: (lessonId) => {
    const list = StorageService.getCompletedLessons();
    if (!list.includes(lessonId)) {
      const updated = [...list, lessonId];
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(updated));
      return updated;
    }
    return list;
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
      return data ? JSON.parse(data) : [
        { id: '1', phrase: 'Hello', meaning: 'Olá' },
        { id: '2', phrase: 'Good morning', meaning: 'Bom dia' },
        { id: '3', phrase: 'How are you?', meaning: 'Como você está?' }
      ];
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
        mastered: false,
      };
      const updated = [newItem, ...list];
      localStorage.setItem(STORAGE_KEYS.VOCABULARY, JSON.stringify(updated));
      supabaseService.saveVocabularyItem(newItem);
      return updated;
    }
    return list;
  },

  // Streak & Stats
  getStreakInfo: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (!data) return { currentStreak: 3, lastActiveDate: new Date().toDateString(), totalMinutes: 0.52, phrasesSpoken: 12 };
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        totalMinutes: parsed.totalMinutes || 0.52
      };
    } catch {
      return { currentStreak: 3, lastActiveDate: new Date().toDateString(), totalMinutes: 0.52, phrasesSpoken: 12 };
    }
  },
  updateStreakOnActivity: (durationMinutes = 2, phrasesCount = 1) => {
    const streakInfo = StorageService.getStreakInfo();
    const today = new Date().toDateString();
    
    let currentStreak = streakInfo.currentStreak || 1;
    if (streakInfo.lastActiveDate !== today) {
      currentStreak += 1;
    }
    
    const updated = {
      currentStreak,
      lastActiveDate: today,
      totalMinutes: Number(((streakInfo.totalMinutes || 0) + durationMinutes).toFixed(2)),
      phrasesSpoken: (streakInfo.phrasesSpoken || 0) + phrasesCount,
    };
    
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
    supabaseService.syncProgress(updated);
    return updated;
  }
};
