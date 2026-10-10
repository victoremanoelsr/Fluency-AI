import { StorageService } from './storage';

// As 4 Vozes da lista da sua conta ElevenLabs que funcionam 100% (Status 200 confirmado)
export const ELEVENLABS_TUTORS = [
  {
    id: 'will',
    name: 'Will',
    origin: 'Chicago, EUA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    voiceId: 'bIHbv24MWmeRgasZH58o', // Will - Relaxed Optimist (da sua tela)
    style: 'Descontraído, casual e gírias',
    description: 'Voz natural e otimista da sua lista. Excelente para falar do dia a dia, esportes e gírias.'
  },
  {
    id: 'sarah',
    name: 'Sarah',
    origin: 'Califórnia, EUA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - Mature, Reassuring, Confident (da sua tela)
    style: 'Jovem, confiante e acolhedora',
    description: 'Voz suave e expressiva da sua lista. Didática limpa para conversas diárias sem medo.'
  },
  {
    id: 'bella',
    name: 'Bella',
    origin: 'Nova York, EUA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    voiceId: 'hpp4J3VqNfWAUOO0d1Us', // Bella - Professional, Bright, Warm (da sua tela)
    style: 'Brilhante, moderna e dinâmica',
    description: 'Voz moderna e radiante da sua lista, perfeita para quem busca ritmo rápido de conversação.'
  },
  {
    id: 'roger',
    name: 'Roger',
    origin: 'Austin, Texas, EUA',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    voiceId: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - Laid-Back, Casual, Resonant (da sua tela)
    style: 'Calmo, voz grave e ressonante',
    description: 'Tom grave e acolhedor da sua lista. Dicção limpa para treinar sons difíceis com tranquilidade.'
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
