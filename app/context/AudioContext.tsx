'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import type { AudioPlayerState, AudioAction, AudioTrack } from '@/app/types';

// ─── Initial State ───────────────────────────────────────────────
const INITIAL_STATE: AudioPlayerState = {
  isPlaying: false,
  isVisible: false,
  isMinimized: false,
  currentLessonId: null,
  currentCourseId: null,
  currentTime: 0,
  duration: 0,
  playbackSpeed: 1,
  audioUrl: null,
  lessonTitle: '',
  courseTitle: '',
};

// ─── Reducer ─────────────────────────────────────────────────────
function audioReducer(state: AudioPlayerState, action: AudioAction): AudioPlayerState {
  switch (action.type) {
    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
        isVisible: true,
        isMinimized: false,
        currentLessonId: action.payload.lessonId,
        currentCourseId: action.payload.courseId,
        audioUrl: action.payload.audioUrl,
        lessonTitle: action.payload.lessonTitle,
        courseTitle: action.payload.courseTitle,
        currentTime: action.payload.startTime || 0,
      };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESUME':
      return { ...state, isPlaying: true };
    case 'STOP':
      return { ...INITIAL_STATE };
    case 'SEEK':
      return { ...state, currentTime: action.payload };
    case 'SET_SPEED':
      return { ...state, playbackSpeed: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'MINIMIZE':
      return { ...state, isMinimized: true };
    case 'MAXIMIZE':
      return { ...state, isMinimized: false };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────
interface AudioContextValue {
  state: AudioPlayerState;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: (track: AudioTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setSpeed: (speed: number) => void;
  toggleMinimize: () => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(audioReducer, INITIAL_STATE);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((track: AudioTrack) => {
    dispatch({ type: 'PLAY', payload: track });
    // Audio element will be controlled by the AudioPlayer component
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
    audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' });
    audioRef.current?.play();
  }, []);

  const stop = useCallback(() => {
    dispatch({ type: 'STOP' });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const seek = useCallback((time: number) => {
    dispatch({ type: 'SEEK', payload: time });
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: 'SET_SPEED', payload: speed });
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, []);

  const toggleMinimize = useCallback(() => {
    dispatch({ type: state.isMinimized ? 'MAXIMIZE' : 'MINIMIZE' });
  }, [state.isMinimized]);

  return (
    <AudioContext.Provider
      value={{ state, audioRef, play, pause, resume, stop, seek, setSpeed, toggleMinimize }}
    >
      {children}
      {/* Hidden audio element — controlled by context */}
      <audio ref={audioRef} preload="metadata" />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}