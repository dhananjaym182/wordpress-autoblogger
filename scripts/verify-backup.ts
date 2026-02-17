import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Client } from 'pg';
import { writeFile, unlink } from 'fs/promises';
import { Readable } from 'stream';

const execAsync = promisify(exec);

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function verifyBackup() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting backup verification`);

  try {
    // Download latest backup
    console.log('Downloading latest backup from S3...');
    const response = await s3.send(new GetObjectCommand({
      Bucket: process.env.BACKUP_BUCKET!,
      Key: 'database/latest.sql.gz',
    }));

    if (!response.Body) {
      throw new Error('No backup file found');
    }

    const backupBuffer = await streamToBuffer(response.Body as Readable);
    const backupPath = '/tmp/verify-backup.sql.gz';
    await writeFile(backupPath, backupBuffer);
    console.log(`Downloaded backup: ${(backupBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    // Extract backup
    console.log('Extracting backup...');
    await execAsync(`gunzip -c ${backupPath} > /tmp/verify-backup.sql`);

    // Create test database
    const testDbUrl = process.env.TEST_DATABASE_URL!;
    const client = new Client({ connectionString: testDbUrl });
    
    console.log('Connecting to test database...');
    await client.connect();

    // Drop and recreate schema
    console.log('Resetting test database...');
    await client.query('DROP SCHEMA IF EXISTS public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('GRANT ALL ON SCHEMA public TO postgres');
    await client.query('GRANT ALL ON SCHEMA public TO public');

    // Restore backup
    console.log('Restoring backup...');
    await execAsync(`psql "${testDbUrl}" < /tmp/verify-backup.sql`);

    // Verify data integrity
    console.log('Verifying data integrity...');
    const checks = [
      { name: 'Users', query: 'SELECT COUNT(*) as count FROM "User"' },
      { name: 'Organizations', query: 'SELECT COUNT(*) as count FROM "Organization"' },
      { name: 'Projects', query: 'SELECT COUNT(*) as count FROM "Project"' },
      { name: 'Scheduled Posts', query: 'SELECT COUNT(*) as count FROM "ScheduledPost"' },
      { name: 'WP Connections', query: 'SELECT COUNT(*) as count FROM "WpSiteConnection"' },
    ];

    for (const check of checks) {
      const result = await client.query(check.query);
      console.log(`  ${check.name}: ${result.rows[0].count}`);
    }

    // Check for critical tables
    console.log('Checking critical tables exist...');
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Organization', 'Project', 'ScheduledPost', 'WpSiteConnection')
    `);
    
    const expectedTables = ['User', 'Organization', 'Project', 'ScheduledPost', 'WpSiteConnection'];
    const foundTables = tableCheck.rows.map(r => r.table_name);
    
    for (const table of expectedTables) {
      if (foundTables.includes(table)) {
        console.log(`  ✓ ${table}`);
      } else {
        console.error(`  ✗ ${table} - MISSING`);
        throw new Error(`Critical table ${table} not found in backup`);
      }
    }

    await client.end();

    // Cleanup
    await unlink('/tmp/verify-backup.sql.gz');
    await unlink('/tmp/verify-backup.sql');

    console.log(`[${new Date().toISOString()}] Backup verification completed successfully ✓`);
  } catch (error) {
    console.error('Backup verification failed:', error);
    throw error;
  }
}

verifyBackup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Verification script failed:', error);
    process.exit(1);
  });
