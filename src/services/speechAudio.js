class SpeechAudioService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.selectedVoiceEn = null;
    this.selectedVoicePt = null;
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

    // 1. VOZES NATURAIS EM PORTUGUÊS DO BRASIL (pt-BR)
    const ptVoices = this.voices.filter(v => 
      v.lang === 'pt-BR' || v.lang.startsWith('pt_BR') || v.lang.startsWith('pt-') || v.lang.startsWith('pt')
    );

    const preferredPtNames = [
      'Microsoft Francisca Online (Natural) - Portuguese (Brazil)',
      'Microsoft Antonio Online (Natural) - Portuguese (Brazil)',
      'Francisca', 'Antonio', 'Google português do Brasil', 'Luciana', 'Felipe',
      'Heloisa', 'Daniel', 'Maria', 'Portuguese'
    ];

    let bestVoicePt = null;
    for (const name of preferredPtNames) {
      bestVoicePt = ptVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (bestVoicePt) break;
    }
    if (!bestVoicePt && ptVoices.length > 0) {
      bestVoicePt = ptVoices[0];
    }
    this.selectedVoicePt = bestVoicePt;

    // 2. VOZES NATURAIS EM INGLÊS AMERICANO (en-US)
    const usVoices = this.voices.filter(v => v.lang === 'en-US' || v.lang.startsWith('en_US'));

    const preferredEnNames = [
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Aria Online (Natural)',
      'Jenny', 'Guy', 'Aria', 'Samantha', 'Google US English',
      'Microsoft David', 'Microsoft Zira', 'Alex', 'Victoria'
    ];

    let bestVoiceEn = null;
    for (const name of preferredEnNames) {
      bestVoiceEn = usVoices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (bestVoiceEn) break;
    }
    if (!bestVoiceEn && usVoices.length > 0) {
      bestVoiceEn = usVoices[0];
    } else if (!bestVoiceEn && this.voices.length > 0) {
      bestVoiceEn = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
    }
    this.selectedVoiceEn = bestVoiceEn;

    return this.voices;
  }

  getAvailableVoices() {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  /**
   * Speak plain text in a single language ('pt-BR' or 'en-US')
   */
  speak(text, { lang = 'en-US', rate = 0.95, pitch = 1.0, onStart, onEnd, onError } = {}) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    this.synth.cancel();

    if (!text || text.trim() === '') return;

    // Clean markdown and special symbols for natural speech
    const cleanedText = text
      .replace(/[*_~`#[\]]/g, '')
      .replace(/\(.*?\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // Pick appropriate natural voice
    if (lang.startsWith('pt')) {
      if (this.selectedVoicePt) utterance.voice = this.selectedVoicePt;
      utterance.lang = 'pt-BR';
    } else {
      if (this.selectedVoiceEn) utterance.voice = this.selectedVoiceEn;
      utterance.lang = 'en-US';
    }

    utterance.rate = rate;
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
      if (onError) onError(event);
      if (this.onStateChange) this.onStateChange(false);
    };

    this.synth.speak(utterance);
  }

  /**
   * Speak bilingually: First speaks tutor intro in Portuguese (pt-BR),
   * then pauses smoothly (350ms) and speaks the target phrase in native English (en-US).
   */
  speakBilingual({ introPt, phraseEn, onStart, onEnd } = {}) {
    if (!this.synth) return;

    this.synth.cancel();

    if (!introPt && !phraseEn) return;

    // If only English phrase provided
    if (!introPt && phraseEn) {
      this.speak(phraseEn, { lang: 'en-US', onStart, onEnd });
      return;
    }

    // If only Portuguese intro provided
    if (introPt && !phraseEn) {
      this.speak(introPt, { lang: 'pt-BR', onStart, onEnd });
      return;
    }

    this.isPlaying = true;
    if (onStart) onStart();
    if (this.onStateChange) this.onStateChange(true);

    const cleanPt = introPt.replace(/[*_~`#[\]]/g, '').trim();
    const cleanEn = phraseEn.replace(/[*_~`#[\]]/g, '').trim();

    const ptUtterance = new SpeechSynthesisUtterance(cleanPt);
    if (this.selectedVoicePt) ptUtterance.voice = this.selectedVoicePt;
    ptUtterance.lang = 'pt-BR';
    ptUtterance.rate = 1.0;
    ptUtterance.pitch = 1.0;

    const enUtterance = new SpeechSynthesisUtterance(cleanEn);
    if (this.selectedVoiceEn) enUtterance.voice = this.selectedVoiceEn;
    enUtterance.lang = 'en-US';
    enUtterance.rate = 0.9; // clear, native pronunciation pace
    enUtterance.pitch = 1.0;

    ptUtterance.onend = () => {
      // Pause slightly between Portuguese explanation and English phrase
      setTimeout(() => {
        if (!this.isPlaying) return;
        this.synth.speak(enUtterance);
      }, 350);
    };

    ptUtterance.onerror = () => {
      // Fallback directly to English if error in PT
      if (this.isPlaying) {
        this.synth.speak(enUtterance);
      }
    };

    enUtterance.onend = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
      if (this.onStateChange) this.onStateChange(false);
    };

    enUtterance.onerror = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
      if (this.onStateChange) this.onStateChange(false);
    };

    this.synth.speak(ptUtterance);
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
