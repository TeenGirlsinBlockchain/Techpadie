/**
 * Web Speech API TTS wrapper.
 * Used as fallback when no pre-recorded audioUrl exists for a lesson.
 * When backend delivers real audio files, components check audioUrl first
 * and only fall back to TTS if absent.
 */

export interface TTSOptions {
  text: string;
  lang?: string;        // BCP-47 e.g. 'en-US', 'fr-FR'
  rate?: number;        // 0.1–10, default 1
  pitch?: number;       // 0–2, default 1
  onStart?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onBoundary?: (charIndex: number, charLength: number) => void;
  onError?: (error: string) => void;
}

class TTSEngine {
  private synth: SpeechSynthesis | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private _isSupported = false;
  private _isSpeaking = false;
  private _isPaused = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this._isSupported = true;
    }
  }

  get isSupported(): boolean {
    return this._isSupported;
  }

  get isSpeaking(): boolean {
    return this._isSpeaking;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  /**
   * Strip HTML tags and decode entities for TTS input.
   */
  static cleanHTML(html: string): string {
    if (typeof document === 'undefined') return html.replace(/<[^>]*>/g, '');
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * Get available voices filtered by language.
   */
  getVoices(lang?: string): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    if (!lang) return voices;
    return voices.filter((v) => v.lang.startsWith(lang.split('-')[0]));
  }

  /**
   * Speak text with the given options.
   */
  speak(options: TTSOptions): void {
    if (!this.synth || !this._isSupported) {
      options.onError?.('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(options.text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;

    // Try to pick a good voice for the language
    const voices = this.getVoices(utterance.lang);
    if (voices.length > 0) {
      // Prefer non-default, natural-sounding voices
      const preferred = voices.find((v) => !v.localService) || voices[0];
      utterance.voice = preferred;
    }

    utterance.onstart = () => {
      this._isSpeaking = true;
      this._isPaused = false;
      options.onStart?.();
    };

    utterance.onend = () => {
      this._isSpeaking = false;
      this._isPaused = false;
      options.onEnd?.();
    };

    utterance.onpause = () => {
      this._isPaused = true;
      options.onPause?.();
    };

    utterance.onresume = () => {
      this._isPaused = false;
      options.onResume?.();
    };

    utterance.onerror = (e) => {
      this._isSpeaking = false;
      this._isPaused = false;
      options.onError?.(e.error);
    };

    // Word boundary events (for transcript highlighting)
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        options.onBoundary?.(e.charIndex, e.charLength || 0);
      }
    };

    this.utterance = utterance;
    this.synth.speak(utterance);
  }

  pause(): void {
    this.synth?.pause();
  }

  resume(): void {
    this.synth?.resume();
  }

  stop(): void {
    this.synth?.cancel();
    this._isSpeaking = false;
    this._isPaused = false;
    this.utterance = null;
  }

  setRate(rate: number): void {
    // Rate can only be set on next speak() call.
    // Store it for the next utterance.
    if (this.utterance) {
      this.utterance.rate = rate;
    }
  }
}

// Singleton
let instance: TTSEngine | null = null;

export function getTTSEngine(): TTSEngine {
  if (!instance) {
    instance = new TTSEngine();
  }
  return instance;
}

export default TTSEngine;
