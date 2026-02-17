import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { readFile, unlink } from 'fs/promises';

const execAsync = promisify(exec);

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `autoblogger-${timestamp}.sql.gz`;
  const bucket = process.env.BACKUP_BUCKET!;
  
  console.log(`[${new Date().toISOString()}] Starting database backup: ${filename}`);

  try {
    // Create pg_dump with compression
    const dumpCommand = `pg_dump "${process.env.DATABASE_URL}" | gzip > /tmp/${filename}`;
    
    console.log('Creating database dump...');
    await execAsync(dumpCommand);
    console.log('Database dump created successfully');

    // Read the backup file
    const fileBuffer = await readFile(`/tmp/${filename}`);
    console.log(`Backup file size: ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Upload to S3
    console.log('Uploading to S3...');
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: `database/${filename}`,
      Body: fileBuffer,
      ContentType: 'application/gzip',
      Metadata: {
        'backup-type': 'daily',
        'environment': process.env.NODE_ENV || 'unknown',
        'created-at': new Date().toISOString(),
      },
    }));

    console.log(`Backup uploaded successfully: s3://${bucket}/database/${filename}`);

    // Cleanup local file
    await unlink(`/tmp/${filename}`);
    console.log('Local backup file cleaned up');

    // Prune old backups
    await pruneOldBackups(bucket);

    console.log(`[${new Date().toISOString()}] Backup completed successfully`);
    
    return { filename, size: fileBuffer.length };
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
}

async function pruneOldBackups(bucket: string) {
  console.log('Pruning old backups...');
  
  const retentionConfig = {
    daily: 30,
    weekly: 12,
    monthly: 12,
  };

  const response = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: 'database/',
  }));

  if (!response.Contents) return;

  const backups = response.Contents
    .filter(obj => obj.Key?.endsWith('.sql.gz'))
    .sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0));

  const now = new Date();
  const toDelete: string[] = [];

  // Keep track of backups by type
  let dailyCount = 0;
  let weeklyCount = 0;
  let monthlyCount = 0;

  for (const backup of backups) {
    const key = backup.Key!;
    const age = (now.getTime() - (backup.LastModified?.getTime() || 0)) / (1000 * 60 * 60 * 24);
    
    if (age <= 7) {
      // Keep daily backups for the last 7 days
      if (dailyCount >= retentionConfig.daily) {
        toDelete.push(key);
      } else {
        dailyCount++;
      }
    } else if (age <= 30) {
      // Keep weekly backups for the last month
      if (weeklyCount >= retentionConfig.weekly) {
        toDelete.push(key);
      } else {
        weeklyCount++;
      }
    } else {
      // Keep monthly backups
      if (monthlyCount >= retentionConfig.monthly) {
        toDelete.push(key);
      } else {
        monthlyCount++;
      }
    }
  }

  // Delete old backups
  for (const key of toDelete) {
    console.log(`Deleting old backup: ${key}`);
    await s3.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }));
  }

  console.log(`Pruned ${toDelete.length} old backups`);
}

// Run backup
backupDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Backup script failed:', error);
    process.exit(1);
  });
