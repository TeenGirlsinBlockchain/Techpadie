import { processNextJob } from '../services/worker.service';
import { JobType } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

const POLL_INTERVAL = parseInt(process.env.JOB_POLL_INTERVAL_MS || '5000', 10);
const WORKER_ID = `ai-worker-${process.pid}`;

let isShuttingDown = false;

async function main() {
  console.log(`🤖 Techpadie AI Generation Worker started (ID: ${WORKER_ID})`);
  
  const targetTypes: JobType[] = [
    JobType.GENERATE_QUIZ,
    JobType.GENERATE_FLASHCARDS,
    JobType.GENERATE_SUMMARY
  ];

  while (!isShuttingDown) {
    try {
      const hadJob = await processNextJob(targetTypes);
      if (hadJob) {
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    } catch (error) {
      console.error('❌ AI Worker error:', error);
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL * 2));
    }
  }
  
  console.log('👋 AI Worker shutting down gracefully...');
  process.exit(0);
}

process.on('SIGINT', () => { isShuttingDown = true; });
process.on('SIGTERM', () => { isShuttingDown = true; });

main().catch((err) => {
  console.error('💀 AI Worker crashed:', err);
  process.exit(1);
});
