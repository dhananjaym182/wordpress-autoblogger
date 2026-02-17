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

### 2. Install dependencies

```bash
npm install
```

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
NEXTAUTH_SECRET="your-secret-here-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
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
npm run dev
```

This starts:
- Web app on http://localhost:3000

In another terminal, start the worker:
```bash
cd apps/worker
npm run dev
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
npx prisma migrate deploy
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

## Project Structure

```
project-root/
├── apps/
│   ├── web/              # Next.js web application
│   │   ├── src/
│   │   │   ├── app/     # App Router pages and API routes
│   │   │   ├── modules/ # Feature modules (auth, projects, etc.)
│   │   │   ├── lib/     # Shared utilities
│   │   │   └── components/
│   │   │       ├── ui/   # shadcn/ui components
│   │   │       └── layout/
│   │   └── prisma/      # Database schema
│   ├── worker/           # BullMQ worker service
│   └── wp-plugin/       # WordPress plugin
├── packages/
│   └── shared/          # Shared types and constants
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
3. Copy the pairing code
4. In WordPress, go to AutoBlogger > Connection
5. Generate a new pairing code
6. Enter the pairing code in AutoBlogger

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

## Production Deployment

### Web App (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Worker (Railway/Render)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Database (Railway/Render)

1. Create a PostgreSQL instance
2. Get the connection string
3. Update `DATABASE_URL` in environment variables

### Redis (Railway/Render)

1. Create a Redis instance
2. Get the connection string
3. Update `REDIS_URL` in environment variables

## Support

For issues or questions:
- Check the implementation plan: `implimentation_plan.md`
- Open an issue on GitHub
- Contact support@autoblogger.com
