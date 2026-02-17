import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { logger } from '../web/src/lib/logger';

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'publish',
  async (job: Job) => {
    logger.info('Processing job', { jobId: job.id, data: job.data });

    const { scheduledPostId } = job.data;

    try {
      // TODO: Implement publishing logic
      logger.info('Job completed', { jobId: job.id, scheduledPostId });
      return { success: true };
    } catch (error) {
      logger.error('Job failed', { jobId: job.id, error });
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  logger.info('Worker completed job', { jobId: job.id });
});

worker.on('failed', (job, err) => {
  logger.error('Worker failed job', { jobId: job?.id, error: err.message });
});

logger.info('Worker started');

process.on('SIGINT', async () => {
  logger.info('Shutting down worker...');
  await worker.close();
  process.exit(0);
});
