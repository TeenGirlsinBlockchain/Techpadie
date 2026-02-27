import { logger } from '@/app/lib/logger';
import type { Language } from '@prisma/client';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const MAX_FLASHCARDS = parseInt(process.env.AI_MAX_FLASHCARDS || '10', 10);
const MAX_QUIZ_QUESTIONS = parseInt(process.env.AI_MAX_QUIZ_QUESTIONS || '10', 10);

const LANGUAGE_NAMES: Record<string, string> = {
  EN: 'English',
  FR: 'French',
  AR: 'Arabic',
  SW: 'Swahili',
  HA: 'Hausa',
  PT: 'Portuguese',
};

// ─── Core API Call ──────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
  }

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'unknown');
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return text;
}

function parseJSON<T>(raw: string): T {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(cleaned);
}

// ─── Quiz Generation ────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export async function generateQuiz(
  content: string,
  language: Language
): Promise<QuizQuestion[]> {
  const langName = LANGUAGE_NAMES[language] || 'English';

  const prompt = `You are an expert quiz creator for an educational platform about blockchain and Web3.

Given the following lesson content, generate exactly ${MAX_QUIZ_QUESTIONS} multiple-choice questions in ${langName}.

RULES:
- Each question must have exactly 4 options (A, B, C, D)
- Questions should test understanding, not just memorization
- Mix difficulty levels: 3 easy, 4 medium, 3 hard
- Include an explanation for the correct answer
- All text must be in ${langName}

Return ONLY a JSON array with this exact structure:
[
  {
    "id": "q1",
    "question": "What is...?",
    "options": [
      { "id": "a", "text": "Option A" },
      { "id": "b", "text": "Option B" },
      { "id": "c", "text": "Option C" },
      { "id": "d", "text": "Option D" }
    ],
    "correctOptionId": "a",
    "explanation": "This is correct because..."
  }
]

LESSON CONTENT:
${content.slice(0, 15000)}`;

  const raw = await callGemini(prompt);
  const questions = parseJSON<QuizQuestion[]>(raw);

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Invalid quiz generation output');
  }

  return questions;
}

// ─── Flashcard Generation ───────────────────────────────────────

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export async function generateFlashcards(
  content: string,
  language: Language
): Promise<Flashcard[]> {
  const langName = LANGUAGE_NAMES[language] || 'English';

  const prompt = `You are an expert educator creating flashcards for blockchain and Web3 concepts.

Given the following lesson content, generate exactly ${MAX_FLASHCARDS} flashcards in ${langName}.

RULES:
- Front: concise question or concept
- Back: clear, concise answer or explanation
- Mix difficulty levels
- Focus on key concepts, definitions, and relationships
- All text must be in ${langName}

Return ONLY a JSON array:
[
  {
    "id": "f1",
    "front": "What is...?",
    "back": "It is...",
    "difficulty": "easy"
  }
]

LESSON CONTENT:
${content.slice(0, 15000)}`;

  const raw = await callGemini(prompt);
  const flashcards = parseJSON<Flashcard[]>(raw);

  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    throw new Error('Invalid flashcard generation output');
  }

  return flashcards;
}

// ─── Summary Generation ─────────────────────────────────────────

export interface LessonSummary {
  summary: string;
  keyPoints: string[];
  prerequisites: string[];
}

export async function generateSummary(
  content: string,
  language: Language
): Promise<LessonSummary> {
  const langName = LANGUAGE_NAMES[language] || 'English';

  const prompt = `You are an expert educator summarizing blockchain and Web3 lesson content.

Given the following lesson content, generate a structured summary in ${langName}.

RULES:
- Summary: 3-5 paragraphs covering the main ideas
- Key Points: 5-8 bullet points of the most important takeaways
- Prerequisites: what the learner should already know
- All text must be in ${langName}

Return ONLY a JSON object:
{
  "summary": "The lesson covers...",
  "keyPoints": ["Point 1", "Point 2"],
  "prerequisites": ["Basic understanding of..."]
}

LESSON CONTENT:
${content.slice(0, 15000)}`;

  const raw = await callGemini(prompt);
  const summary = parseJSON<LessonSummary>(raw);

  if (!summary.summary || !Array.isArray(summary.keyPoints)) {
    throw new Error('Invalid summary generation output');
  }

  return summary;
}