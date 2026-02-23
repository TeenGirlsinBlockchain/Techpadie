'use client';

import React, { useState, useCallback } from 'react';
import type { QuizQuestion } from '@/app/types';
import { useGamification } from '@/app/context/GamificationContext';
import { XP_REWARDS } from '@/app/lib/constants';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  TrophyIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';

interface QuizPanelProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onComplete?: (score: number) => void;
}

type QuizState = 'answering' | 'checked' | 'finished';

export default function QuizPanel({ questions, lessonTitle, onComplete }: QuizPanelProps) {
  const { addXP } = useGamification();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('answering');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const question = questions[currentIndex];
  const total = questions.length;
  const isCorrect = selectedId ? question?.options.find((o) => o.id === selectedId)?.isCorrect : false;

  const handleSelect = useCallback((optionId: string) => {
    if (quizState !== 'answering') return;
    setSelectedId(optionId);
  }, [quizState]);

  const handleCheck = useCallback(() => {
    if (!selectedId || !question) return;
    const correct = question.options.find((o) => o.id === selectedId)?.isCorrect || false;
    setAnswers((prev) => ({ ...prev, [question.id]: correct }));
    if (correct) setScore((s) => s + 1);
    setQuizState('checked');
  }, [selectedId, question]);

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
      setQuizState('answering');
    } else {
      // Quiz finished
      const finalScore = Math.round(((score + (isCorrect ? 0 : 0)) / total) * 100);
      setQuizState('finished');

      // Award XP
      if (finalScore >= 70) {
        addXP(finalScore === 100 ? XP_REWARDS.quizPerfect : XP_REWARDS.quizPassed);
      }
      onComplete?.(finalScore);
    }
  }, [currentIndex, total, score, isCorrect, addXP, onComplete]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedId(null);
    setQuizState('answering');
    setScore(0);
    setAnswers({});
  }, []);

  if (questions.length === 0) {
    return (
      <div className="animate-fade-in bg-chalk-surface border border-chalk-border rounded-2xl p-8 text-center">
        <p className="font-chalk text-xl text-chalk-white-dim">No quiz available for this lesson yet.</p>
      </div>
    );
  }

  // ─── Finished Screen ───────────────────────────────────────
  if (quizState === 'finished') {
    const finalPercent = Math.round((score / total) * 100);
    const passed = finalPercent >= 70;

    return (
      <div className="animate-fade-in bg-chalk-surface border border-chalk-border rounded-2xl p-6 sm:p-8 text-center">
        <div className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
          passed ? 'bg-chalk-green/20' : 'bg-chalk-red/20'
        }`}>
          {passed ? (
            <TrophyIcon className="h-8 w-8 text-chalk-yellow" />
          ) : (
            <XCircleIcon className="h-8 w-8 text-chalk-red" />
          )}
        </div>

        <h3 className="font-chalk text-2xl text-chalk-white mb-1">
          {passed ? 'Well done!' : 'Keep studying!'}
        </h3>
        <p className="text-chalk-white-dim text-sm mb-6" style={{ fontFamily: 'var(--font-chalk-body)' }}>
          You scored {score}/{total} ({finalPercent}%) on &ldquo;{lessonTitle}&rdquo;
        </p>

        {passed && (
          <div className="inline-flex items-center gap-2 bg-gamification-xp/10 text-gamification-xp px-4 py-2 rounded-xl text-sm font-bold mb-6">
            <BoltIcon className="h-4 w-4" />
            +{finalPercent === 100 ? XP_REWARDS.quizPerfect : XP_REWARDS.quizPassed} XP earned!
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-chalk-border text-chalk-white-dim hover:text-chalk-white hover:bg-chalk-surface-hover transition-all"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Question Screen ───────────────────────────────────────
  return (
    <div className="animate-fade-in space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-chalk-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + (quizState === 'checked' ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-chalk-white-dim">
          {currentIndex + 1}/{total}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-chalk-surface border border-chalk-border rounded-2xl p-5 sm:p-6">
        {/* Difficulty + Number */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-chalk-white-dim/50 uppercase tracking-widest">
            Question {currentIndex + 1}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            question.difficulty === 'easy' ? 'text-chalk-green' :
            question.difficulty === 'medium' ? 'text-chalk-yellow' :
            'text-chalk-red'
          }`}>
            {question.difficulty}
          </span>
        </div>

        <h3 className="font-chalk text-lg sm:text-xl text-chalk-white leading-snug mb-6">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedId === option.id;
            const showResult = quizState === 'checked';
            const isOptionCorrect = option.isCorrect;

            let borderColor = 'border-chalk-border';
            let bgColor = 'bg-transparent';
            let textColor = 'text-chalk-white-dim';

            if (showResult) {
              if (isOptionCorrect) {
                borderColor = 'border-chalk-green';
                bgColor = 'bg-chalk-green/10';
                textColor = 'text-chalk-green';
              } else if (isSelected && !isOptionCorrect) {
                borderColor = 'border-chalk-red';
                bgColor = 'bg-chalk-red/10';
                textColor = 'text-chalk-red';
              }
            } else if (isSelected) {
              borderColor = 'border-brand-500';
              bgColor = 'bg-brand-500/10';
              textColor = 'text-chalk-white';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={quizState === 'checked'}
                className={`
                  w-full text-left px-4 py-3.5 rounded-xl border ${borderColor} ${bgColor}
                  transition-all duration-200
                  ${quizState === 'answering' ? 'hover:border-brand-500/50 hover:bg-brand-500/5 cursor-pointer' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Indicator */}
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    showResult && isOptionCorrect ? 'border-chalk-green bg-chalk-green' :
                    showResult && isSelected && !isOptionCorrect ? 'border-chalk-red bg-chalk-red' :
                    isSelected ? 'border-brand-500 bg-brand-500' :
                    'border-chalk-border'
                  }`}>
                    {showResult && isOptionCorrect && <CheckCircleIcon className="h-3 w-3 text-white" />}
                    {showResult && isSelected && !isOptionCorrect && <XCircleIcon className="h-3 w-3 text-white" />}
                    {!showResult && isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>

                  <span className={`text-sm font-medium ${textColor}`} style={{ fontFamily: 'var(--font-chalk-body)' }}>
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation (shown after checking) */}
        {quizState === 'checked' && (
          <div className="mt-5 p-4 bg-brand-500/8 border border-brand-500/20 rounded-xl animate-fade-in">
            <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">Explanation</p>
            <p className="text-sm text-chalk-white-dim leading-relaxed" style={{ fontFamily: 'var(--font-chalk-body)' }}>
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        {quizState === 'answering' ? (
          <button
            onClick={handleCheck}
            disabled={!selectedId}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all active:scale-95"
          >
            {currentIndex < total - 1 ? 'Next Question' : 'See Results'}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}