
import { quizRepo } from '@/app/server/repositories/quiz.repo';
import { generatedContentRepo } from '@/app/server/repositories/generated-content.repo';
import { auditRepo } from '@/app/server/repositories/audit.repo';
import { NotFoundError, BadRequestError } from '@/app/lib/api-error';
import type { Language } from '@prisma/client';

// Expected shape of quiz data stored in GeneratedContent.data
interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

/**
 * Submit a quiz attempt.
 * 1. Fetch the READY quiz for this lesson+language
 * 2. Score the answers against correctOptionId
 * 3. Determine pass/fail (based on course reward config threshold, default 70%)
 * 4. Store the attempt
 */
export async function submitQuizAttempt(
  userId: string,
  lessonId: string,
  language: Language,
  answers: { questionId: string; selectedOptionId: string }[],
  meta: { ipAddress: string; userAgent: string }
) {
  // Get the quiz content
  const quizContent = await generatedContentRepo.findLatestReady(
    lessonId,
    language,
    'QUIZ'
  );

  if (!quizContent || !quizContent.data) {
    throw new NotFoundError(
      'No quiz available for this lesson yet. It may still be generating.'
    );
  }

  const questions = quizContent.data as unknown as QuizQuestion[];

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new BadRequestError('Quiz data is invalid');
  }

  // Score the answers
  let correctCount = 0;
  const totalQuestions = questions.length;

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question && question.correctOptionId === answer.selectedOptionId) {
      correctCount++;
    }
  }

  const score = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  // Get pass threshold from reward config (default 70%)
  const { db } = await import('@/app/lib/db');
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    select: {
      module: {
        select: {
          course: {
            select: {
              rewardConfig: { select: { quizPassThreshold: true } },
            },
          },
        },
      },
    },
  });

  const threshold = lesson?.module.course.rewardConfig?.quizPassThreshold ?? 70;
  const passed = score >= threshold;

  // Store attempt
  const attempt = await quizRepo.create({
    userId,
    lessonId,
    language,
    answers,
    score,
    totalQs: totalQuestions,
    correctQs: correctCount,
    passed,
  });

  await auditRepo.log({
    userId,
    action: 'QUIZ_ATTEMPTED',
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { lessonId, score, passed },
  });

  return {
    attempt,
    score,
    totalQuestions,
    correctCount,
    passed,
    threshold,
  };
}

/**
 * Get quiz attempts history for a lesson.
 */
export async function getQuizAttempts(userId: string, lessonId: string) {
  return quizRepo.findByUserAndLesson(userId, lessonId);
}