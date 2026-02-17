import type {
  Course,
  Enrollment,
  ActivityItem,
  StatCardData,
} from '@/app/types';

// ─── Mock Courses (Explore / Sale) ───────────────────────────────
export const MOCK_COURSES: Course[] = [
  {
    id: 'crs_001',
    title: 'Blockchain Fundamentals',
    description:
      'Learn the core concepts of blockchain technology from zero. Understand distributed ledgers, consensus mechanisms, and cryptographic principles.',
    category: 'fundamentals',
    level: 'beginner',
    price: 5.0,
    originalPrice: 20.0,
    currency: 'USDT',
    imageUrl:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000',
    duration: '6h 30m',
    rating: 4.8,
    studentCount: 2450,
    availableLanguages: ['en', 'fr', 'sw'],
    author: {
      id: 'auth_001',
      name: 'Sarah Jenkins',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      title: 'Blockchain Educator',
    },
    isFeatured: true,
    modules: [
      {
        id: 'mod_001',
        title: 'Introduction to Blockchain',
        order: 1,
        lessons: [
          {
            id: 'les_001',
            title: 'What is Blockchain?',
            type: 'text',
            duration: '10 min',
            content: '<p>Blockchain is a distributed ledger technology...</p>',
            audioUrl: '/audio/les_001.mp3',
            transcript: 'Blockchain is a distributed ledger technology...',
            isFree: true,
            order: 1,
          },
          {
            id: 'les_002',
            title: 'Consensus Mechanisms',
            type: 'text',
            duration: '15 min',
            content: '<p>Consensus mechanisms ensure all nodes agree...</p>',
            audioUrl: '/audio/les_002.mp3',
            isFree: false,
            order: 2,
          },
        ],
      },
      {
        id: 'mod_002',
        title: 'Cryptography Basics',
        order: 2,
        lessons: [
          {
            id: 'les_003',
            title: 'Hashing Algorithms',
            type: 'text',
            duration: '12 min',
            content: '<p>Hash functions are one-way mathematical operations...</p>',
            isFree: false,
            order: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'crs_002',
    title: 'DeFi 101: Decentralized Finance',
    description:
      'Understand the world of decentralized finance. Learn about lending protocols, AMMs, yield farming, and risk management.',
    category: 'defi',
    level: 'beginner',
    price: 8.0,
    currency: 'USDT',
    imageUrl:
      'https://images.unsplash.com/photo-1620321023374-d1a68fddadb3?auto=format&fit=crop&q=80&w=1000',
    duration: '4h 15m',
    rating: 4.5,
    studentCount: 890,
    availableLanguages: ['en', 'fr'],
    author: {
      id: 'auth_002',
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael',
      title: 'DeFi Researcher',
    },
    modules: [],
  },
  {
    id: 'crs_003',
    title: 'Advanced Blockchain Security',
    description:
      'Deep dive into smart contract security, vulnerability analysis, and audit methodology for production-grade protocols.',
    category: 'security',
    level: 'advanced',
    price: 15.0,
    currency: 'USDT',
    imageUrl:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    duration: '8h 00m',
    rating: 4.9,
    studentCount: 120,
    availableLanguages: ['en'],
    author: {
      id: 'auth_003',
      name: 'Dr. Alex Rivest',
      avatar: 'https://i.pravatar.cc/150?u=alex',
      title: 'Security Auditor',
    },
    modules: [],
  },
  {
    id: 'crs_004',
    title: 'Smart Contract Development with Solidity',
    description:
      'Build and deploy smart contracts on Ethereum. Master Solidity, Hardhat, and testing best practices.',
    category: 'smart-contracts',
    level: 'intermediate',
    price: 10.0,
    currency: 'USDT',
    imageUrl:
      'https://images.unsplash.com/photo-1639322537228-ad7117a7a640?auto=format&fit=crop&q=80&w=1000',
    duration: '10h 20m',
    rating: 4.7,
    studentCount: 650,
    availableLanguages: ['en', 'fr', 'pt'],
    author: {
      id: 'auth_004',
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?u=david',
      title: 'Solidity Developer',
    },
    isFeatured: true,
    modules: [],
  },
  {
    id: 'crs_005',
    title: 'Crypto Trading & Market Analysis',
    description:
      'Learn technical analysis, risk management, and trading strategies for cryptocurrency markets.',
    category: 'trading-markets',
    level: 'intermediate',
    price: 12.0,
    currency: 'USDT',
    imageUrl:
      'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1000',
    duration: '7h 10m',
    rating: 4.4,
    studentCount: 400,
    availableLanguages: ['en', 'ar', 'ha'],
    author: {
      id: 'auth_005',
      name: 'Elena Vostok',
      avatar: 'https://i.pravatar.cc/150?u=elena',
      title: 'Quantitative Analyst',
    },
    modules: [],
  },
  {
    id: 'crs_006',
    title: 'Building dApps with React & Ethers.js',
    description:
      'Full-stack Web3 development. Connect React frontends to smart contracts using Ethers.js and Wagmi.',
    category: 'development',
    level: 'intermediate',
    price: 10.0,
    currency: 'USDT',
    imageUrl:
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000',
    duration: '9h 45m',
    rating: 4.6,
    studentCount: 1500,
    availableLanguages: ['en', 'fr', 'sw', 'pt'],
    author: {
      id: 'auth_006',
      name: 'Jessica Lee',
      avatar: 'https://i.pravatar.cc/150?u=jessica',
      title: 'Full-stack Web3 Dev',
    },
    modules: [],
  },
];

// ─── Mock Enrollments ────────────────────────────────────────────
export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr_001',
    userId: 'usr_001',
    courseId: 'crs_001',
    course: MOCK_COURSES[0],
    progressPercentage: 65,
    completedLessonIds: ['les_001', 'les_002'],
    lastLessonId: 'les_002',
    enrolledAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'enr_002',
    userId: 'usr_001',
    courseId: 'crs_004',
    course: MOCK_COURSES[3],
    progressPercentage: 30,
    completedLessonIds: [],
    enrolledAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'enr_003',
    userId: 'usr_001',
    courseId: 'crs_002',
    course: MOCK_COURSES[1],
    progressPercentage: 100,
    completedLessonIds: [],
    completedAt: '2025-02-10T00:00:00Z',
    enrolledAt: '2025-01-25T00:00:00Z',
  },
];

// ─── Mock Recent Activity ────────────────────────────────────────
export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'act_001',
    type: 'lesson_completed',
    title: 'Completed "Consensus Mechanisms"',
    description: 'Blockchain Fundamentals',
    xpEarned: 25,
    timestamp: '2025-02-16T09:30:00Z',
  },
  {
    id: 'act_002',
    type: 'achievement_unlocked',
    title: 'Achievement: Week Warrior',
    description: '7-day learning streak!',
    xpEarned: 100,
    timestamp: '2025-02-15T18:00:00Z',
  },
  {
    id: 'act_003',
    type: 'quiz_completed',
    title: 'Quiz: Blockchain Basics',
    description: 'Scored 85% — Passed!',
    xpEarned: 50,
    timestamp: '2025-02-15T14:20:00Z',
  },
  {
    id: 'act_004',
    type: 'audio_completed',
    title: 'Listened to "What is Blockchain?"',
    description: 'Blockchain Fundamentals',
    xpEarned: 25,
    timestamp: '2025-02-14T11:00:00Z',
  },
  {
    id: 'act_005',
    type: 'course_enrolled',
    title: 'Enrolled in Smart Contract Development',
    description: 'Intermediate · 10h 20m',
    timestamp: '2025-02-01T00:00:00Z',
  },
];

// ─── Mock Stat Cards (Dashboard) ─────────────────────────────────
export const MOCK_STATS: StatCardData[] = [
  {
    metricKey: 'streak',
    label: 'stats.currentStreak',
    value: 7,
    unit: 'days',
    change: 'Personal best: 14',
    changeType: 'positive',
  },
  {
    metricKey: 'xp',
    label: 'stats.totalXP',
    value: 450,
    unit: 'XP',
    change: '+75 this week',
    changeType: 'positive',
  },
  {
    metricKey: 'courses-completed',
    label: 'stats.coursesCompleted',
    value: 1,
    change: '2 in progress',
    changeType: 'neutral',
  },
  {
    metricKey: 'level',
    label: 'stats.currentLevel',
    value: 'Lvl 3',
    change: 'Chain Explorer',
    changeType: 'positive',
  },
  {
    metricKey: 'weekly-time',
    label: 'stats.weeklyTime',
    value: '3h 35m',
    change: '+45m vs last week',
    changeType: 'positive',
  },
];

// ─── Daily Tips ──────────────────────────────────────────────────
export const DAILY_TIPS = [
  'Learners who study 15 minutes a day finish courses 2x faster.',
  'Try listening to lessons on audio during your commute!',
  'Quiz yourself after each module to boost retention by 40%.',
  'Blockchain developers are among the highest paid in tech.',
  'Consistency beats intensity — a 10-minute streak is better than a 2-hour sprint.',
  'DeFi protocols manage over $50B in assets. Understanding them is a superpower.',
];