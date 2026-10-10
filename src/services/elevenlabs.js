import { StorageService } from './storage';

// As 4 Vozes Configuradas com os IDs Oficiais fornecidos pelo Usuário
export const ELEVENLABS_TUTORS = [
  {
    id: 'will',
    name: 'Will',
    origin: 'Chicago, EUA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    voiceId: 'CstacWqMhJQlnfLPxRG4', // Will
    style: 'Deep, Smooth and Affectionate',
    description: 'Voz dinâmica e casual, perfeita para aprender gírias, conexões de palavras e conversação informal.'
  },
  {
    id: 'ana-alice',
    name: 'Ana Alice',
    origin: 'Califórnia, EUA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    voiceId: 'ORgG8rwdAiMYRug8RJwR', // Ana Alice
    style: 'Friendly & Clear',
    description: 'Voz super fluida e amigável. Ótima para praticar o inglês falado do dia a dia e ganhar ritmo.'
  },
  {
    id: 'paulo',
    name: 'Paulo',
    origin: 'Austin, Texas, EUA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    voiceId: 'Qrdut83w0Cr152Yb4Xn3', // Paulo
    style: 'Expressive and Confident',
    description: 'Tom acolhedor e dicção super nítida. Excelente para destravar a fala passo a passo sem pressão.'
  },
  {
    id: 'andrea-lot',
    name: 'Andrea Lot',
    origin: 'Nova York, EUA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    voiceId: 'HOfBIVLhom4mc9WvXfyH', // Andrea Lot
    style: 'Moderna, enérgica e envolvente',
    description: 'Dicção refinada e ritmo nativo empolgante, ideal para quem quer falar rápido sem travar.'
  }
];

class ElevenLabsService {
  constructor() {
    this.audioCache = new Map();
    this.currentAudio = null;
  }

  getApiKey() {
    // 1. Tenta carregar do .env
    const envKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (envKey && envKey.trim().length > 10) return envKey.trim();
    
    // 2. Tenta carregar do StorageService
    const storedKey = StorageService.getElevenLabsKey?.() || localStorage.getItem('fluency_elevenlabs_api_key');
    if (storedKey && storedKey.trim().length > 10) return storedKey.trim();

    return null;
  }

  /**
   * Converte texto em áudio usando ElevenLabs API (eleven_multilingual_v2)
   */
  async generateSpeech(text, voiceId = '21m00Tcm4TlvDq8ikWAM') {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('ElevenLabs API Key não encontrada.');
      return null;
    }

    const cacheKey = `${voiceId}_${text.trim()}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey);
    }

    const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2', // Fala português e inglês nativo com a mesma voz perfeita
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.25,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro na API do ElevenLabs (${response.status}): ${err}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    this.audioCache.set(cacheKey, audioUrl);
    return audioUrl;
  }

  /**
   * Toca o áudio gerado pelo ElevenLabs
   */
  async play(text, voiceId, { onStart, onEnd, onError } = {}) {
    try {
      this.stop();
      if (onStart) onStart();

      const audioUrl = await this.generateSpeech(text, voiceId);
      if (!audioUrl) {
        throw new Error('Falha ao gerar URL de áudio do ElevenLabs');
      }

      const audio = new Audio(audioUrl);
      this.currentAudio = audio;

      audio.onended = () => {
        this.currentAudio = null;
        if (onEnd) onEnd();
      };

      audio.onerror = (e) => {
        this.currentAudio = null;
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      await audio.play();
      return true;
    } catch (err) {
      console.error('Falha ao reproduzir áudio do ElevenLabs:', err);
      if (onError) onError(err);
      if (onEnd) onEnd();
      return false;
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
