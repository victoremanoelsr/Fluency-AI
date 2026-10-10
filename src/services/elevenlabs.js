import { StorageService } from './storage';

// As 4 Vozes Configuradas com os IDs Oficiais da ElevenLabs
export const ELEVENLABS_TUTORS = [
  {
    id: 'will',
    name: 'Will',
    origin: 'Chicago, EUA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    voiceId: 'bIHbv24MWmeRgasZH58o', // Will oficial ElevenLabs (Voz humana ultra-realista)
    libraryVoiceId: 'CstacWqMhJQlnfLPxRG4',
    style: 'Deep, Smooth and Affectionate',
    description: 'Voz dinâmica e casual, perfeita para aprender gírias, conexões de palavras e conversação informal.'
  },
  {
    id: 'ana-alice',
    name: 'Ana Alice',
    origin: 'Califórnia, EUA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Alice oficial ElevenLabs (Voz clara e acolhedora)
    libraryVoiceId: 'ORgG8rwdAiMYRug8RJwR',
    style: 'Friendly & Clear',
    description: 'Voz super fluida e amigável. Ótima para praticar o inglês falado do dia a dia e ganhar ritmo.'
  },
  {
    id: 'paulo',
    name: 'Paulo',
    origin: 'Austin, Texas, EUA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    voiceId: 'TX3LPaxmHKxFdv7VOQHJ', // Liam oficial ElevenLabs (Expressivo e Confiante)
    libraryVoiceId: 'Qrdut83w0Cr152Yb4Xn3',
    style: 'Expressive and Confident',
    description: 'Tom acolhedor e dicção super nítida. Excelente para destravar a fala passo a passo sem pressão.'
  },
  {
    id: 'andrea-lot',
    name: 'Andrea Lot',
    origin: 'Nova York, EUA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    voiceId: 'cgSgspJ2msm6clMCkdW9', // Jessica oficial ElevenLabs (Moderna e Enérgica)
    libraryVoiceId: 'HOfBIVLhom4mc9WvXfyH',
    style: 'Moderna, enérgica e envolvente',
    description: 'Dicção refinada e ritmo nativo empolgante, ideal para quem quer falar rápido sem travar.'
  }
];

export const VOICE_MAP = {
  // Mapeamento dos IDs da Library para os IDs correspondentes com áudio 100% garantido no ElevenLabs
  'CstacWqMhJQlnfLPxRG4': 'bIHbv24MWmeRgasZH58o', // Will
  'ORgG8rwdAiMYRug8RJwR': 'Xb7hH8MSUJpSbSDYk0k2', // Ana Alice -> Alice
  'Qrdut83w0Cr152Yb4Xn3': 'TX3LPaxmHKxFdv7VOQHJ', // Paulo -> Liam
  'HOfBIVLhom4mc9WvXfyH': 'cgSgspJ2msm6clMCkdW9', // Andrea Lot -> Jessica
  'will': 'bIHbv24MWmeRgasZH58o',
  'ana-alice': 'Xb7hH8MSUJpSbSDYk0k2',
  'paulo': 'TX3LPaxmHKxFdv7VOQHJ',
  'andrea-lot': 'cgSgspJ2msm6clMCkdW9',
  'alice': 'Xb7hH8MSUJpSbSDYk0k2',
  'jessica': 'cgSgspJ2msm6clMCkdW9',
  'liam': 'TX3LPaxmHKxFdv7VOQHJ'
};

class ElevenLabsService {
  constructor() {
    this.audioCache = new Map();
    this.currentAudio = null;
  }

  getApiKey() {
    // 1. Tenta carregar do StorageService ou localStorage
    try {
      const storedKey = StorageService?.getElevenLabsKey?.() || (typeof localStorage !== 'undefined' ? localStorage.getItem('fluency_elevenlabs_api_key') : null);
      if (storedKey && storedKey.trim().length > 10) return storedKey.trim();
    } catch {
      // Ignora erro de acesso a localStorage
    }

    // 2. Tenta carregar do .env do Vite
    try {
      const envKey = import.meta.env?.VITE_ELEVENLABS_API_KEY;
      if (envKey && envKey.trim().length > 10) return envKey.trim();
    } catch {
      // Ignora erro de acesso a import.meta.env
    }

    // 3. Chave ativa configurada fornecida pelo usuário
    return 'sk_b602f5af05b4835207a1ee13227f8a1dc01143f0ca4f80c7';
  }

  async fetchElevenLabsAudio(text, voiceId, apiKey) {
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
        model_id: 'eleven_multilingual_v2', // Fala português e inglês nativo com riqueza e entonação humana
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
    return URL.createObjectURL(audioBlob);
  }

  /**
   * Converte texto em áudio usando ElevenLabs API (eleven_multilingual_v2)
   */
  async generateSpeech(text, voiceId = 'bIHbv24MWmeRgasZH58o') {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      console.warn('ElevenLabs API Key não encontrada.');
      return null;
    }

    const cleanText = text.replace(/[*_~`#[\]]/g, '').trim();
    if (!cleanText) return null;

    const targetVoiceId = VOICE_MAP[voiceId] || voiceId || 'bIHbv24MWmeRgasZH58o';

    const cacheKey = `${targetVoiceId}_${cleanText}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey);
    }

    try {
      const audioUrl = await this.fetchElevenLabsAudio(cleanText, targetVoiceId, apiKey);
      this.audioCache.set(cacheKey, audioUrl);
      return audioUrl;
    } catch (err) {
      console.warn(`Erro na voz ${targetVoiceId}, tentando voz de fallback oficial do Will:`, err);
      if (targetVoiceId !== 'bIHbv24MWmeRgasZH58o') {
        try {
          const fallbackUrl = await this.fetchElevenLabsAudio(cleanText, 'bIHbv24MWmeRgasZH58o', apiKey);
          this.audioCache.set(cacheKey, fallbackUrl);
          return fallbackUrl;
        } catch (fallbackErr) {
          console.error('Falha crítica ElevenLabs:', fallbackErr);
          throw fallbackErr;
        }
      }
      throw err;
    }
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

      return new Promise((resolve) => {
        audio.onended = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
          resolve(true);
        };

        audio.onerror = (e) => {
          console.error('Erro ao reproduzir elemento de áudio:', e);
          this.currentAudio = null;
          if (onError) onError(e);
          if (onEnd) onEnd();
          resolve(false);
        };

        audio.play().catch((playErr) => {
          console.error('Erro audio.play():', playErr);
          this.currentAudio = null;
          if (onError) onError(playErr);
          if (onEnd) onEnd();
          resolve(false);
        });
      });
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
