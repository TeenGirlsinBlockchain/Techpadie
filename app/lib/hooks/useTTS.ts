'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TTSState } from '@/app/types';

const INITIAL_STATE: TTSState = {
  isSupported: false,
  isSpeaking: false,
  isPaused: false,
  rate: 1,
  voice: null,
  availableVoices: [],
};

export function useTTS() {
  const [state, setState] = useState<TTSState>(INITIAL_STATE);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textRef = useRef<string>('');

  // Initialize voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    setState((s: any) => ({ ...s, isSupported: true }));

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Prefer English voices, fallback to first available
        const englishVoice = voices.find(
          (v) => v.lang.startsWith('en') && v.localService
        ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

        setState((s: { voice: any; }) => ({
          ...s,
          availableVoices: voices,
          voice: s.voice || englishVoice,
        }));
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Strip HTML tags from content for TTS
  const stripHTML = useCallback((html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!state.isSupported) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const cleanText = stripHTML(text);
      textRef.current = cleanText;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = state.rate;
      if (state.voice) utterance.voice = state.voice;

      utterance.onstart = () => {
        setState((s: any) => ({ ...s, isSpeaking: true, isPaused: false }));
      };
      utterance.onend = () => {
        setState((s: any) => ({ ...s, isSpeaking: false, isPaused: false }));
      };
      utterance.onerror = () => {
        setState((s: any) => ({ ...s, isSpeaking: false, isPaused: false }));
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [state.isSupported, state.rate, state.voice, stripHTML]
  );

  const pause = useCallback(() => {
    if (!state.isSupported) return;
    window.speechSynthesis.pause();
    setState((s: any) => ({ ...s, isPaused: true }));
  }, [state.isSupported]);

  const resume = useCallback(() => {
    if (!state.isSupported) return;
    window.speechSynthesis.resume();
    setState((s: any) => ({ ...s, isPaused: false }));
  }, [state.isSupported]);

  const stop = useCallback(() => {
    if (!state.isSupported) return;
    window.speechSynthesis.cancel();
    setState((s: any) => ({ ...s, isSpeaking: false, isPaused: false }));
  }, [state.isSupported]);

  const setRate = useCallback((rate: number) => {
    setState((s: any) => ({ ...s, rate }));
    // If currently speaking, restart with new rate
    if (state.isSpeaking && textRef.current) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textRef.current);
      utterance.rate = rate;
      if (state.voice) utterance.voice = state.voice;
      utterance.onstart = () => setState((s: any) => ({ ...s, isSpeaking: true, isPaused: false }));
      utterance.onend = () => setState((s: any) => ({ ...s, isSpeaking: false, isPaused: false }));
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }, [state.isSpeaking, state.voice]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setState((s: any) => ({ ...s, voice }));
  }, []);

  return {
    ...state,
    speak,
    pause,
    resume,
    stop,
    setRate,
    setVoice,
    togglePlayPause: useCallback(() => {
      if (state.isPaused) resume();
      else if (state.isSpeaking) pause();
    }, [state.isPaused, state.isSpeaking, pause, resume]),
  };
}
