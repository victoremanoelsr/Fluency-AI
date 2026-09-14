class SpeechAudioService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoice = null;
    this.isPlaying = false;
    this.onStateChange = null;

    if (this.synth) {
      this.loadVoices();
      if (typeof window !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices();
    
    // Prioritize natural US English voices
    const usVoices = this.voices.filter(v => v.lang === 'en-US' || v.lang.startsWith('en_US'));
    
    // Pick the most natural sounding voice available on the device
    const preferredNames = [
      'Samantha', 'Google US English', 'Microsoft Jenny Online (Natural)',
      'Microsoft David', 'Microsoft Zira', 'Alex', 'Fred', 'Victoria'
    ];
    
    let bestVoice = null;
    for (const name of preferredNames) {
      bestVoice = usVoices.find(v => v.name.includes(name));
      if (bestVoice) break;
    }

    if (!bestVoice && usVoices.length > 0) {
      bestVoice = usVoices[0];
    } else if (!bestVoice && this.voices.length > 0) {
      bestVoice = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }

    this.selectedVoice = bestVoice;
    return this.voices;
  }

  getAvailableVoices() {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices.filter(v => v.lang.startsWith('en'));
  }

  setVoiceByName(voiceName) {
    const found = this.voices.find(v => v.name === voiceName);
    if (found) {
      this.selectedVoice = found;
    }
  }

  speak(text, { rate = 0.95, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    // Cancel ongoing speech
    this.synth.cancel();

    if (!text || text.trim() === '') return;

    // Clean markdown/special chars for smooth speech
    const cleanedText = text
      .replace(/[*_~`#[\]]/g, '')
      .replace(/\(.*?\)/g, '') // remove parenthesized phonetic hints or translations if any
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.lang = 'en-US';
    utterance.rate = rate; // 0.8 for slow learning, 1.0 for real speed
    utterance.pitch = pitch;

    utterance.onstart = () => {
      this.isPlaying = true;
      if (onStart) onStart();
      if (this.onStateChange) this.onStateChange(true);
    };

    utterance.onend = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
      if (this.onStateChange) this.onStateChange(false);
    };

    utterance.onerror = (event) => {
      this.isPlaying = false;
      console.error('Speech synthesis error:', event);
      if (onError) onError(event);
      if (this.onStateChange) this.onStateChange(false);
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }
}

export const speechAudio = new SpeechAudioService();
