import type { LessonGeneratedContent } from '@/app/types';

// ─── Mock Generated Content (per lesson) ────────────────────────
// When backend arrives: GET /api/lessons/:id/generated-content?lang=en
// These mock the AI-generated flashcards and quiz questions

export const MOCK_GENERATED_CONTENT: Record<string, LessonGeneratedContent> = {
  les_001: {
    lessonId: 'les_001',
    language: 'en',
    generatedAt: '2025-02-15T00:00:00Z',
    version: 1,
    flashcards: [
      {
        id: 'fc_001',
        front: 'What is a blockchain?',
        back: 'A distributed, immutable ledger that records transactions across a network of computers, ensuring transparency and security without a central authority.',
        difficulty: 'easy',
      },
      {
        id: 'fc_002',
        front: 'What is a distributed ledger?',
        back: 'A database that is shared, replicated, and synchronized across multiple nodes or locations, with no central administrator.',
        difficulty: 'easy',
      },
      {
        id: 'fc_003',
        front: 'What makes blockchain immutable?',
        back: 'Each block contains a cryptographic hash of the previous block, creating a chain. Altering any block would invalidate all subsequent hashes, making tampering detectable.',
        difficulty: 'medium',
      },
      {
        id: 'fc_004',
        front: 'Difference between blockchain and the internet?',
        back: 'The internet is the underlying network infrastructure. Blockchain is an application-layer technology that runs on top of the internet to enable trustless, decentralized record-keeping.',
        difficulty: 'medium',
      },
      {
        id: 'fc_005',
        front: 'What is a node in a blockchain network?',
        back: 'A computer that maintains a copy of the blockchain ledger and participates in validating and relaying transactions.',
        difficulty: 'easy',
      },
      {
        id: 'fc_006',
        front: 'What problem does blockchain solve?',
        back: 'The double-spending problem — ensuring digital assets cannot be copied or spent twice without needing a trusted intermediary like a bank.',
        difficulty: 'hard',
      },
    ],
    quiz: [
      {
        id: 'q_001',
        question: 'Which of the following best describes a blockchain?',
        difficulty: 'easy',
        explanation: 'A blockchain is a distributed ledger shared across many computers. It is not stored in one place and does not require a central authority.',
        options: [
          { id: 'q1_a', text: 'A centralized database managed by a single company', isCorrect: false },
          { id: 'q1_b', text: 'A distributed ledger replicated across multiple nodes', isCorrect: true },
          { id: 'q1_c', text: 'A type of cryptocurrency', isCorrect: false },
          { id: 'q1_d', text: 'A programming language for smart contracts', isCorrect: false },
        ],
      },
      {
        id: 'q_002',
        question: 'What makes data on a blockchain tamper-resistant?',
        difficulty: 'medium',
        explanation: 'Each block contains a cryptographic hash of the previous block. Changing any data would break the hash chain, making tampering immediately detectable by all nodes.',
        options: [
          { id: 'q2_a', text: 'Data is encrypted with a master password', isCorrect: false },
          { id: 'q2_b', text: 'Only administrators can modify records', isCorrect: false },
          { id: 'q2_c', text: 'Each block contains the cryptographic hash of the previous block', isCorrect: true },
          { id: 'q2_d', text: 'Blockchain servers are physically secured', isCorrect: false },
        ],
      },
      {
        id: 'q_003',
        question: 'What is the "double-spending problem" that blockchain solves?',
        difficulty: 'hard',
        explanation: 'Before blockchain, digital assets could potentially be copied and spent more than once. Blockchain\'s consensus mechanism ensures each unit of value can only be transferred once.',
        options: [
          { id: 'q3_a', text: 'The risk of overpaying for transaction fees', isCorrect: false },
          { id: 'q3_b', text: 'The inability to send money internationally', isCorrect: false },
          { id: 'q3_c', text: 'The risk of digital assets being copied and spent more than once', isCorrect: true },
          { id: 'q3_d', text: 'The cost of maintaining two separate bank accounts', isCorrect: false },
        ],
      },
      {
        id: 'q_004',
        question: 'What is a "node" in a blockchain network?',
        difficulty: 'easy',
        explanation: 'A node is any computer that connects to the blockchain network, stores a copy of the ledger, and helps validate and relay new transactions.',
        options: [
          { id: 'q4_a', text: 'A unit of cryptocurrency', isCorrect: false },
          { id: 'q4_b', text: 'A computer that maintains a copy of the blockchain', isCorrect: true },
          { id: 'q4_c', text: 'A type of smart contract', isCorrect: false },
          { id: 'q4_d', text: 'A blockchain developer', isCorrect: false },
        ],
      },
    ],
  },

  les_002: {
    lessonId: 'les_002',
    language: 'en',
    generatedAt: '2025-02-15T00:00:00Z',
    version: 1,
    flashcards: [
      {
        id: 'fc_101',
        front: 'What is a consensus mechanism?',
        back: 'A protocol that ensures all nodes in a blockchain network agree on the current state of the ledger, preventing conflicting transactions.',
        difficulty: 'easy',
      },
      {
        id: 'fc_102',
        front: 'What is Proof of Work (PoW)?',
        back: 'A consensus mechanism where miners compete to solve complex mathematical puzzles. The first to solve it earns the right to add the next block and receives a reward.',
        difficulty: 'medium',
      },
      {
        id: 'fc_103',
        front: 'What is Proof of Stake (PoS)?',
        back: 'A consensus mechanism where validators are chosen to create new blocks based on the amount of cryptocurrency they "stake" as collateral.',
        difficulty: 'medium',
      },
      {
        id: 'fc_104',
        front: 'PoW vs PoS: energy usage?',
        back: 'PoW requires enormous computational power and electricity. PoS is far more energy-efficient because validators are chosen based on stake rather than computational work.',
        difficulty: 'hard',
      },
    ],
    quiz: [
      {
        id: 'q_101',
        question: 'What is the primary purpose of a consensus mechanism?',
        difficulty: 'easy',
        explanation: 'Consensus mechanisms ensure all participants in a decentralized network agree on which transactions are valid, maintaining a single source of truth.',
        options: [
          { id: 'q5_a', text: 'To encrypt user data', isCorrect: false },
          { id: 'q5_b', text: 'To ensure all nodes agree on the ledger state', isCorrect: true },
          { id: 'q5_c', text: 'To speed up transaction processing', isCorrect: false },
          { id: 'q5_d', text: 'To reduce the size of the blockchain', isCorrect: false },
        ],
      },
      {
        id: 'q_102',
        question: 'In Proof of Work, how are new blocks added?',
        difficulty: 'medium',
        explanation: 'Miners compete to solve a cryptographic puzzle. The first miner to find a valid solution broadcasts it to the network and earns the right to add the block.',
        options: [
          { id: 'q6_a', text: 'By a random lottery among all users', isCorrect: false },
          { id: 'q6_b', text: 'Miners solve cryptographic puzzles to earn the right', isCorrect: true },
          { id: 'q6_c', text: 'The oldest node automatically adds the block', isCorrect: false },
          { id: 'q6_d', text: 'Users vote on which block to add', isCorrect: false },
        ],
      },
    ],
  },

  les_003: {
    lessonId: 'les_003',
    language: 'en',
    generatedAt: '2025-02-15T00:00:00Z',
    version: 1,
    flashcards: [
      {
        id: 'fc_201',
        front: 'What is a hash function?',
        back: 'A one-way mathematical function that converts input data of any size into a fixed-size output (hash). Even a tiny change in input produces a completely different hash.',
        difficulty: 'easy',
      },
      {
        id: 'fc_202',
        front: 'What is SHA-256?',
        back: 'Secure Hash Algorithm 256-bit — the hashing algorithm used by Bitcoin. It always produces a 256-bit (64 hexadecimal character) output regardless of input size.',
        difficulty: 'medium',
      },
      {
        id: 'fc_203',
        front: 'What is the "avalanche effect" in hashing?',
        back: 'A property where a tiny change in input (even one bit) causes a dramatically different hash output, making it impossible to predict or reverse-engineer.',
        difficulty: 'hard',
      },
    ],
    quiz: [
      {
        id: 'q_201',
        question: 'What is a key property of cryptographic hash functions?',
        difficulty: 'easy',
        explanation: 'Hash functions are one-way — you can compute a hash from data, but you cannot reconstruct the original data from the hash.',
        options: [
          { id: 'q7_a', text: 'They can be reversed to find the original data', isCorrect: false },
          { id: 'q7_b', text: 'They always produce the same size output regardless of input', isCorrect: true },
          { id: 'q7_c', text: 'They require a password to compute', isCorrect: false },
          { id: 'q7_d', text: 'They only work with numbers', isCorrect: false },
        ],
      },
    ],
  },
};

// Helper to get content for a lesson (falls back to empty)
export function getLessonGeneratedContent(lessonId: string): LessonGeneratedContent | null {
  return MOCK_GENERATED_CONTENT[lessonId] || null;
}
