
import { processNextJob } from '../app/server/services/worker.service';

const POLL_INTERVAL = parseInt(process.env.JOB_POLL_INTERVAL_MS || '5000', 10);
const WORKER_ID = process.env.JOB_WORKER_ID || `worker-${process.pid}`;

let isShuttingDown = false;

async function main() {
  console.log(`🔧 Techpadie Job Worker started`);
  console.log(`   Worker ID: ${WORKER_ID}`);
  console.log(`   Poll interval: ${POLL_INTERVAL}ms`);
  console.log(`   Press Ctrl+C to stop\n`);

  while (!isShuttingDown) {
    try {
      const hadJob = await processNextJob();

      if (hadJob) {
        // If we just processed a job, immediately check for more
        // (no delay — drain the queue fast)
        continue;
      }

      // Queue empty — wait before polling again
      await sleep(POLL_INTERVAL);
    } catch (error) {
      console.error(
        '❌ Worker loop error:',
        error instanceof Error ? error.message : error
      );
      // Wait before retrying after an error
      await sleep(POLL_INTERVAL * 2);
    }
  }

  console.log('\n👋 Worker shutting down gracefully...');
  process.exit(0);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Graceful shutdown
process.on('SIGINT', () => {
  isShuttingDown = true;
});
process.on('SIGTERM', () => {
  isShuttingDown = true;
});

main().catch((err) => {
  console.error('💀 Worker crashed:', err);
  process.exit(1);
});