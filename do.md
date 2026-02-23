app/
├── layout.tsx                              ← Root (Caveat + Kalam fonts added)
├── _styles/globals.css                     ← Full theme tokens + chalkboard styles
├── types/
│   ├── user.ts, course.ts, gamification.ts, audio.ts, activity.ts, i18n.ts
│   ├── learn.ts                            ← NEW: Flashcard, Quiz, TTS, LessonProgress
│   └── index.ts                            ← Barrel export (includes learn types)
├── lib/
│   ├── constants.ts, utils.ts, mockData.ts
│   ├── mockLearnData.ts                    ← NEW: 3 lessons of flashcards + quizzes
│   ├── hooks/useTTS.ts                     ← NEW: Web Speech API hook
│   └── i18n/ (config, en.json, fr.json, useTranslation)
├── context/ (Audio, Gamification, Language, User)
├── components/ui/ (Badge, Button, Drawer, ProgressBar, Skeleton)
└── dashboard/
    ├── layout.tsx, page.tsx
    ├── components/ (layout, sections, cards — all from Phase 1-3)
    ├── explore/page.tsx
    ├── my-courses/page.tsx
    ├── achievements/page.tsx
    ├── settings/page.tsx
    └── learn/
        ├── [courseId]/page.tsx              ← Main learn page (rename from courseId/)
        └── components/
            ├── ChalkboardShell.tsx          ← Green chalkboard wrapper + tray
            ├── LessonTabs.tsx              ← Read | Listen | Flashcards | Quiz
            ├── ReadPanel.tsx               ← Content reader + completion card
            ├── ListenPanel.tsx             ← TTS player with waveform + transcript
            ├── FlashcardsPanel.tsx         ← Flip cards with progress tracking
            ├── QuizPanel.tsx               ← Multi-choice with scoring + XP
            └── ChalkSyllabus.tsx           ← Course index sidebar