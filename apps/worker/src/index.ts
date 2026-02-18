import 'dotenv/config';
import { Worker, Job, Queue } from 'bullmq';
import Redis from 'ioredis';
import { logger } from './utils/logger.js';
import { publishPost } from './jobs/publish-post.js';

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
}) as unknown as any;

// Define job processors
const jobProcessors: Record<string, (job: Job) => Promise<void>> = {
  'publish-post': publishPost,
};

const worker = new Worker(
  'publish',
  async (job: Job) => {
    const processor = jobProcessors[job.name];
    
    if (!processor) {
      throw new Error(`No processor found for job type: ${job.name}`);
    }

    await processor(job);
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000, // 10 jobs per second
    },
  }
);

worker.on('completed', (job) => {
  logger.info('Worker completed job', { jobId: job.id, name: job.name });
});

worker.on('failed', (job, err) => {
  logger.error('Worker failed job', { 
    jobId: job?.id, 
    name: job?.name,
    error: err.message,
    stack: err.stack 
  });
});

worker.on('error', (err) => {
  logger.error('Worker error', { error: err.message, stack: err.stack });
});

// Health check endpoint
if (process.env.ENABLE_HEALTH_CHECK === 'true') {
  import('http').then(({ createServer }) => {
    const server = createServer((req, res) => {
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'ok', 
          timestamp: new Date().toISOString(),
          worker: 'running' 
        }));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    const port = process.env.HEALTH_CHECK_PORT || 3001;
    server.listen(port, () => {
      logger.info(`Health check server listening on port ${port}`);
    });
  });
}

logger.info('Worker started', { 
  concurrency: 5,
  queue: 'publish',
  redis: process.env.REDIS_URL?.replace(/:\/\/.*@/, '://***@') // Hide credentials
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down worker...');
  await worker.close();
  await connection.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down worker...');
  await worker.close();
  await connection.quit();
  process.exit(0);
});
