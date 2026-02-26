import type {
  Course,
  Enrollment,
  ActivityItem,
  StatCardData,
   Flashcard, QuizQuestion, LessonGeneratedContent 
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

export const MOCK_GENERATED_CONTENT: Record<string, LessonGeneratedContent> = {
  les_001: {
    lessonId: 'les_001',
    locale: 'en',
    flashcards: [
      { id: 'fc_001', front: 'What is a blockchain?', back: 'A distributed, immutable digital ledger that records transactions across a network of computers. Each block contains a cryptographic hash of the previous block, creating an unbreakable chain.', difficulty: 'easy' },
      { id: 'fc_002', front: 'What is decentralization?', back: 'A system where no single entity has control. In blockchain, data is distributed across thousands of nodes, making it resistant to censorship and single points of failure.', difficulty: 'easy' },
      { id: 'fc_003', front: 'What is a cryptographic hash?', back: 'A one-way mathematical function that converts any input into a fixed-length string of characters. Even a tiny change in the input produces a completely different output.', difficulty: 'medium' },
      { id: 'fc_004', front: 'What problem does blockchain solve?', back: 'The double-spending problem — ensuring digital assets cannot be copied or spent twice without needing a trusted intermediary like a bank.', difficulty: 'medium' },
      { id: 'fc_005', front: 'What is a distributed ledger?', back: 'A database that is shared, replicated, and synchronized across multiple nodes in a network. Every participant holds an identical copy of the ledger.', difficulty: 'easy' },
      { id: 'fc_006', front: 'What makes a blockchain immutable?', back: 'Each block contains the hash of the previous block. Altering any block would change its hash, breaking the chain — which would be detected by every node in the network.', difficulty: 'hard' },
    ],
    quiz: [
      { id: 'q_001', question: 'What is the primary innovation that blockchain technology provides?', options: [{ id: 'q1_a', text: 'Faster internet speeds', isCorrect: false }, { id: 'q1_b', text: 'A way to store data that cannot be altered retroactively', isCorrect: true }, { id: 'q1_c', text: 'A new programming language', isCorrect: false }, { id: 'q1_d', text: 'Cheaper cloud computing', isCorrect: false }], explanation: 'Blockchain\'s core innovation is immutability — once data is recorded in a block and added to the chain, it cannot be altered without detection.', xpReward: 10 },
      { id: 'q_002', question: 'What is the "double-spending problem"?', options: [{ id: 'q2_a', text: 'When a transaction takes too long to process', isCorrect: false }, { id: 'q2_b', text: 'When digital money is copied and used in two places', isCorrect: true }, { id: 'q2_c', text: 'When mining costs exceed the reward', isCorrect: false }, { id: 'q2_d', text: 'When two blockchains merge into one', isCorrect: false }], explanation: 'The double-spending problem is the risk that a digital token could be duplicated and spent more than once. Blockchain prevents this through consensus mechanisms.', xpReward: 10 },
      { id: 'q_003', question: 'How does a cryptographic hash contribute to blockchain security?', options: [{ id: 'q3_a', text: 'It encrypts all transactions so nobody can read them', isCorrect: false }, { id: 'q3_b', text: 'It creates a unique fingerprint for each block that changes if the data is modified', isCorrect: true }, { id: 'q3_c', text: 'It speeds up the network by compressing data', isCorrect: false }, { id: 'q3_d', text: 'It allows users to recover lost passwords', isCorrect: false }], explanation: 'A cryptographic hash produces a unique fixed-length output for any given input. Any change to the block data produces a completely different hash, making tampering immediately detectable.', xpReward: 10 },
      { id: 'q_004', question: 'What does "decentralization" mean in the context of blockchain?', options: [{ id: 'q4_a', text: 'The blockchain runs on a single powerful server', isCorrect: false }, { id: 'q4_b', text: 'One company controls all the data', isCorrect: false }, { id: 'q4_c', text: 'Control and data are distributed across many nodes in the network', isCorrect: true }, { id: 'q4_d', text: 'Only governments can operate blockchain nodes', isCorrect: false }], explanation: 'Decentralization means no single entity controls the network. Data is distributed across thousands of nodes.', xpReward: 10 },
    ],
    generatedAt: '2025-02-15T00:00:00Z',
  },
  les_002: {
    lessonId: 'les_002',
    locale: 'en',
    flashcards: [
      { id: 'fc_101', front: 'What is Proof of Work (PoW)?', back: 'A consensus mechanism where miners compete to solve complex mathematical puzzles. The first to solve it gets to add the next block and receives a reward.', difficulty: 'medium' },
      { id: 'fc_102', front: 'What is Proof of Stake (PoS)?', back: 'A consensus mechanism where validators are chosen to create blocks based on the amount of cryptocurrency they hold and "stake" as collateral.', difficulty: 'medium' },
      { id: 'fc_103', front: 'Why do blockchains need consensus mechanisms?', back: 'To ensure all nodes in the network agree on the current state of the ledger without needing a central authority to validate transactions.', difficulty: 'easy' },
    ],
    quiz: [
      { id: 'q_101', question: 'What is the main difference between Proof of Work and Proof of Stake?', options: [{ id: 'q101_a', text: 'PoW uses computational puzzles; PoS uses staked cryptocurrency', isCorrect: true }, { id: 'q101_b', text: 'PoW is faster than PoS', isCorrect: false }, { id: 'q101_c', text: 'PoS requires more electricity than PoW', isCorrect: false }, { id: 'q101_d', text: 'There is no difference', isCorrect: false }], explanation: 'PoW requires miners to solve computational puzzles (consuming energy), while PoS selects validators based on the amount of cryptocurrency they stake as collateral.', xpReward: 10 },
    ],
    generatedAt: '2025-02-15T00:00:00Z',
  },
};
