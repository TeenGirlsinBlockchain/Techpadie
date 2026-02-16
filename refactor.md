app/
├── _styles/
│   └── globals.css                    # Design tokens + base styles
│
├── components/
│   ├── ui/                            # Atomic reusable primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx                 # Mobile drawer primitive
│   │   ├── Tooltip.tsx
│   │   └── Skeleton.tsx               # Loading skeletons
│   │
│   ├── mascot/
│   │   └── AdaMascot.tsx              # Refactored with variant system
│   │
│   ├── audio/
│   │   ├── AudioPlayer.tsx            # Persistent bottom player
│   │   ├── AudioMiniPlayer.tsx        # Collapsed mini bar
│   │   └── AudioSpeedControl.tsx
│   │
│   ├── gamification/
│   │   ├── XPBadge.tsx
│   │   ├── StreakCounter.tsx
│   │   ├── LevelBadge.tsx
│   │   ├── AchievementCard.tsx
│   │   ├── MicroCelebration.tsx       # Subtle confetti/glow effects
│   │   └── WeeklyHeatmap.tsx          # The GitHub-style grid
│   │
│   └── landing/                       # Keep existing (out of scope now)
│       ├── Hero.tsx
│       ├── LandingNavbar.tsx
│       ├── Features.tsx
│       └── PremiumCard.tsx
│
├── dashboard/
│   ├── layout.tsx                     # Responsive shell: sidebar + mobile nav
│   ├── page.tsx                       # Dashboard home (composed from sections)
│   │
│   ├── components/                    # Dashboard-scoped components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            # Desktop sidebar (refactored)
│   │   │   ├── MobileNav.tsx          # Bottom tab bar for mobile
│   │   │   ├── DashboardHeader.tsx    # Responsive header
│   │   │   └── MobileDrawer.tsx       # Hamburger slide-out for secondary nav
│   │   │
│   │   ├── sections/                  # Dashboard page sections
│   │   │   ├── WelcomeSection.tsx     # Greeting + mascot + tip + streak
│   │   │   ├── GamifiedStatsStrip.tsx # XP, streak, level, courses, time
│   │   │   ├── RecentActivity.tsx     # Activity feed
│   │   │   ├── ContinueLearning.tsx   # Enrolled courses with resume
│   │   │   └── CoursesForSale.tsx     # Purchasable courses on dashboard
│   │   │
│   │   ├── cards/
│   │   │   ├── CourseCard.tsx         # Master card (refactored from existing)
│   │   │   ├── StatCard.tsx           # Refactored from existing
│   │   │   ├── ActivityItem.tsx       # Single activity feed item
│   │   │   └── EnrollmentCard.tsx     # Course detail sidebar card
│   │   │
│   │   └── course/
│   │       ├── SyllabusAccordion.tsx   # Extracted from page
│   │       ├── LessonContent.tsx       # Reading view renderer
│   │       └── CourseProgressSidebar.tsx
│   │
│   ├── explore/
│   │   ├── page.tsx
│   │   └── [courseId]/
│   │       └── page.tsx
│   │
│   ├── learn/
│   │   └── [courseId]/
│   │       └── page.tsx
│   │
│   ├── my-courses/
│   │   └── page.tsx
│   │
│   ├── achievements/                  # NEW
│   │   └── page.tsx
│   │
│   └── settings/                      # NEW
│       └── page.tsx
│
├── context/                           # Frontend state (no backend yet)
│   ├── UserContext.tsx                 # User data + preferences
│   ├── AudioContext.tsx                # Audio player state
│   ├── GamificationContext.tsx         # XP, streak, level, achievements
│   └── LanguageContext.tsx             # i18n state (backend-ready)
│
├── lib/
│   ├── constants.ts                   # Design tokens as JS constants
│   ├── mockData.ts                    # ALL mock data centralized here
│   ├── gamification.ts                # XP calculation, level thresholds
│   ├── i18n/
│   │   ├── config.ts                  # Supported languages, default locale
│   │   ├── en.json                    # English translations
│   │   ├── fr.json                    # French translations
│   │   └── useTranslation.ts          # Translation hook
│   └── utils.ts                       # Shared helpers
│
├── types/
│   ├── user.ts
│   ├── course.ts
│   ├── gamification.ts
│   ├── audio.ts
│   ├── activity.ts
│   └── i18n.ts
│
├── layout.tsx                         # Root layout
└── page.tsx                           # Landing page