# Getting Started with AutoBlogger

This guide will help you set up and run the AutoBlogger application locally for development.

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 15+
- Redis 7+
- Docker and Docker Compose (recommended)

## Quick Start with Docker Compose

### 1. Start the infrastructure services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- MinIO (S3-compatible storage) on ports 9000 and 9001

### 2. Install dependencies and build packages

```bash
npm install
```

This will automatically build the shared packages after installation.

### 3. Set up environment variables

```bash
cp apps/web/.env.example apps/web/.env
cp apps/worker/.env.example apps/worker/.env
```

Edit the `.env` files with your configuration. At minimum, you need:

**apps/web/.env:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autoblogger"
REDIS_URL="redis://localhost:6379"
BETTER_AUTH_SECRET="your-secret-here-min-32-chars"
ENCRYPTION_KEY="your-32-byte-encryption-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**apps/worker/.env:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/autoblogger"
REDIS_URL="redis://localhost:6379"
ENCRYPTION_KEY="your-32-byte-encryption-key-here"
```

### 4. Initialize the database

```bash
npm run db:generate
npm run db:push
```

### 5. Start the development servers

In one terminal:
```bash
npm run dev:web
```

In another terminal, start the worker:
```bash
npm run dev:worker
```

## Manual Setup (Without Docker)

### PostgreSQL

Install and start PostgreSQL 15+:

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-15
sudo service postgresql start
```

Create the database:
```bash
psql -U postgres
CREATE DATABASE autoblogger;
\q
```

### Redis

Install and start Redis 7+:

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

## Development Workflow

### Building Packages

```bash
# Build all packages
npm run build:packages

# Or build individually:
cd packages/ai-gateway && npm run build
cd packages/wp-client && npm run build
cd packages/security && npm run build
cd packages/shared && npm run build
```

### Database Migrations

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database (dev only)
npm run db:push

# Create a migration
cd apps/web
npx prisma migrate dev --name your_migration_name

# Deploy migrations to production
npm run db:deploy
```

### Prisma Studio

Open the database GUI:
```bash
npm run db:studio
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for a specific package
cd apps/web
npm run test

# Run tests with coverage
npm run test:coverage
```

### Type Checking

```bash
# Type check all packages
npm run typecheck

# Type check specific package
cd apps/web
npm run typecheck
```

### Linting

```bash
# Lint all packages
npm run lint

# Lint specific package
cd apps/web
npm run lint
```

### Backup Operations

```bash
# Run database backup manually
npm run backup

# Verify backup integrity
npm run backup:verify
```

## Project Structure

```
project-root/
├── apps/
│   ├── web/                      # Next.js web application
│   │   ├── src/
│   │   │   ├── app/             # App Router pages and API routes
│   │   │   ├── modules/         # Feature modules (auth, projects, etc.)
│   │   │   ├── lib/             # Shared utilities
│   │   │   └── components/
│   │   │       ├── ui/          # shadcn/ui components
│   │   │       ├── custom/      # Custom components (cookie-consent, etc.)
│   │   │       └── layout/      # Layout components
│   │   └── prisma/              # Database schema
│   ├── worker/                   # BullMQ worker service
│   │   ├── src/
│   │   │   ├── jobs/            # Job processors
│   │   │   └── utils/           # Utilities
│   │   └── package.json
│   └── wp-plugin/               # WordPress plugin
├── packages/
│   ├── shared/                  # Shared types and constants
│   ├── ai-gateway/              # AI provider gateway
│   │   ├── src/
│   │   │   ├── providers/       # OpenAI, Anthropic providers
│   │   │   ├── gateway.ts       # Main gateway class
│   │   │   └── circuit-breaker.ts
│   │   └── package.json
│   ├── wp-client/               # WordPress client library
│   │   ├── src/
│   │   │   ├── plugin-client.ts # HMAC authentication client
│   │   │   ├── core-client.ts   # Application password client
│   │   │   └── auto-client.ts   # Auto-detect client
│   │   └── package.json
│   └── security/                # Security utilities
│       ├── src/
│       │   ├── ssrf-guard.ts    # SSRF protection
│       │   ├── sanitize.ts      # Input sanitization
│       │   └── audit-log.ts     # Audit logging
│       └── package.json
├── scripts/                     # Utility scripts
│   ├── backup-database.ts       # Database backup script
│   └── verify-backup.ts         # Backup verification
├── docs/                        # Documentation
│   ├── API.md                   # API documentation
│   └── DISASTER_RECOVERY.md     # Disaster recovery plan
├── .github/
│   └── workflows/               # CI/CD workflows
│       ├── ci.yml               # Continuous integration
│       └── backup.yml           # Automated backups
├── docker-compose.yml
├── package.json
└── turbo.json
```

## WordPress Plugin

The WordPress plugin is in `apps/wp-plugin/autoblogger-integration/`.

### Installing the Plugin

1. Navigate to the plugin directory:
```bash
cd apps/wp-plugin
```

2. Create a zip file:
```bash
zip -r autoblogger-integration.zip autoblogger-integration/
```

3. Upload the zip to your WordPress site:
   - Go to WordPress Admin > Plugins > Add New
   - Click "Upload Plugin"
   - Select `autoblogger-integration.zip`
   - Click "Install Now" and activate

### Connecting WordPress

1. In AutoBlogger, create a project
2. Click "Connect WordPress"
3. Choose connection method:
   - **Plugin (Recommended):** Install the AutoBlogger plugin on your WordPress site and use the pairing code
   - **Application Password:** Use WordPress application password for authentication
4. Follow the connection wizard

## Working with Packages

### AI Gateway Package

The AI gateway provides unified access to multiple AI providers with fallback support:

```typescript
import { AIGateway } from '@autoblogger/ai-gateway';

const gateway = new AIGateway(
  providers,
  { text: ['openai', 'anthropic'], image: ['openai'] },
  { retries: 2, timeoutMs: 30000, backoff: 'exponential' }
);

const result = await gateway.generateText({
  prompt: 'Write a blog post about TypeScript',
  orgId: 'org_123',
});
```

### WordPress Client Package

The WordPress client provides secure communication with WordPress sites:

```typescript
import { AutoClient } from '@autoblogger/wp-client';

const client = new AutoClient({
  siteUrl: 'https://example.com',
  mode: 'plugin',
  keyId: 'key_123',
  secret: 'secret_key',
});

await client.upsertPost({
  externalId: 'post_123',
  title: 'My Post',
  content: '<!-- wp:paragraph -->...',
  status: 'publish',
});
```

### Security Package

Security utilities for the application:

```typescript
import { validateUrl, containsProfanity } from '@autoblogger/security';

// SSRF protection
const validation = await validateUrl(url, 'production');
if (!validation.valid) {
  throw new Error(validation.reason);
}

// Content moderation
if (containsProfanity(content)) {
  throw new Error('Content contains inappropriate language');
}
```

## Common Issues

### Database Connection Failed

Make sure PostgreSQL is running and the `DATABASE_URL` is correct:
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Test connection
psql postgresql://postgres:postgres@localhost:5432/autoblogger
```

### Redis Connection Failed

Make sure Redis is running:
```bash
# Check if Redis is running
redis-cli ping
```

### Port Already in Use

If port 3000 is already in use, you can change it:
```bash
# In apps/web/package.json, modify the dev script:
"dev": "next dev -p 3001"
```

### Package Build Errors

If you see import errors from packages:
```bash
# Rebuild all packages
npm run build:packages

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Worker Not Processing Jobs

1. Check Redis connection:
```bash
redis-cli ping
```

2. Verify worker is running:
```bash
ps aux | grep worker
```

3. Check worker logs for errors

## Production Deployment

### Web App (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `ENCRYPTION_KEY`
   - `BETTER_AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_SENTRY_DSN` (optional)
   - `NEXT_PUBLIC_POSTHOG_KEY` (optional)
3. Deploy

### Worker (Railway/Render)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy as a worker service (not web service)

### Database (Railway/Render)

1. Create a PostgreSQL instance
2. Get the connection string
3. Update `DATABASE_URL` in environment variables

### Redis (Railway/Render)

1. Create a Redis instance
2. Get the connection string
3. Update `REDIS_URL` in environment variables

## Additional Resources

- **Implementation Plan:** `implimentation_plan.md` - Comprehensive implementation guide
- **Progress Tracking:** `PROGRESS.md` - Current implementation status
- **API Documentation:** `docs/API.md` - API reference and examples
- **Disaster Recovery:** `docs/DISASTER_RECOVERY.md` - Recovery procedures

## Support

For issues or questions:
- Check the implementation plan: `implimentation_plan.md`
- Review the progress document: `PROGRESS.md`
- Open an issue on GitHub
- Contact support@autoblogger.com
