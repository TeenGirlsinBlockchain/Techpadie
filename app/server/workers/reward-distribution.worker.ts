import { processNextJob } from '../services/worker.service';
import { JobType } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

const POLL_INTERVAL = parseInt(process.env.JOB_POLL_INTERVAL_MS || '5000', 10);
const WORKER_ID = `reward-worker-${process.pid}`;

let isShuttingDown = false;

async function main() {
  console.log(`🪙 Techpadie Reward Distribution Worker started (ID: ${WORKER_ID})`);
  
  const targetTypes: JobType[] = [
    JobType.TRANSFER_TOKENS
  ];

  while (!isShuttingDown) {
    try {
      const hadJob = await processNextJob(targetTypes);
      if (hadJob) {
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    } catch (error) {
      console.error('❌ Reward Worker error:', error);
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL * 2));
    }
  }
  
  console.log('👋 Reward Worker shutting down gracefully...');
  process.exit(0);
}

process.on('SIGINT', () => { isShuttingDown = true; });
process.on('SIGTERM', () => { isShuttingDown = true; });

main().catch((err) => {
  console.error('💀 Reward Worker crashed:', err);
  process.exit(1);
});
