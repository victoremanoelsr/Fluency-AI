import { createClient } from '@supabase/supabase-js';

const SUPABASE_STORAGE_KEYS = {
  URL: 'learna_supabase_url',
  ANON_KEY: 'learna_supabase_anon_key',
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    const url = localStorage.getItem(SUPABASE_STORAGE_KEYS.URL) || import.meta.env.VITE_SUPABASE_URL || '';
    const key = localStorage.getItem(SUPABASE_STORAGE_KEYS.ANON_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

    if (url && key) {
      try {
        this.client = createClient(url, key);
      } catch (err) {
        console.error('Error creating Supabase client:', err);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  getCredentials() {
    return {
      url: localStorage.getItem(SUPABASE_STORAGE_KEYS.URL) || '',
      anonKey: localStorage.getItem(SUPABASE_STORAGE_KEYS.ANON_KEY) || '',
    };
  }

  setCredentials(url, anonKey) {
    if (url && anonKey) {
      localStorage.setItem(SUPABASE_STORAGE_KEYS.URL, url.trim());
      localStorage.setItem(SUPABASE_STORAGE_KEYS.ANON_KEY, anonKey.trim());
      this.initClient();
    } else {
      localStorage.removeItem(SUPABASE_STORAGE_KEYS.URL);
      localStorage.removeItem(SUPABASE_STORAGE_KEYS.ANON_KEY);
      this.client = null;
    }
  }

  isConfigured() {
    return !!this.client;
  }

  // --- Vocabulary Sync ---
  async fetchVocabulary() {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('learna_vocabulary')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase fetchVocabulary error:', err);
      return null;
    }
  }

  async saveVocabularyItem(item) {
    if (!this.client) return;
    try {
      await this.client.from('learna_vocabulary').upsert({
        id: item.id,
        phrase: item.phrase,
        meaning: item.meaning,
        native_form: item.nativeForm || '',
        example: item.example || '',
        category: item.category || 'General',
        mastered: !!item.mastered,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveVocabularyItem error:', err);
    }
  }

  async deleteVocabularyItem(id) {
    if (!this.client) return;
    try {
      await this.client.from('learna_vocabulary').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteVocabularyItem error:', err);
    }
  }

  // --- Conversations & AI Memory ---
  async saveMessage(scenarioId, message) {
    if (!this.client) return;
    try {
      await this.client.from('learna_messages').insert({
        scenario_id: scenarioId,
        sender: message.sender,
        text: message.text,
        text_pt: message.textPt || null,
        correction: message.userCorrection || null,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase saveMessage error:', err);
    }
  }

  async fetchMessages(scenarioId) {
    if (!this.client) return null;
    try {
      const { data, error } = await this.client
        .from('learna_messages')
        .select('*')
        .eq('scenario_id', scenarioId)
        .order('created_at', { ascending: true })
        .limit(30);

      if (error) throw error;
      return data.map(m => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        textPt: m.text_pt,
        userCorrection: m.correction,
        timestamp: new Date(m.created_at)
      }));
    } catch (err) {
      console.warn('Supabase fetchMessages error:', err);
      return null;
    }
  }

  // --- User Progress & Streak Sync ---
  async syncProgress(streakData) {
    if (!this.client) return;
    try {
      await this.client.from('learna_user_stats').upsert({
        id: 'current_user',
        current_streak: streakData.currentStreak,
        total_minutes: streakData.totalMinutes,
        phrases_spoken: streakData.phrasesSpoken,
        last_active: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase syncProgress error:', err);
    }
  }
}

export const supabaseService = new SupabaseService();
