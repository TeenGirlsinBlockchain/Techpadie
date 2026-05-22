import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  SESSION_MAX_AGE_HOURS: z.coerce.number().default(168),
  RESEND_API_KEY: z.string().default('re_mock_key'),
  EMAIL_FROM: z.string().default('Techpadie <noreply@techpadie.com>'),
  APP_URL: z.string().default('http://localhost:3000'),
  GOOGLE_GEMINI_API_KEY: z.string().default('mock_gemini_key'),
  AI_MAX_FLASHCARDS: z.coerce.number().default(10),
  AI_MAX_QUIZ_QUESTIONS: z.coerce.number().default(10),
  FLARE_RPC_URL: z.string().default('https://flare-api.flare.network/ext/C/rpc'),
  FLARE_PRIVATE_KEY: z.string().default('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
  FLARE_CHAIN_ID: z.coerce.number().default(14),
  FLARE_TOKEN_CONTRACT_ADDRESS: z.string().default('0x0000000000000000000000000000000000000000'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters long').default('super-secret-session-key-must-be-long-and-random-at-least-32-bytes'),
});

let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_MAX_AGE_HOURS: process.env.SESSION_MAX_AGE_HOURS,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    APP_URL: process.env.APP_URL,
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY,
    AI_MAX_FLASHCARDS: process.env.AI_MAX_FLASHCARDS,
    AI_MAX_QUIZ_QUESTIONS: process.env.AI_MAX_QUIZ_QUESTIONS,
    FLARE_RPC_URL: process.env.FLARE_RPC_URL,
    FLARE_PRIVATE_KEY: process.env.FLARE_PRIVATE_KEY,
    FLARE_CHAIN_ID: process.env.FLARE_CHAIN_ID,
    FLARE_TOKEN_CONTRACT_ADDRESS: process.env.FLARE_TOKEN_CONTRACT_ADDRESS,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    SESSION_SECRET: process.env.SESSION_SECRET,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    const formatError = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('\n');
    console.error('❌ Invalid environment variables:\n', formatError);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Invalid environment variables:\n${formatError}`);
    }
  }
  // Fallback parse to get defaults
  parsedEnv = envSchema.parse({
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/techpadie?schema=public',
  });
}

export const env = parsedEnv;
