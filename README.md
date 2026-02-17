# AutoBlogger

AI-powered WordPress autoblogging SaaS platform. Generate, schedule, and publish high-quality blog posts automatically with AI.

## Features

- **Multi-tenant SaaS**: Organizations, team members, role-based access control
- **WordPress Integration**: Custom plugin with HMAC authentication + Application Password fallback
- **AI Content Generation**: Multiple providers (OpenAI, Anthropic, OpenRouter) with fallback chains
- **Smart Scheduling**: Calendar-based publishing with BullMQ job queue
- **Featured Images**: AI generation, user upload, or URL import (required)
- **Bring Your Own Keys**: Use your own AI API keys with provider fallback chains
- **SEO Optimization**: Built-in SEO analyzer with scoring and suggestions
- **Content Quality Gates**: Profanity filter, AI safety checks, quality validation
- **Billing & Plans**: Free, Starter ($29/mo), Pro ($99/mo) tiers
- **Observability**: Comprehensive logging, monitoring, and diagnostics

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

### Worker
- Node.js TypeScript
- BullMQ (job queue)

### WordPress Plugin
- PHP 7.4+
- WordPress 6.0+
- Custom REST endpoints

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

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd autoblogger
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env with your values
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The web app will be available at `http://localhost:3000`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run test` - Run tests
- `npm run typecheck` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
project-root/
├── apps/
│   ├── web/                    # Next.js SaaS application
│   ├── worker/                 # BullMQ worker service
│   └── wp-plugin/              # WordPress plugin
├── packages/
│   ├── shared/                 # Shared types and schemas
│   ├── ai-gateway/             # AI provider gateway
│   ├── wp-client/              # WordPress client
│   └── security/               # Security utilities
└── implimentation_plan.md      # Detailed implementation plan
```

## Database Schema

The application uses Prisma ORM with PostgreSQL. See `apps/web/prisma/schema.prisma` for the complete schema.

## WordPress Plugin

The WordPress plugin is located in `apps/wp-plugin/`. It provides:
- Secure HMAC-authenticated REST API endpoints
- Application Password fallback
- Auto-updater mechanism
- Diagnostics panel

## Billing

Stripe is used for billing with three tiers:
- **Free**: 1 project, 10 drafts/month, no auto-publish
- **Starter** ($29/mo): 3 projects, 30 publishes/month, BYOK
- **Pro** ($99/mo): 10 projects, 120 publishes/month, advanced features

## Security

- Multi-tenant isolation enforced server-side
- Secrets encrypted at rest (AES-256-GCM)
- HMAC request signing with replay protection
- Rate limiting on all endpoints
- SSRF protection on outbound requests
- Content moderation (AI safety + profanity filter)
- GDPR compliance (data export, right to erasure)

## Implementation Plan

See `implimentation_plan.md` for the complete implementation plan with all phases and detailed instructions.

## License

MIT

## Support

For support, email support@autoblogger.com or open an issue on GitHub.
