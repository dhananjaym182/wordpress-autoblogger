# AutoBlogger

AI-powered WordPress autoblogging SaaS platform. Generate, schedule, and publish high-quality blog posts automatically with AI.

## Features

- **Multi-tenant SaaS**: Organizations, team members, role-based access control
- **WordPress Integration**: Custom plugin with HMAC authentication + Application Password fallback
- **AI Content Generation**: Multiple providers (OpenAI, Anthropic) with fallback chains and circuit breakers
- **Smart Scheduling**: Calendar-based publishing with BullMQ job queue
- **Featured Images**: AI generation, user upload, or URL import (required)
- **Bring Your Own Keys**: Use your own AI API keys with provider fallback chains
- **SEO Optimization**: Built-in SEO analyzer with scoring and suggestions
- **Content Quality Gates**: Profanity filter, AI safety checks, quality validation
- **Content Moderation**: OpenAI Moderation API integration for safety
- **Billing & Plans**: Free, Starter ($29/mo), Pro ($99/mo) tiers
- **Observability**: Comprehensive logging, Sentry error tracking, PostHog analytics
- **GDPR Compliance**: Cookie consent, data export, right to erasure
- **Security**: SSRF protection, rate limiting, audit logging, encrypted secrets

## Tech Stack

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- TanStack Query

### Backend
- Next.js API Routes / Server Actions
- Prisma ORM
- PostgreSQL 15+
- Redis 7+ (BullMQ, rate limiting, caching)
- Better Auth (authentication)

### Worker
- Node.js TypeScript
- BullMQ (job queue)
- Complete job processing with retry logic

### WordPress Plugin
- PHP 7.4+
- WordPress 6.0+
- Custom REST endpoints with HMAC authentication

### Shared Packages
- **@autoblogger/ai-gateway**: AI provider management with fallback chains
- **@autoblogger/wp-client**: WordPress client with HMAC and app password support
- **@autoblogger/security**: Security utilities (SSRF, sanitization, audit logs)
- **@autoblogger/shared**: Shared types and constants

### Infrastructure
- Vercel (web app)
- Railway/Render (worker + Redis)
- AWS S3/Cloudflare R2 (object storage)
- Stripe (billing)
- Sentry (error tracking)
- PostHog (analytics)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm 9+

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd autoblogger
```

2. Install dependencies and build packages:
```bash
npm install
```

3. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env
cp apps/worker/.env.example apps/worker/.env
# Edit with your values
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Start the development servers:
```bash
# Terminal 1 - Web app
npm run dev:web

# Terminal 2 - Worker
npm run dev:worker
```

The web app will be available at `http://localhost:3000`.

For detailed setup instructions, see [GETTING_STARTED.md](./GETTING_STARTED.md).

## Development

### Available Scripts

- `npm run dev:web` - Start web development server
- `npm run dev:worker` - Start worker development server
- `npm run build` - Build all packages and apps
- `npm run build:packages` - Build shared packages
- `npm run lint` - Run linter
- `npm run test` - Run tests
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run backup` - Run database backup
- `npm run backup:verify` - Verify backup integrity

### Project Structure

```
project-root/
├── apps/
│   ├── web/                    # Next.js SaaS application
│   ├── worker/                 # BullMQ worker service
│   └── wp-plugin/              # WordPress plugin
├── packages/
│   ├── shared/                 # Shared types and schemas
│   ├── ai-gateway/             # AI provider gateway with fallback
│   ├── wp-client/              # WordPress client library
│   └── security/               # Security utilities
├── scripts/                    # Utility scripts (backups)
├── docs/                       # Documentation
│   ├── API.md                  # API documentation
│   └── DISASTER_RECOVERY.md    # Disaster recovery plan
├── .github/workflows/          # CI/CD pipelines
├── implimentation_plan.md      # Detailed implementation plan
└── PROGRESS.md                 # Implementation progress
```

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User, Session, Account**: Authentication
- **Organization, OrganizationMember**: Multi-tenancy
- **Project, WpSiteConnection**: WordPress connections
- **ScheduledPost, ContentTemplate**: Content management
- **AiEndpoint, AiFallbackPolicy**: AI provider configuration
- **JobRun**: Job execution tracking
- **AuditLog, RateLimitLog**: Security and compliance

See `apps/web/prisma/schema.prisma` for the complete schema.

## WordPress Plugin

The WordPress plugin is located in `apps/wp-plugin/`. It provides:
- Secure HMAC-authenticated REST API endpoints
- Application Password fallback
- Post upsert, media import, and terms management
- Diagnostics panel
- Auto-updater mechanism

## Security

- Multi-tenant isolation enforced server-side
- Secrets encrypted at rest (AES-256-GCM)
- HMAC request signing with timestamp/nonce replay protection
- Rate limiting on all endpoints (Redis-based)
- SSRF protection on outbound requests
- Content moderation (OpenAI Moderation API + profanity filter)
- GDPR compliance (cookie consent, data export, right to erasure)
- Audit logging for sensitive actions
- Input sanitization and validation

## Billing

Stripe is used for billing with three tiers:
- **Free**: 1 project, 10 drafts/month, no auto-publish
- **Starter** ($29/mo): 3 projects, 30 publishes/month, BYOK
- **Pro** ($99/mo): 10 projects, 120 publishes/month, advanced features

## Backup & Disaster Recovery

- **Database**: Daily automated backups with 30-day retention
- **Verification**: Monthly backup restoration tests
- **DR Plan**: Documented procedures for various failure scenarios
- **RTO**: 4 hours, **RPO**: 1 hour

See [docs/DISASTER_RECOVERY.md](./docs/DISASTER_RECOVERY.md) for details.

## CI/CD

GitHub Actions workflows:
- **CI**: Lint, type check, test on PR/push
- **Backup**: Automated daily database backups

## API Documentation

REST API with webhooks for integrations. See [docs/API.md](./docs/API.md) for:
- Authentication
- Endpoints reference
- Webhook events
- SDK examples (TypeScript, Python)
- Error codes

## Documentation

- **Implementation Plan**: `implimentation_plan.md` - Complete 16-week implementation plan
- **Progress**: `PROGRESS.md` - Current implementation status
- **Getting Started**: `GETTING_STARTED.md` - Development setup guide
- **API Docs**: `docs/API.md` - API reference
- **Disaster Recovery**: `docs/DISASTER_RECOVERY.md` - Recovery procedures

## License

MIT

## Support

For support, email support@autoblogger.com or open an issue on GitHub.
