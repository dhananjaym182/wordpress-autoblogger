import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { AutoClient } from '@autoblogger/wp-client';
import { logger } from '../utils/logger.js';
import { generateTraceId } from '../utils/trace.js';
import { decrypt } from '../utils/crypto.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required to initialize worker Prisma client');
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export interface PublishJobData {
  scheduledPostId: string;
}

export async function publishPost(job: Job<PublishJobData>): Promise<void> {
  const { scheduledPostId } = job.data;
  const traceId = generateTraceId();
  
  logger.info('Starting publish job', { scheduledPostId, traceId, jobId: job.id });

  // Create JobRun record
  const jobRun = await prisma.jobRun.create({
    data: {
      scheduledPostId,
      jobId: job.id,
      traceId,
      status: 'running',
      startedAt: new Date(),
    },
  });

  const startTime = Date.now();

  try {
    // Load post with all related data
    const post = await prisma.scheduledPost.findUnique({
      where: { id: scheduledPostId },
      include: {
        project: {
          include: {
            organization: true,
            wpConnection: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error(`Scheduled post not found: ${scheduledPostId}`);
    }

    if (!post.project.wpConnection) {
      throw new Error('WordPress connection not configured for this project');
    }

    const { project } = post;
    const { wpConnection } = project;
    const { organization } = project;

    // Ensure featured image
    let mediaId = post.wpMediaId;
    if (!mediaId && post.storedImageKey) {
      logger.info('Importing featured image', { traceId, storedImageKey: post.storedImageKey });
      
      const wpClient = createWPClient(wpConnection as any);
      const imageUrl = `${process.env.CDN_URL}/${post.storedImageKey}`;
      
      const importResult = await wpClient.importMedia({
        sourceUrl: imageUrl,
        filename: post.storedImageKey.split('/').pop() || 'featured-image.jpg',
        alt: post.title,
      });
      
      mediaId = importResult.mediaId;
      
      // Update post with media ID
      await prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: { wpMediaId: mediaId },
      });
    }

    // Check plan limits
    let publishStatus = post.desiredStatus;
    if (organization.planId === 'free' && publishStatus === 'publish') {
      logger.info('Free tier user - forcing draft status', { traceId, orgId: organization.id });
      publishStatus = 'draft';
    }

    // Check monthly publish limit
    const planLimits: Record<string, number> = {
      free: 0, // Free tier can't auto-publish
      starter: 30,
      pro: 120,
    };

    const monthlyLimit = planLimits[organization.planId] || 0;
    if (organization.publishesThisMonth >= monthlyLimit && publishStatus === 'publish') {
      logger.warn('Monthly publish limit reached', { 
        traceId, 
        orgId: organization.id,
        limit: monthlyLimit,
        current: organization.publishesThisMonth 
      });
      publishStatus = 'draft';
    }

    // Publish to WordPress
    logger.info('Publishing to WordPress', {
      traceId,
      wpSite: wpConnection?.siteUrl,
      status: publishStatus
    });

    const wpClient = createWPClient(wpConnection as any);
    
    // Ensure categories and tags exist
    const terms = await wpClient.ensureTerms({
      categories: post.categories,
      tags: post.tags,
    });

    const wpResult = await wpClient.upsertPost({
      externalId: post.externalId,
      title: post.title,
      content: post.gutenbergHtml || '',
      status: publishStatus as 'draft' | 'publish' | 'future',
      dateGmt: post.scheduledAt?.toISOString(),
      slug: post.slug || undefined,
      categories: terms.categories.map(c => c.name),
      tags: terms.tags.map(t => t.name),
      featuredMediaId: mediaId || undefined,
      seo: {
        metaTitle: post.metaTitle || undefined,
        metaDescription: post.metaDescription || undefined,
        focusKeyword: post.focusKeyword || undefined,
      },
    });

    const durationMs = Date.now() - startTime;

    // Update post record
    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: {
        status: 'published',
        wpPostId: wpResult.postId,
        wpEditUrl: wpResult.editUrl,
        publishedAt: new Date(),
        attemptCount: { increment: 1 },
        lastAttemptAt: new Date(),
      },
    });

    // Update JobRun
    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: {
        status: 'completed',
        finishedAt: new Date(),
        durationMs,
        wpResponseCode: 200,
        wpResponseSummary: {
          postId: wpResult.postId,
          status: wpResult.status,
          editUrl: wpResult.editUrl,
        },
      },
    });

    // Increment usage counter if actually published
    if (publishStatus === 'publish') {
      await prisma.organization.update({
        where: { id: organization.id },
        data: { publishesThisMonth: { increment: 1 } },
      });
    }

    logger.info('Publish job completed', { 
      traceId, 
      scheduledPostId,
      wpPostId: wpResult.postId,
      durationMs 
    });

  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    logger.error('Publish job failed', { 
      traceId, 
      scheduledPostId, 
      error: errorMessage,
      stack: errorStack 
    });

    // Update JobRun with error
    await prisma.jobRun.update({
      where: { id: jobRun.id },
      data: {
        status: 'failed',
        finishedAt: new Date(),
        durationMs,
        errorMessage,
        errorStack,
      },
    });

    // Update post with error
    await prisma.scheduledPost.update({
      where: { id: scheduledPostId },
      data: {
        status: 'failed',
        attemptCount: { increment: 1 },
        lastAttemptAt: new Date(),
        lastError: errorMessage,
      },
    });

    throw error;
  }
}

function createWPClient(wpConnection: {
  mode: string;
  siteUrl: string;
  keyId?: string | null;
  secretEncrypted?: string | null;
  wpUsername?: string | null;
  appPasswordEncrypted?: string | null;
}) {
  const credentials = {
    siteUrl: wpConnection.siteUrl,
    mode: wpConnection.mode as 'plugin' | 'app_password',
  };

  if (wpConnection.mode === 'plugin' && wpConnection.keyId && wpConnection.secretEncrypted) {
    return new AutoClient({
      ...credentials,
      keyId: wpConnection.keyId,
      secret: decrypt(wpConnection.secretEncrypted),
    });
  }

  if (wpConnection.mode === 'app_password' && wpConnection.wpUsername && wpConnection.appPasswordEncrypted) {
    return new AutoClient({
      ...credentials,
      username: wpConnection.wpUsername,
      appPassword: decrypt(wpConnection.appPasswordEncrypted),
    });
  }

  throw new Error('Invalid WordPress connection configuration');
}
