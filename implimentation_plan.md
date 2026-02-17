## Executive Summary

A multi-tenant SaaS for AI-powered WordPress autoblogging with secure plugin integration, scheduled publishing, and comprehensive quality controls. This plan integrates all optimizations including content quality gates, SEO optimization, observability, abuse prevention, and production deployment strategies.

***

## Pre-Phase 0.05: Brand Identity & Color Palette

### Goal: Define complete brand identity before any UI development

### Brand Color System

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Brand Colors - Modern SaaS Blue (Recommended for AutoBlogging)
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Primary
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        
        // Semantic Colors
        success: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        warning: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        danger: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
        
        // Neutral (Zinc base)
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
    },
  },
};
```

### Alternative Color Palettes (Choose ONE)

| Palette | Primary | Vibe | Best For |
|---------|---------|------|----------|
| **Tech Blue** | `#3b82f6` | Professional, trustworthy | Corporate/Enterprise |
| **Growth Green** | `#10b981` | Fresh, growth-focused | Content marketing |
| **Creative Purple** | `#8b5cf6` | Modern, creative | Creative agencies |
| **Bold Orange** | `#f97316` | Energetic, bold | Startups |

**Recommendation:** Use **Tech Blue (#3b82f6)** - it's professional, accessible, and widely accepted in SaaS.

### Typography

- **UI Font:** Inter (clean, modern, highly readable)
- **Heading Font:** Fraunces (distinctive, editorial feel)
- **Code Font:** JetBrains Mono (for technical content)

### shadcn Configuration

```json
// components.json
{
  "style": "new-york",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "blue",  // ← Change from "zinc" to "blue"
    "cssVariables": true
  }
}
```

### CSS Variables (globals.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --primary: 221 83% 53%;      /* Blue #3b82f6 */
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 221 83% 53%;
  }
  
  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --primary: 217 91% 60%;      /* Lighter blue for dark mode */
    --primary-foreground: 222 47% 11%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 217 91% 60%;
  }
}
```

### Brand Assets Checklist

- [ ] Logo (SVG + PNG) - Primary and monochrome versions
- [ ] Favicon (16x16, 32x32, 180x180 for Apple Touch Icon)
- [ ] Social share images (Open Graph 1200x630, Twitter 1200x600)
- [ ] Email header image (600x200)
- [ ] Loading spinner animation (brand color)

### Tasks

1. **Define brand colors** - Use Blue #3b82f6 as primary
2. **Create logo** - Figma or hire designer ($50 on Fiverr)
3. **Set up typography** - Inter for UI, Fraunces for headings
4. **Design favicon** - Simple, recognizable at small sizes
5. **Create social share images** - For SEO and social sharing

### Deliverables

- ✅ Brand color system defined
- ✅ Typography configured
- ✅ Logo created
- ✅ Favicon and social images created
- ✅ CSS variables set up

### Time Estimate: 4-6 hours

***

## Product Specification

### Core Features

- **Multi-tenant SaaS**: Organizations, team members, role-based access
- **WordPress Integration**: Custom plugin (HMAC-secured) + Application Password fallback
- **Content Creation**: AI-generated content with quality gates and SEO optimization
- **Scheduling**: Calendar-based publishing with BullMQ job queue
- **Featured Images**: AI generation, user upload, or URL import (required)
- **AI Flexibility**: BYOK (Bring Your Own Key) with provider fallback chains
- **Observability**: Comprehensive logging, monitoring, and diagnostics


### Business Model

| Tier | Projects | Publishes/Month | Auto-Publish | BYOK | Featured Images | SEO Tools |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| **Free** | 1 | 10 drafts | ❌ Draft only | ❌ | Required | Basic |
| **Starter** | 3 | 30 | ✅ | ✅ | Required | Advanced |
| **Pro** | 10 | 120 | ✅ | ✅ | Required | Advanced + Templates |


***

## Technical Architecture

### Tech Stack

```yaml
Frontend:
  - Next.js 14+ (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui + Radix UI
  - TanStack Query (React Query)

Backend:
  - Next.js API Routes / Server Actions
  - Prisma ORM
  - PostgreSQL 15+
  - Redis 7+ (BullMQ, rate limiting, caching)

Worker:
  - Node.js TypeScript
  - BullMQ (job queue)
  - Separate deployable service

WordPress Plugin:
  - PHP 7.4+
  - WordPress 6.0+
  - Custom REST endpoints

Infrastructure:
  - Vercel (web app)
  - Railway/Render (worker + Redis)
  - AWS S3/Cloudflare R2 (object storage)
  - Sentry (error tracking)
  - PostHog (product analytics)

External Services:
  - Stripe (billing)
  - Mailjet/Brevo (transactional email)
  - OpenAI/Anthropic/OpenRouter (AI providers)
  - Turnstile/hCaptcha (bot protection)
```


***

## Monorepo Structure (Complete)

```
project-root/
├── apps/
│   ├── web/                          # Next.js SaaS application
│   │   ├── src/
│   │   │   ├── app/                  # App Router routes
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   └── verify-email/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── projects/
│   │   │   │   │   ├── planner/
│   │   │   │   │   ├── content/
│   │   │   │   │   ├── billing/
│   │   │   │   │   └── settings/
│   │   │   │   ├── api/
│   │   │   │   │   ├── webhooks/
│   │   │   │   │   │   └── stripe/
│   │   │   │   │   └── health/
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── modules/              # Vertical slice modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   │   ├── SignupForm.tsx
│   │   │   │   │   │   └── VerifyEmailBanner.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── login.ts
│   │   │   │   │   │   ├── signup.ts
│   │   │   │   │   │   └── verify-email.ts
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useAuth.ts
│   │   │   │   │   ├── lib/
│   │   │   │   │   │   └── better-auth.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │       └── auth.schema.ts
│   │   │   │   │
│   │   │   │   ├── org/              # Organization management
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── OrgSwitcher.tsx
│   │   │   │   │   │   ├── MemberList.tsx
│   │   │   │   │   │   └── InviteForm.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── create-org.ts
│   │   │   │   │   │   ├── invite-member.ts
│   │   │   │   │   │   └── remove-member.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │
│   │   │   │   ├── projects/         # Project CRUD + limits
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ProjectList.tsx
│   │   │   │   │   │   ├── ProjectCard.tsx
│   │   │   │   │   │   ├── CreateProjectDialog.tsx
│   │   │   │   │   │   └── ProjectSettings.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── create-project.ts
│   │   │   │   │   │   ├── update-project.ts
│   │   │   │   │   │   └── delete-project.ts
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useProjectLimits.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │
│   │   │   │   ├── billing/          # Stripe integration
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── PricingTable.tsx
│   │   │   │   │   │   ├── CurrentPlan.tsx
│   │   │   │   │   │   ├── UsageMetrics.tsx
│   │   │   │   │   │   └── UpgradeButton.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── create-checkout.ts
│   │   │   │   │   │   ├── create-portal.ts
│   │   │   │   │   │   └── handle-webhook.ts
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useSubscription.ts
│   │   │   │   │   └── lib/
│   │   │   │   │       └── stripe.ts
│   │   │   │   │
│   │   │   │   ├── wp/               # WordPress integration
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ConnectWPDialog.tsx
│   │   │   │   │   │   ├── PluginConnectForm.tsx
│   │   │   │   │   │   ├── AppPasswordForm.tsx
│   │   │   │   │   │   ├── ConnectionStatus.tsx
│   │   │   │   │   │   ├── DiagnosticsPanel.tsx
│   │   │   │   │   │   └── ErrorSuggestions.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── connect-plugin.ts
│   │   │   │   │   │   ├── connect-fallback.ts
│   │   │   │   │   │   ├── test-connection.ts
│   │   │   │   │   │   └── disconnect.ts
│   │   │   │   │   ├── lib/
│   │   │   │   │   │   ├── wp-client.ts
│   │   │   │   │   │   ├── hmac-signer.ts
│   │   │   │   │   │   └── wp-errors.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │
│   │   │   │   ├── content/          # Content creation + editor
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ContentEditor.tsx
│   │   │   │   │   │   ├── MarkdownEditor.tsx
│   │   │   │   │   │   ├── PreviewPanel.tsx
│   │   │   │   │   │   ├── SEOPanel.tsx
│   │   │   │   │   │   ├── FeaturedImagePicker.tsx
│   │   │   │   │   │   ├── CategoryTagSelector.tsx
│   │   │   │   │   │   └── ContentTemplates.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── generate-outline.ts
│   │   │   │   │   │   ├── generate-content.ts
│   │   │   │   │   │   ├── improve-seo.ts
│   │   │   │   │   │   ├── save-draft.ts
│   │   │   │   │   │   └── publish-now.ts
│   │   │   │   │   ├── lib/
│   │   │   │   │   │   ├── markdown-to-gutenberg.ts
│   │   │   │   │   │   ├── seo-analyzer.ts
│   │   │   │   │   │   ├── content-quality-gates.ts
│   │   │   │   │   │   └── readability-scorer.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │
│   │   │   │   ├── planner/          # Calendar + scheduling
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── CalendarView.tsx
│   │   │   │   │   │   ├── ScheduleDialog.tsx
│   │   │   │   │   │   ├── PostCard.tsx
│   │   │   │   │   │   └── BulkActions.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── schedule-post.ts
│   │   │   │   │   │   ├── reschedule.ts
│   │   │   │   │   │   ├── cancel-schedule.ts
│   │   │   │   │   │   └── bulk-schedule.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │
│   │   │   │   ├── ai/               # AI provider management
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ProviderList.tsx
│   │   │   │   │   │   ├── AddProviderDialog.tsx
│   │   │   │   │   │   ├── FallbackChainEditor.tsx
│   │   │   │   │   │   ├── TestConnectionButton.tsx
│   │   │   │   │   │   └── UsageStats.tsx
│   │   │   │   │   ├── actions/
│   │   │   │   │   │   ├── add-provider.ts
│   │   │   │   │   │   ├── test-provider.ts
│   │   │   │   │   │   ├── update-fallback-chain.ts
│   │   │   │   │   │   └── delete-provider.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │
│   │   │   │   └── jobs/             # Job monitoring
│   │   │   │       ├── components/
│   │   │   │       │   ├── JobLogsList.tsx
│   │   │   │       │   ├── JobDetailsDialog.tsx
│   │   │   │       │   ├── RetryButton.tsx
│   │   │   │       │   └── JobFilters.tsx
│   │   │   │       ├── actions/
│   │   │   │       │   ├── get-job-logs.ts
│   │   │   │       │   └── retry-job.ts
│   │   │   │       └── schemas/
│   │   │   │
│   │   │   ├── components/           # Shared UI components
│   │   │   │   ├── ui/               # shadcn components ONLY
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── calendar.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   └── ... (other shadcn components)
│   │   │   │   │
│   │   │   │   └── layout/
│   │   │   │       ├── AppShell.tsx
│   │   │   │       ├── Sidebar.tsx
│   │   │   │       ├── Topbar.tsx
│   │   │   │       ├── PageHeader.tsx
│   │   │   │       └── Footer.tsx
│   │   │   │
│   │   │   ├── lib/                  # Shared utilities
│   │   │   │   ├── db.ts             # Prisma client
│   │   │   │   ├── redis.ts          # Redis client
│   │   │   │   ├── env.ts            # Environment validation (zod)
│   │   │   │   ├── crypto.ts         # Encryption helpers
│   │   │   │   ├── rate-limit.ts     # Rate limiting
│   │   │   │   ├── logger.ts         # Structured logging
│   │   │   │   ├── errors.ts         # Error classes
│   │   │   │   └── utils.ts          # General utilities
│   │   │   │
│   │   │   ├── middleware.ts         # Auth + verification gate
│   │   │   └── instrumentation.ts    # OpenTelemetry setup
│   │   │
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   │
│   │   ├── public/
│   │   ├── .env.example
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── worker/                       # BullMQ worker service
│   │   ├── src/
│   │   │   ├── jobs/                 # Job processors
│   │   │   │   ├── publish-post.ts
│   │   │   │   ├── generate-content.ts
│   │   │   │   ├── generate-image.ts
│   │   │   │   └── cleanup-old-jobs.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── wp-publisher.ts
│   │   │   │   ├── content-generator.ts
│   │   │   │   ├── image-generator.ts
│   │   │   │   └── seo-optimizer.ts
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── queue.ts
│   │   │   │   ├── logger.ts
│   │   │   │   └── metrics.ts
│   │   │   │
│   │   │   ├── index.ts              # Worker entry point
│   │   │   └── health.ts             # Health check endpoint
│   │   │
│   │   ├── .env.example
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── wp-plugin/                    # WordPress plugin
│       ├── yourapp-autoblogger/
│       │   ├── includes/
│       │   │   ├── class-rest-api.php
│       │   │   ├── class-hmac-auth.php
│       │   │   ├── class-post-handler.php
│       │   │   ├── class-media-handler.php
│       │   │   ├── class-terms-handler.php
│       │   │   └── class-admin-ui.php
│       │   │
│       │   ├── admin/
│       │   │   ├── views/
│       │   │   │   └── connect-page.php
│       │   │   └── assets/
│       │   │       ├── css/
│       │   │       └── js/
│       │   │
│       │   ├── yourapp-autoblogger.php  # Main plugin file
│       │   └── readme.txt
│       │
│       ├── build.sh                  # Plugin build script
│       └── package.json
│
├── packages/                         # Shared packages
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── api.types.ts
│   │   │   │   ├── db.types.ts
│   │   │   │   └── wordpress.types.ts
│   │   │   │
│   │   │   ├── schemas/              # Zod schemas
│   │   │   │   ├── auth.schema.ts
│   │   │   │   ├── project.schema.ts
│   │   │   │   ├── content.schema.ts
│   │   │   │   └── wordpress.schema.ts
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── plans.ts
│   │   │   │   ├── limits.ts
│   │   │   │   └── errors.ts
│   │   │   │
│   │   │   └── utils/
│   │   │       └── validators.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── ai-gateway/                   # AI provider gateway
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── fallback.ts
│   │   │   ├── retry.ts
│   │   │   ├── circuit-breaker.ts
│   │   │   ├── providers/
│   │   │   │   ├── openai.ts
│   │   │   │   ├── anthropic.ts
│   │   │   │   ├── openrouter.ts
│   │   │   │   └── generic.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── wp-client/                    # WordPress client
│   │   ├── src/
│   │   │   ├── plugin-client.ts      # HMAC-secured client
│   │   │   ├── core-client.ts        # wp/v2 client
│   │   │   ├── auto-client.ts        # Auto-switch client
│   │   │   ├── types.ts
│   │   │   └── errors.ts
│   │   │
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── security/                     # Security utilities
│       ├── src/
│       │   ├── encryption.ts
│       │   ├── hmac.ts
│       │   ├── ssrf-guard.ts
│       │   ├── sanitize.ts
│       │   └── audit-log.ts
│       │
│       ├── tsconfig.json
│       └── package.json
│
├── docs/                             # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   └── SECURITY.md
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-web.yml
│   │   ├── deploy-worker.yml
│   │   └── build-plugin.yml
│   └── ISSUE_TEMPLATE/
│
├── docker-compose.yml                # Local dev environment
├── turbo.json                        # Turborepo config
├── .gitignore
├── .env.example
├── package.json                      # Root package.json
└── README.md
```


***

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// AUTHENTICATION & ORGANIZATIONS
// ============================================

model User {
  id                String             @id @default(cuid())
  email             String             @unique
  emailVerifiedAt   DateTime?
  name              String?
  avatar            String?
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  
  // Relations
  memberships       OrganizationMember[]
  sessions          Session[]
  accounts          Account[]
  
  @@index([email])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([token])
}

model Account {
  id                String   @id @default(cuid())
  userId            String
  provider          String   // "email" | "google"
  providerAccountId String?
  accessToken       String?  @db.Text
  refreshToken      String?  @db.Text
  expiresAt         DateTime?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Organization {
  id                String               @id @default(cuid())
  name              String
  slug              String               @unique
  avatar            String?
  
  // Billing
  stripeCustomerId  String?              @unique
  planId            String               @default("free") // "free" | "starter" | "pro"
  planStatus        String               @default("active") // "active" | "canceled" | "past_due"
  planStartedAt     DateTime?
  planEndsAt        DateTime?
  
  // Usage tracking
  publishesThisMonth Int                 @default(0)
  lastResetAt       DateTime             @default(now())
  
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  
  // Relations
  members           OrganizationMember[]
  projects          Project[]
  aiEndpoints       AiEndpoint[]
  aiFallbackPolicy  AiFallbackPolicy?
  
  @@index([slug])
  @@index([stripeCustomerId])
}

model OrganizationMember {
  id             String       @id @default(cuid())
  organizationId String
  userId         String
  role           String       @default("MEMBER") // "OWNER" | "ADMIN" | "MEMBER"
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
  
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([organizationId, userId])
  @@index([userId])
}

// ============================================
// PROJECTS & WORDPRESS
// ============================================

model Project {
  id             String            @id @default(cuid())
  organizationId String
  name           String
  slug           String
  description    String?
  
  // Content defaults
  contentSettings Json?            // {tone, style, targetAudience, wordCount}
  seoSettings     Json?            // {focusKeywordStrategy, metaLength, internalLinking}
  
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
  
  // Relations
  organization      Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  wpConnection      WpSiteConnection?
  scheduledPosts    ScheduledPost[]
  contentTemplates  ContentTemplate[]
  
  @@unique([organizationId, slug])
  @@index([organizationId])
}

model WpSiteConnection {
  id          String   @id @default(cuid())
  projectId   String   @unique
  siteUrl     String
  siteName    String?
  
  // Connection mode
  mode        String   // "plugin" | "app_password"
  status      String   @default("pending") // "ok" | "error" | "pending"
  lastError   String?  @db.Text
  lastCheckedAt DateTime?
  
  // Plugin mode (HMAC)
  keyId               String?
  secretEncrypted     String?  @db.Text
  pairedAt            DateTime?
  
  // Fallback mode (Application Password)
  wpUsername          String?
  appPasswordEncrypted String? @db.Text
  
  // Capabilities detected
  capabilities Json?   // {posts: true, media: true, terms: true, seoMeta: true}
  
  // WordPress metadata
  wpVersion    String?
  activeTheme  String?
  detectedPlugins Json? // {yoast: true, rankmath: false, ...}
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId])
  @@index([siteUrl])
}

// ============================================
// CONTENT & SCHEDULING
// ============================================

model ContentTemplate {
  id          String   @id @default(cuid())
  projectId   String
  name        String
  description String?
  
  // Template structure
  type        String   // "how-to" | "listicle" | "review" | "news"
  structure   Json     // {sections: [{title, prompt, optional}]}
  
  // SEO defaults
  seoTemplate Json?    // {titlePattern, metaPattern}
  
  isPublic    Boolean  @default(false)
  usageCount  Int      @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  @@index([projectId])
}

model ScheduledPost {
  id             String    @id @default(cuid())
  projectId      String
  externalId     String    @unique // For idempotency
  
  // Content
  title          String
  markdown       String?   @db.Text
  gutenbergHtml  String?   @db.Text
  excerpt        String?   @db.Text
  
  // Publishing
  status         String    @default("draft") // "draft" | "scheduled" | "published" | "failed"
  desiredStatus  String    @default("draft") // What user wants: "draft" | "publish"
  scheduledAt    DateTime?
  publishedAt    DateTime?
  
  // WordPress metadata
  wpPostId       Int?
  wpEditUrl      String?
  wpPublicUrl    String?
  slug           String?
  categories     String[]  // Category names (resolved to IDs during publish)
  tags           String[]  // Tag names
  
  // Featured image
  featuredImageMode   String? // "ai" | "userupload" | "userurl"
  featuredImageSource String? // URL or object key
  featuredImagePrompt String? @db.Text
  storedImageKey      String? // S3/R2 object key
  wpMediaId           Int?
  
  // SEO
  metaTitle       String?
  metaDescription String?
  focusKeyword    String?
  seoScore        Int?    // 0-100
  readabilityScore Int?   // 0-100
  
  // AI generation metadata
  aiModel         String?
  aiTokensUsed    Int?
  aiCostUsd       Decimal? @db.Decimal(10, 6)
  generatedAt     DateTime?
  
  // Job tracking
  attemptCount    Int      @default(0)
  lastAttemptAt   DateTime?
  lastError       String?  @db.Text
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // Relations
  project  Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  jobRuns  JobRun[]
  
  @@index([projectId])
  @@index([status])
  @@index([scheduledAt])
  @@index([externalId])
}

// ============================================
// JOB QUEUE & LOGS
// ============================================

model JobRun {
  id               String    @id @default(cuid())
  scheduledPostId  String
  
  // Job metadata
  jobId            String?   // BullMQ job ID
  traceId          String    // For distributed tracing
  
  // Execution
  status           String    // "running" | "completed" | "failed"
  startedAt        DateTime  @default(now())
  finishedAt       DateTime?
  durationMs       Int?
  
  // AI provider usage
  textProviderUsed   String?
  imageProviderUsed  String?
  fallbackCount      Int     @default(0)
  
  // WordPress response
  wpResponseCode     Int?
  wpResponseSummary  Json?   // {postId, status, errors}
  
  // Error details
  errorCode          String?
  errorMessage       String? @db.Text
  errorStack         String? @db.Text
  
  createdAt          DateTime @default(now())
  
  scheduledPost ScheduledPost @relation(fields: [scheduledPostId], references: [id], onDelete: Cascade)
  
  @@index([scheduledPostId])
  @@index([traceId])
  @@index([status])
  @@index([startedAt])
}

// ============================================
// AI PROVIDERS
// ============================================

model AiEndpoint {
  id             String   @id @default(cuid())
  organizationId String
  
  name           String   // "OpenAI Production" | "Local vLLM"
  baseUrl        String   // "https://api.openai.com/v1" | "http://localhost:11434/v1"
  apiKeyEncrypted String? @db.Text // Nullable for local endpoints
  
  // Models
  defaultModelText  String  // "gpt-4o-mini" | "llama-3-70b"
  defaultModelImage String? // "dall-e-3" | null if not supported
  
  // Capabilities
  capabilities  Json     // {text: true, image: true}
  
  // Mode
  mode          String   @default("byok") // "managed" | "byok"
  
  // Health
  enabled       Boolean  @default(true)
  lastTestedAt  DateTime?
  lastError     String?  @db.Text
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  @@index([organizationId])
  @@index([enabled])
}

model AiFallbackPolicy {
  id             String   @id @default(cuid())
  organizationId String   @unique
  
  // Fallback chains (ordered endpoint IDs)
  textChain      String[] // ["endpoint1", "endpoint2", "endpoint3"]
  imageChain     String[]
  
  // Retry configuration
  retryPolicy    Json     // {retries: 2, timeoutMs: 30000, backoff: "exponential"}
  
  // Circuit breaker (optional)
  circuitBreaker Json?    // {enabled: true, failureThreshold: 5, cooldownMs: 60000}
  
  updatedAt      DateTime @updatedAt
  
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model AiProviderUsage {
  id             String   @id @default(cuid())
  organizationId String
  
  providerId     String   // AiEndpoint.id
  providerName   String   // For historical tracking
  requestType    String   // "text" | "image"
  
  model          String
  tokensUsed     Int?
  costUsd        Decimal? @db.Decimal(10, 6)
  
  // Request metadata
  success        Boolean
  latencyMs      Int?
  errorMessage   String?
  
  createdAt      DateTime @default(now())
  
  @@index([organizationId, createdAt])
  @@index([providerId])
}

// ============================================
// AUDIT & SECURITY
// ============================================

model AuditLog {
  id             String   @id @default(cuid())
  organizationId String?
  userId         String?
  
  action         String   // "project.create" | "wp.connect" | "post.publish"
  resourceType   String   // "project" | "wp_connection" | "scheduled_post"
  resourceId     String?
  
  metadata       Json?    // Additional context
  ipAddress      String?
  userAgent      String?  @db.Text
  
  createdAt      DateTime @default(now())
  
  @@index([organizationId, createdAt])
  @@index([userId, createdAt])
  @@index([action])
}

model RateLimitLog {
  id        String   @id @default(cuid())
  key       String   // "signup:email@example.com" | "api:org_123:ip_1.2.3.4"
  count     Int      @default(1)
  expiresAt DateTime
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([key])
  @@index([expiresAt])
}
```


***

## Implementation Phases (Detailed)

## **Pre-Phase 0.1: UI Library Setup (Add This BEFORE Phase 0)**

### **Goal**: Install all UI components upfront so AI can use them immediately

### Tasks

#### 1. **Initialize shadcn/ui**
```bash
npx shadcn@latest init
```

**Configuration:**
```
✔ Would you like to use TypeScript? ... yes
✔ Which style would you like to use? › New York
✔ Which color would you like to use as base color? › Blue  // ← Changed from Zinc
✔ Where is your global CSS file? ... src/app/globals.css
✔ Would you like to use CSS variables for colors? ... yes
✔ Are you using a custom tailwind prefix? ... no
✔ Where is your tailwind.config.js located? ... tailwind.config.ts
✔ Configure the import alias for components: ... @/components
✔ Configure the import alias for utils: ... @/lib/utils
✔ Write configuration to components.json. Proceed? ... yes
```

#### 2. **Install ALL shadcn Components** (Complete List)

Run this mega-command to install everything at once:

```bash
npx shadcn@latest add \
  accordion \
  alert \
  alert-dialog \
  aspect-ratio \
  avatar \
  badge \
  breadcrumb \
  button \
  calendar \
  card \
  carousel \
  chart \
  checkbox \
  collapsible \
  command \
  context-menu \
  data-table \
  date-picker \
  dialog \
  drawer \
  dropdown-menu \
  form \
  hover-card \
  input \
  input-otp \
  label \
  menubar \
  navigation-menu \
  pagination \
  popover \
  progress \
  radio-group \
  resizable \
  scroll-area \
  select \
  separator \
  sheet \
  skeleton \
  slider \
  sonner \
  switch \
  table \
  tabs \
  textarea \
  toast \
  toggle \
  toggle-group \
  tooltip
```

This installs **all components** to `src/components/ui/` directory.

#### 3. **Install Additional Data Libraries**

```bash
# Advanced data table
npm install @tanstack/react-table

# Charts (Recharts - already works with shadcn chart component)
npm install recharts

# Calendar/Date picker (already integrated with shadcn)
npm install react-day-picker date-fns

# Toast notifications (Sonner - already integrated with shadcn)
npx shadcn@latest add sonner

# Icons
npm install lucide-react

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Rich text editor (for markdown)
npm install @uiw/react-markdown-editor

# Markdown processing
npm install marked turndown

# Syntax highlighting (for code blocks in preview)
npm install highlight.js

# Drag and drop (for reordering fallback chains)
npm install @dnd-kit/core @dnd-kit/sortable
```

#### 4. **Create Custom Components** (Built on shadcn primitives)

These are domain-specific components you'll build:

```typescript
// src/components/custom/data-table.tsx
// Advanced filterable/sortable table built on shadcn table + TanStack Table

// src/components/custom/markdown-editor.tsx
// Markdown editor built on shadcn textarea + preview

// src/components/custom/file-upload.tsx
// Drag-drop file upload built on shadcn card + input

// src/components/custom/color-picker.tsx
// Color picker built on shadcn popover + input

// src/components/custom/sortable-list.tsx
// Drag-drop list built on @dnd-kit + shadcn card
```

#### 5. **Directory Structure After Setup**

```
src/
├── components/
│   ├── ui/                          # ← ALL shadcn components (50+ files)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── calendar.tsx
│   │   ├── chart.tsx
│   │   ├── sonner.tsx              # Toast notifications
│   │   ├── data-table.tsx          # TanStack Table wrapper
│   │   └── ...                     # (all other shadcn components)
│   │
│   ├── custom/                      # ← Domain-specific components
│   │   ├── markdown-editor.tsx
│   │   ├── file-upload.tsx
│   │   ├── sortable-list.tsx
│   │   ├── color-picker.tsx
│   │   ├── loading-skeleton.tsx     # ← NEW: Loading skeletons
│   │   └── error-boundary.tsx       # ← NEW: Error boundary
│   │
│   └── layout/                      # ← App layout components
│       ├── app-shell.tsx
│       ├── sidebar.tsx
│       ├── topbar.tsx
│       └── page-header.tsx
│
├── lib/
│   ├── email/                       # ← NEW: Email templates
│   │   ├── templates/
│   │   │   ├── verification.tsx
│   │   │   ├── welcome.tsx
│   │   │   ├── password-reset.tsx
│   │   │   ├── billing-receipt.tsx
│   │   │   ├── job-failed.tsx
│   │   │   └── weekly-digest.tsx
│   │   └── components/
│   │       ├── email-layout.tsx
│   │       ├── button.tsx
│   │       ├── header.tsx
│   │       └── footer.tsx
│   │
│   └── rate-limit.ts                # ← NEW: Rate limiting
│
├── modules/                         # ← Feature modules (unchanged)
│   ├── auth/
│   ├── projects/
│   └── ...
```

#### 6. **Email Templates Setup**

Create email templates directory for transactional emails:

**Verification Email Template:**

```typescript
// apps/web/src/lib/email/templates/verification.tsx
import { EmailLayout } from '../components/email-layout';
import { EmailButton } from '../components/button';

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Verify Your Email
      </h1>
      <p style={{ marginBottom: '16px' }}>
        Hi {name},
      </p>
      <p style={{ marginBottom: '24px' }}>
        Click the button below to verify your email address and start using AutoBlogger.
      </p>
      <EmailButton href={verificationUrl}>Verify Email</EmailButton>
      <p style={{ marginTop: '24px', fontSize: '14px', color: '#666' }}>
        Or copy this link: {verificationUrl}
      </p>
      <p style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
        This link expires in 24 hours.
      </p>
    </EmailLayout>
  );
}
```

**Email Layout Component:**

```typescript
// apps/web/src/lib/email/components/email-layout.tsx
interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f5', padding: '40px 20px' }}>
      <div style={{ backgroundColor: 'white', maxWidth: '600px', margin: '0 auto', padding: '40px', borderRadius: '8px' }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="https://yourapp.com/logo.png" alt="AutoBlogger" style={{ height: '40px' }} />
        </div>
        
        {/* Content */}
        {children}
        
        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e4e4e7', fontSize: '12px', color: '#71717a', textAlign: 'center' }}>
          <p>© 2024 AutoBlogger. All rights reserved.</p>
          <p style={{ marginTop: '8px' }}>
            <a href="https://yourapp.com/unsubscribe" style={{ color: '#3b82f6' }}>Unsubscribe</a>
            {' | '}
            <a href="https://yourapp.com/privacy" style={{ color: '#3b82f6' }}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Install Email Libraries:**

```bash
npm install @react-email/components react-email
```

**Email Templates Checklist:**
- [ ] Verification email
- [ ] Welcome email (after verification)
- [ ] Password reset email
- [ ] Billing receipt email
- [ ] Failed job notification email
- [ ] Weekly digest email

#### 7. **Error Boundaries Setup**

Create error boundary for graceful error handling:

```typescript
// src/components/custom/error-boundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Send to Sentry
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || 'An unexpected error occurred'}
            </AlertDescription>
            <Button 
              onClick={() => this.setState({ hasError: false })}
              className="mt-4"
            >
              Try Again
            </Button>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Wrap app shell:**

```typescript
// app/layout.tsx
import { ErrorBoundary } from '@/components/custom/error-boundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

#### 8. **Loading States & Skeletons**

Create loading skeletons for all async operations:

```typescript
// app/projects/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function ProjectsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Card>
        ))}
      </div>
    </div>
  );
}
```

**Generic Loading Skeleton Component:**

```typescript
// src/components/custom/loading-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  variant: 'card' | 'list' | 'table' | 'form' | 'calendar';
  count?: number;
}

export function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
  switch (variant) {
    case 'card':
      return (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      );
    
    case 'list':
      return (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      );
    
    case 'table':
      return (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    
    case 'form':
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-10 w-32" />
        </div>
      );
    
    case 'calendar':
      return (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="space-x-2">
              <Skeleton className="h-8 w-8 inline-block" />
              <Skeleton className="h-8 w-8 inline-block" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      );
    
    default:
      return <Skeleton className="h-32 w-full" />;
  }
}
```

***

## **Updated Phase 0: Foundation (Revised)**

### **Pre-Phase 0.1: UI Library Setup** ⭐ NEW

**Goal**: Install complete UI system before building any features

**Tasks:**
1. ✅ Initialize Next.js with Tailwind
2. ✅ Install and configure shadcn/ui
3. ✅ Install ALL shadcn components (50+)
4. ✅ Install data/chart libraries (TanStack Table, Recharts)
5. ✅ Install form libraries (React Hook Form, Zod)
6. ✅ Install markdown editor
7. ✅ Create custom component wrappers
8. ✅ Test component library with sample page

**Deliverables:**
- ✅ `components.json` configured
- ✅ All shadcn components in `components/ui/`
- ✅ Component demo page at `/demo/components`

**Acceptance Criteria:**
- Can import any shadcn component from `@/components/ui`
- Demo page shows all components working
- Dark/light mode works
- No TypeScript errors

**Time Estimate:** 2-3 hours

***

### **Phase 0.2: App Shell & Routing** (Previously Phase 0)

**Goal**: Create app structure with navigation

**Tasks:**
1. ✅ Create monorepo structure
2. ✅ Set up route groups: `(auth)` and `(dashboard)`
3. ✅ Build AppShell using shadcn components:
   - Sidebar with `Sheet` (mobile) and `ScrollArea`
   - Topbar with `Avatar`, `DropdownMenu`, theme toggle
   - PageHeader with `Breadcrumb`
4. ✅ Create stub pages using shadcn `Card`
5. ✅ Add navigation using shadcn `NavigationMenu`

**All UI components used:**
- `Sheet` - Mobile sidebar
- `ScrollArea` - Sidebar scroll
- `Avatar` - User avatar
- `DropdownMenu` - User menu
- `Button` - All actions
- `Card` - Page containers
- `Breadcrumb` - Navigation
- `NavigationMenu` - Main nav
- `Badge` - Status indicators
- `Separator` - Dividers

**Deliverables:**
- ✅ App shell with responsive sidebar
- ✅ All route stubs
- ✅ Theme toggle working

**Acceptance Criteria:**
- Navigation works on mobile/desktop
- All pages use shadcn components (no custom CSS)
- Theme persists across pages

***

## **Component Usage Guide for AI**

### **Instead of building inline, USE shadcn:**

#### ❌ **DON'T DO THIS:**
```typescript
// Creating custom button from scratch
export function CustomButton({ children, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
}
```

#### ✅ **DO THIS:**
```typescript
// Use shadcn button
import { Button } from '@/components/ui/button';

export function MyComponent() {
  return <Button onClick={handleClick}>Click Me</Button>;
}
```

***

### **Complex Component Examples**

#### **Example 1: Toast Notifications**
```typescript
// Use Sonner (integrated with shadcn)
import { Toaster } from "@/components/ui/sonner";

export function MyComponent() {
  const handleSave = async () => {
    try {
      await saveData();
      Toaster.success('Saved successfully!');
    } catch (error) {
      Toaster.error('Failed to save', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => handleSave(),
        },
      });
    }
  };
  
  return <Button onClick={handleSave}>Save</Button>;
}
```

#### **Example 2: Data Table**
```typescript
// Use shadcn data-table (built on TanStack Table)
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export function ProjectsList() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
  
  return (
    <DataTable 
      columns={columns} 
      data={projects}
      searchKey="name"
      filterKeys={['status', 'plan']}
    />
  );
}
```

#### **Example 3: Form with Validation**
```typescript
// Use shadcn form components + React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export function SignupForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '' },
  });
  
  const onSubmit = async (data) => {
    await signup(data);
    toast.success('Account created!');
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  );
}
```

#### **Example 4: Charts**
```typescript
// Use shadcn chart (built on Recharts)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis } from 'recharts';

export function UsageChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Publishing Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            publishes: {
              label: 'Publishes',
              color: 'hsl(var(--primary))',
            },
          }}
        >
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip />
            <Line type="monotone" dataKey="publishes" stroke="var(--color-publishes)" />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
```

***

## **Complete shadcn Component Inventory**

### **Forms & Inputs**
- `button` - All button variants (default, outline, ghost, link)
- `input` - Text inputs
- `textarea` - Multi-line text
- `select` - Dropdown select
- `checkbox` - Checkboxes
- `radio-group` - Radio buttons
- `switch` - Toggle switch
- `slider` - Range slider
- `input-otp` - OTP input
- `form` - Form wrapper with React Hook Form
- `label` - Form labels
- `combobox` - Searchable select
- `date-picker` - Date picker with calendar

### **Layout & Navigation**
- `card` - Content cards
- `tabs` - Tab navigation
- `accordion` - Collapsible sections
- `separator` - Dividers
- `scroll-area` - Scrollable container
- `resizable` - Resizable panels
- `aspect-ratio` - Aspect ratio container
- `breadcrumb` - Breadcrumb navigation
- `navigation-menu` - Main navigation
- `menubar` - Menu bar
- `pagination` - Pagination controls

### **Overlays & Dialogs**
- `dialog` - Modal dialog
- `drawer` - Side drawer
- `sheet` - Slide-out panel
- `popover` - Popover
- `tooltip` - Tooltips
- `hover-card` - Hover card
- `dropdown-menu` - Dropdown menu
- `context-menu` - Right-click menu
- `command` - Command palette (Cmd+K)
- `alert-dialog` - Confirmation dialog

### **Feedback & Status**
- `alert` - Alert messages
- `toast` / `sonner` - Toast notifications
- `progress` - Progress bar
- `skeleton` - Loading skeleton
- `badge` - Status badges
- `avatar` - User avatars

### **Data Display**
- `table` - Basic table
- `data-table` - Advanced data table with TanStack Table
- `chart` - Charts with Recharts
- `calendar` - Calendar component
- `carousel` - Image/content carousel

### **Interactive**
- `toggle` - Toggle button
- `toggle-group` - Toggle button group
- `collapsible` - Collapsible content

***

## **Prompt for AI (Pre-Phase 0.1)**

```markdown
# PRE-PHASE 0.1: Complete UI Library Setup

**Goal**: Install all UI components before building any features.

**Instructions**:
1. Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS
2. Run `npx shadcn@latest init` with these settings:
   - TypeScript: Yes
   - Style: New York
   - Base color: Zinc
   - CSS variables: Yes
   - Import alias: @/components and @/lib/utils

3. Install ALL shadcn components in one command:
   ```bash
   npx shadcn@latest add accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel chart checkbox collapsible command context-menu data-table date-picker dialog drawer dropdown-menu form hover-card input input-otp label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet skeleton slider sonner switch table tabs textarea toast toggle toggle-group tooltip
   ```

4. Install additional libraries:
   ```bash
   npm install @tanstack/react-table recharts react-day-picker date-fns sonner lucide-react react-hook-form @hookform/resolvers zod @uiw/react-markdown-editor marked turndown @dnd-kit/core @dnd-kit/sortable
   ```

5. Create directory structure:
   - `src/components/ui/` - ALL shadcn components (auto-created)
   - `src/components/custom/` - Domain-specific wrappers
   - `src/components/layout/` - App shell components

6. Create a demo page at `app/demo/components/page.tsx` that showcases:
   - All form inputs
   - All button variants
   - Dialog, Drawer, Sheet
   - Toast notifications
   - Data table
   - Chart
   - Calendar/Date picker
   - Dark/light mode toggle

**Acceptance Criteria**:
- All shadcn components importable from `@/components/ui/`
- Demo page renders without errors
- Dark/light mode works
- No TypeScript errors
- Component inventory documented

**DO NOT**:
- Create any custom UI components from scratch
- Write custom CSS for basic components
- Use any UI library other than shadcn/ui

**ALWAYS**:
- Import from `@/components/ui/` for all UI needs
- Use shadcn components as building blocks
- Compose complex components from shadcn primitives
```

***

## **Final Recommendation**

✅ **Use shadcn/ui exclusively** - it's the perfect fit for your stack (Tailwind + Next.js + TypeScript)

❌ **Don't use Mantine** - it conflicts with Tailwind and adds unnecessary complexity

✅ **Add Pre-Phase 0.1** to install everything upfront - this ensures the AI has all components available from day 1

**This approach gives you:**
- Complete UI library (50+ components)
- Code ownership (no black box)
- Tailwind consistency
- TypeScript safety
- Best-in-class DX

Would you like me to update the full implementation plan with Pre-Phase 0.1 integrated?

### Phase 0: Foundation \& Scaffold (Week 1)

**Goal**: Set up monorepo, install dependencies, create app shell with routing

#### Tasks

1. **Initialize monorepo**

```bash
npx create-turbo@latest
cd apps/web && npx create-next-app@latest --typescript --tailwind --app
```

2. **Install core dependencies**

```json
{
  "dependencies": {
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "lucide-react": "latest",
    "zod": "latest",
    "@tanstack/react-query": "latest",
    "next-themes": "latest"
  }
}
```

3. **Install shadcn/ui**

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button dialog input card calendar select
```

4. **Create modular directory structure**
    - Set up `src/modules/` folders
    - Create `src/components/ui/` for shadcn
    - Create `src/components/layout/` for shell
5. **Build app shell**
    - AppShell with sidebar + topbar
    - Route groups: `(auth)` and `(dashboard)`
    - Stub pages: Projects, Planner, Content, Billing, Settings

#### Deliverables

- ✅ Monorepo structure
- ✅ Next.js app with Tailwind + shadcn/ui
- ✅ App shell with navigation
- ✅ All route stubs created


#### Acceptance Criteria

- Navigation between all pages works
- Dark/light theme toggle works
- All UI components imported from `components/ui/`
- No console errors
- TypeScript compiles without errors

***

### Phase 1: Authentication \& Email Verification (Week 1-2)

**Goal**: Implement Better Auth with email verification gate

#### Tasks

1. **Install Better Auth**

```bash
npm install better-auth
```

2. **Configure providers**
    - Email/Password
    - Google OAuth
    - Store `emailVerifiedAt` field
3. **Create auth module**
    - `modules/auth/components/LoginForm.tsx`
    - `modules/auth/components/SignupForm.tsx`
    - `modules/auth/components/VerifyEmailBanner.tsx`
    - `modules/auth/actions/login.ts`
    - `modules/auth/actions/signup.ts`
    - `modules/auth/actions/verify-email.ts`
4. **Implement middleware verification gate**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { user } = await auth(request);
  
  if (user && !user.emailVerifiedAt) {
    if (!request.nextUrl.pathname.startsWith('/verify-email')) {
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
  }
  
  return NextResponse.next();
}
```

5. **Mailjet integration**
    - Install Mailjet SDK
    - Create email templates
    - Implement `sendVerificationEmail()` action
    - Add rate limiting (max 3 resends per hour)
6. **Google OAuth email verification**
    - Auto-verify if `email_verified: true` from Google

#### Rate Limiting Strategy (Per Endpoint)

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export const rateLimits = {
  // Authentication
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 attempts per 15 min
    analytics: true,
  }),
  
  signup: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 signups per hour per IP
    analytics: true,
  }),
  
  resendVerification: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 resends per hour
    analytics: true,
  }),
  
  passwordReset: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'), // 3 resets per hour
    analytics: true,
  }),
  
  // WordPress
  wpConnect: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 connection attempts per hour
    analytics: true,
  }),
  
  // AI Generation (per organization)
  aiGenerate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
    analytics: true,
  }),
  
  // Publishing (per organization)
  publishPost: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 publishes per minute
    analytics: true,
  }),
  
  // API endpoints (per org)
  apiGeneral: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
  }),
  
  // Image generation (expensive)
  imageGenerate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 images per minute
    analytics: true,
  }),
  
  // Content scheduling
  schedulePost: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'), // 30 schedules per minute
    analytics: true,
  }),
};
```

**Usage in Server Actions:**

```typescript
// modules/auth/actions/login.ts
import { rateLimits } from '@/lib/rate-limit';

export async function login(email: string, password: string) {
  const identifier = `login:${email}`;
  const { success, limit, reset, remaining } = await rateLimits.login.limit(identifier);
  
  if (!success) {
    throw new Error(`Too many login attempts. Try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes.`);
  }
  
  // Proceed with login...
}
```

**Rate Limiting Summary Table:**

| Endpoint | Limit | Window | Identifier |
|----------|-------|--------|------------|
| Login | 5 | 15 min | email |
| Signup | 3 | 1 hour | IP address |
| Resend Verification | 3 | 1 hour | email |
| Password Reset | 3 | 1 hour | email |
| WP Connect | 10 | 1 hour | orgId |
| AI Generate | 20 | 1 min | orgId |
| Publish Post | 10 | 1 min | orgId |
| API General | 100 | 1 min | orgId |
| Image Generate | 5 | 1 min | orgId |
| Schedule Post | 30 | 1 min | orgId |

#### Deliverables

- ✅ Better Auth configured
- ✅ Login/signup flows
- ✅ Email verification flow
- ✅ Middleware gate
- ✅ Mailjet integration
- ✅ Rate limiting per endpoint


#### Acceptance Criteria

- Unverified users redirected to `/verify-email` only
- Verification email sent successfully
- Can resend email (rate-limited)
- Google OAuth users auto-verified
- Can logout from verification page
- Verified users can access dashboard
- Rate limiting enforced on all endpoints

***

### Phase 1.5: GDPR Compliance & Onboarding (Week 2-3)

**Goal**: Implement legal compliance and user onboarding flow

#### Tasks

##### 1. Cookie Consent Banner

```typescript
// src/components/custom/cookie-consent.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';

const COOKIE_CATEGORIES = {
  essential: { title: 'Essential', required: true },
  analytics: { title: 'Analytics', required: false },
  marketing: { title: 'Marketing', required: false },
};

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }));
    setShow(false);
    // Initialize analytics/marketing scripts
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
    }));
    setShow(false);
    window.dispatchEvent(new CustomEvent('cookie-consent-updated'));
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <h2 className="text-lg font-semibold mb-2">Cookie Preferences</h2>
        <p className="text-sm text-muted-foreground mb-4">
          We use cookies to improve your experience. By clicking "Accept All", you consent to our use of cookies.
          <Link href="/legal/cookies">Learn more</Link>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSavePreferences}>
            Customize
          </Button>
          <Button onClick={handleAcceptAll}>
            Accept All
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

##### 2. Legal Pages

Create required legal pages:

```
app/(legal)/
├── legal/
│   ├── privacy/
│   │   └── page.tsx        # Privacy Policy
│   ├── terms/
│   │   └── page.tsx        # Terms of Service
│   ├── cookies/
│   │   └── page.tsx        # Cookie Policy
│   └── dpa/
│       └── page.tsx        # Data Processing Agreement (for EU customers)
```

**Privacy Policy must include:**
- Data collection practices
- How data is used
- Third-party sharing (Stripe, AI providers, etc.)
- User rights (access, deletion, portability)
- Contact information for DPO

##### 3. Data Deletion (GDPR Right to Erasure)

```typescript
// modules/settings/actions/delete-account.ts
'use server';

import { db } from '@/lib/db';
import { r2 } from '@/lib/storage';
import { stripe } from '@/lib/stripe';

export async function deleteAccount(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              projects: {
                include: {
                  scheduledPosts: true,
                  wpConnection: true,
                }
              },
              aiEndpoints: true,
            }
          }
        }
      }
    }
  });

  if (!user) throw new Error('User not found');

  // Delete in transaction
  await db.$transaction(async (tx) => {
    for (const membership of user.memberships) {
      const org = membership.organization;

      // Delete scheduled posts
      await tx.scheduledPost.deleteMany({
        where: { project: { organizationId: org.id } }
      });

      // Delete projects
      await tx.project.deleteMany({
        where: { organizationId: org.id }
      });

      // Delete AI endpoints
      await tx.aiEndpoint.deleteMany({
        where: { organizationId: org.id }
      });

      // Cancel Stripe subscription
      if (org.stripeCustomerId) {
        try {
          const subscriptions = await stripe.subscriptions.list({
            customer: org.stripeCustomerId,
          });
          for (const sub of subscriptions.data) {
            await stripe.subscriptions.cancel(sub.id);
          }
        } catch (e) {
          console.error('Failed to cancel subscription:', e);
        }
      }

      // Delete organization
      await tx.organization.delete({
        where: { id: org.id }
      });
    }

    // Delete user
    await tx.user.delete({
      where: { id: userId }
    });
  });

  // Delete stored images from R2/S3
  // This would require listing and deleting all objects with org prefix
  // await deleteAllUserImages(org.id);

  return { success: true };
}
```

##### 4. Data Export (GDPR Right to Portability)

```typescript
// modules/settings/actions/export-data.ts
'use server';

import { db } from '@/lib/db';

export async function exportUserData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: {
          organization: {
            include: {
              projects: {
                include: {
                  scheduledPosts: true,
                  contentTemplates: true,
                  wpConnection: true,
                }
              },
              aiEndpoints: true,
              aiFallbackPolicy: true,
            }
          }
        }
      },
      auditLogs: {
        where: { userId },
        take: 1000,
      }
    }
  });

  if (!user) throw new Error('User not found');

  // Sanitize sensitive data
  const sanitizedData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    organizations: user.memberships.map(m => ({
      name: m.organization.name,
      role: m.role,
      projects: m.organization.projects.map(p => ({
        name: p.name,
        description: p.description,
        posts: p.scheduledPosts.map(post => ({
          title: post.title,
          status: post.status,
          createdAt: post.createdAt,
        })),
      })),
    })),
    auditLogs: user.auditLogs,
    exportedAt: new Date().toISOString(),
  };

  // Return as JSON download
  return new Response(JSON.stringify(sanitizedData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="autoblogger-data-${userId}.json"`,
    },
  });
}
```

##### 5. Privacy-Focused Analytics

```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js';

export function initAnalytics() {
  // Check cookie consent before initializing
  const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
  
  if (consent.analytics) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // IP anonymization
      person_profiles: 'identified_only',
      // Respect Do Not Track
      respect_dnt: true,
      // Disable session recording by default
      disable_session_recording: !consent.marketing,
    });
  }
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  const consent = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
  if (consent.analytics) {
    posthog.capture(event, properties);
  }
}
```

##### 6. Onboarding Flow

```typescript
// modules/onboarding/components/OnboardingWizard.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StepChoosePlan } from './steps/StepChoosePlan';
import { StepCreateProject } from './steps/StepCreateProject';
import { StepConnectWP } from './steps/StepConnectWP';
import { StepCreatePost } from './steps/StepCreatePost';
import { StepCelebrate } from './steps/StepCelebrate';

interface OnboardingWizardProps {
  open: boolean;
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: 'Choose Plan', component: StepChoosePlan },
  { id: 2, title: 'Create Project', component: StepCreateProject },
  { id: 3, title: 'Connect WordPress', component: StepConnectWP },
  { id: 4, title: 'Create First Post', component: StepCreatePost },
  { id: 5, title: 'Celebrate', component: StepCelebrate },
];

export function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    plan: 'free',
    projectId: null,
    wpConnected: false,
    postId: null,
  });

  const StepComponent = STEPS[currentStep].component;

  const handleNext = (stepData?: any) => {
    if (stepData) {
      setData(prev => ({ ...prev, ...stepData }));
    }
    
    if (currentStep === STEPS.length - 1) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    // Skip to end, mark onboarding as complete
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleSkip()}>
      <DialogContent className="max-w-2xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 w-8 rounded-full ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <StepComponent
          data={data}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </DialogContent>
    </Dialog>
  );
}
```

**Onboarding Steps:**
1. **Step 1: Choose Plan** - Show pricing, allow skip (defaults to Free)
2. **Step 2: Create Project** - Name, description, content settings
3. **Step 3: Connect WordPress** - Show plugin install guide or app password
4. **Step 4: Create First Post** - AI-assisted content generation
5. **Step 5: Celebrate** - Success animation, next steps

##### 7. Feature Flags System

```typescript
// src/lib/feature-flags.ts
import { db } from '@/lib/db';

// Simple hash function for consistent rollout
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export const featureFlags = {
  // Roll out features gradually (percentage-based)
  aiImageGeneration: (orgId: string): boolean => {
    // Enable for 50% of orgs
    return hashString(orgId) % 100 < 50;
  },
  
  // Plan-based features
  bulkScheduling: (planId: string): boolean => {
    return ['starter', 'pro'].includes(planId);
  },
  
  customAiProviders: (planId: string): boolean => {
    return ['starter', 'pro'].includes(planId);
  },
  
  advancedSeoTemplates: (planId: string): boolean => {
    return planId === 'pro';
  },
  
  // Beta features (opt-in)
  multiSitePublishing: async (orgId: string): Promise<boolean> => {
    const org = await db.organization.findUnique({
      where: { id: orgId },
      select: { betaFeatures: true }
    });
    return (org?.betaFeatures as any)?.multiSitePublishing ?? false;
  },
  
  // Admin-only features
  adminDashboard: (userId: string): boolean => {
    // Check if user is admin
    const adminIds = process.env.ADMIN_USER_IDS?.split(',') || [];
    return adminIds.includes(userId);
  },
};

// Usage in server actions
export async function checkFeatureAccess(
  orgId: string,
  feature: keyof typeof featureFlags
): Promise<boolean> {
  const org = await db.organization.findUnique({
    where: { id: orgId },
    select: { planId: true }
  });
  
  if (!org) return false;
  
  const flag = featureFlags[feature];
  if (typeof flag === 'function') {
    if (flag.length === 1) {
      return (flag as (id: string) => boolean)(orgId);
    }
    return await (flag as (id: string) => Promise<boolean>)(orgId);
  }
  
  return flag;
}
```

#### Deliverables

- ✅ Cookie consent banner
- ✅ Legal pages (privacy, terms, cookies, DPA)
- ✅ Data deletion endpoint
- ✅ Data export endpoint
- ✅ Privacy-focused analytics
- ✅ Onboarding wizard
- ✅ Feature flags system


#### Acceptance Criteria

- Cookie consent shows on first visit
- User can accept/reject cookies
- Legal pages accessible at /legal/*
- User can delete account (GDPR)
- User can export data (GDPR)
- Analytics only loads after consent
- New users see onboarding wizard
- Feature flags control access to features

***

### Phase 2: Multi-Tenant Foundation (Week 2)

**Goal**: Organizations, members, projects with tenant isolation

#### Tasks

1. **Prisma schema**
    - Add Organization, OrganizationMember, Project models
    - Run migrations
2. **Auto-create organization on signup**

```typescript
// modules/auth/actions/signup.ts
await db.$transaction(async (tx) => {
  const user = await tx.user.create({...});
  const org = await tx.organization.create({
    data: { name: `${user.name}'s Workspace` }
  });
  await tx.organizationMember.create({
    data: { organizationId: org.id, userId: user.id, role: 'OWNER' }
  });
});
```

3. **Create org module**
    - `modules/org/components/OrgSwitcher.tsx`
    - `modules/org/actions/get-current-org.ts`
4. **Create projects module**
    - `modules/projects/components/ProjectList.tsx`
    - `modules/projects/components/CreateProjectDialog.tsx`
    - `modules/projects/actions/create-project.ts`
    - `modules/projects/actions/delete-project.ts`
5. **Enforce tenant isolation**

```typescript
// All queries MUST include organizationId
export async function getProjects(orgId: string) {
  return db.project.findMany({
    where: { organizationId: orgId } // ALWAYS enforce
  });
}
```

6. **Implement free tier limits**
    - Check project count before creation
    - Show upgrade prompt if limit reached

#### Deliverables

- ✅ Organization auto-created
- ✅ Project CRUD
- ✅ Tenant isolation enforced
- ✅ Free tier limits (1 project)


#### Acceptance Criteria

- Every user has an Organization
- Cannot access other org's projects by ID manipulation
- Free users blocked from creating 2nd project
- Projects list only shows current org's projects
- Audit log records project creation

***

### Phase 3: Billing \& Plans (Week 3)

**Goal**: Stripe integration with plan-based feature flags

#### Tasks

1. **Stripe setup**
    - Create products: Free, Starter (\$29/mo), Pro (\$99/mo)
    - Create prices in Stripe Dashboard
    - Install Stripe SDK
2. **Create billing module**
    - `modules/billing/components/PricingTable.tsx`
    - `modules/billing/components/CurrentPlan.tsx`
    - `modules/billing/components/UsageMetrics.tsx`
    - `modules/billing/actions/create-checkout.ts`
    - `modules/billing/actions/create-portal.ts`
3. **Implement checkout flow**

```typescript
export async function createCheckout(orgId: string, priceId: string) {
  const session = await stripe.checkout.sessions.create({
    customer: org.stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${baseUrl}/billing?success=true`,
    cancel_url: `${baseUrl}/billing?canceled=true`,
  });
  return session.url;
}
```

4. **Webhook handler**
    - `app/api/webhooks/stripe/route.ts`
    - Handle `checkout.session.completed`
    - Handle `customer.subscription.updated`
    - Handle `customer.subscription.deleted`
    - Update Organization plan fields
5. **Plan enforcement helpers**

```typescript
export async function canPublish(orgId: string): Promise<boolean> {
  const org = await db.organization.findUnique({ where: { id: orgId } });
  return org.planId !== 'free';
}

export async function canUseBYOK(orgId: string): Promise<boolean> {
  const org = await db.organization.findUnique({ where: { id: orgId } });
  return ['starter', 'pro'].includes(org.planId);
}
```

6. **Usage tracking**
    - Increment `publishesThisMonth` on each publish
    - Reset counter monthly via cron job
    - Block publishing if limit exceeded

#### Deliverables

- ✅ Stripe checkout + portal
- ✅ Webhook handler
- ✅ Plan enforcement utilities
- ✅ Usage tracking


#### Acceptance Criteria

- Can upgrade to Starter/Pro
- Webhook updates plan in database
- Free users blocked from auto-publish
- Paid users can publish
- Usage metrics visible in dashboard
- Plan enforcement works server-side

***

### Phase 4: WordPress Connection (Week 3-4)

**Goal**: Connect WordPress via plugin (HMAC) + Application Password fallback

#### Tasks - WordPress Plugin

1. **Create plugin structure**

```php
/*
Plugin Name: AutoBlogger Integration
Description: Secure connection to AutoBlogger SaaS
Version: 1.0.0
*/
```

2. **Admin UI page**
    - Register menu: "AutoBlogger"
    - Show pairing code (generated, 10-min expiry)
    - Show connection status
    - Show diagnostics (WP version, active plugins, REST status)
3. **Implement HMAC auth class**

```php
class HMAC_Auth {
  public function verify_request($request) {
    $keyId = $request->get_header('X-YA-KeyId');
    $timestamp = $request->get_header('X-YA-Timestamp');
    $nonce = $request->get_header('X-YA-Nonce');
    $signature = $request->get_header('X-YA-Signature');
    
    // Check timestamp within ±300s
    // Check nonce not used (transient)
    // Verify signature
    
    return $valid ? true : new WP_Error('auth_failed');
  }
}
```

4. **Register REST endpoints**

```php
add_action('rest_api_init', function() {
  register_rest_route('yourapp/v1', '/pair', [
    'methods' => 'POST',
    'callback' => 'handle_pair',
    'permission_callback' => 'verify_pairing_code'
  ]);
  
  register_rest_route('yourapp/v1', '/ping', [
    'methods' => 'GET',
    'callback' => 'handle_ping',
    'permission_callback' => 'verify_hmac'
  ]);
  
  register_rest_route('yourapp/v1', '/posts/upsert', [
    'methods' => 'POST',
    'callback' => 'handle_post_upsert',
    'permission_callback' => 'verify_hmac'
  ]);
  
  // ... media/import, terms/ensure
});
```

5. **Implement post handler**

```php
function handle_post_upsert($request) {
  $externalId = $request['external_id'];
  $title = $request['title'];
  $content = $request['content_html'];
  $status = $request['status']; // draft | publish | future
  $date_gmt = $request['date_gmt'];
  
  // Find existing by meta key
  $existing = get_posts([
    'meta_key' => 'yourapp_external_id',
    'meta_value' => $externalId
  ]);
  
  if ($existing) {
    $postId = wp_update_post([...]);
  } else {
    $postId = wp_insert_post([
      'post_title' => $title,
      'post_content' => $content,
      'post_status' => $status,
      'post_date_gmt' => $date_gmt,
    ]);
    
    update_post_meta($postId, 'yourapp_external_id', $externalId);
  }
  
  // Handle categories/tags
  // Handle featured image
  // Handle SEO meta
  
  return [
    'post_id' => $postId,
    'status' => get_post_status($postId),
    'edit_url' => admin_url("post.php?post={$postId}&action=edit")
  ];
}
```


#### Tasks - SaaS

1. **Create wp-client package**

```typescript
// packages/wp-client/src/plugin-client.ts
export class PluginClient {
  async upsertPost(data: UpsertPostInput) {
    const signature = generateHMAC({...});
    
    return fetch(`${siteUrl}/wp-json/yourapp/v1/posts/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-YA-KeyId': this.keyId,
        'X-YA-Timestamp': timestamp,
        'X-YA-Nonce': nonce,
        'X-YA-Signature': signature,
      },
      body: JSON.stringify(data),
    });
  }
}
```

2. **Create core-client for fallback**

```typescript
// packages/wp-client/src/core-client.ts
export class CoreClient {
  async createPost(data: CreatePostInput) {
    const auth = Buffer.from(`${username}:${appPassword}`).toString('base64');
    
    return fetch(`${siteUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        status: data.status,
        date: data.scheduledAt,
        categories: categoryIds,
        tags: tagIds,
        featured_media: mediaId,
      }),
    });
  }
}
```

3. **Create wp module in SaaS**
    - `modules/wp/components/ConnectWPDialog.tsx`
    - `modules/wp/components/PluginConnectForm.tsx`
    - `modules/wp/components/AppPasswordForm.tsx`
    - `modules/wp/components/DiagnosticsPanel.tsx`
    - `modules/wp/actions/connect-plugin.ts`
    - `modules/wp/actions/connect-fallback.ts`
    - `modules/wp/actions/test-connection.ts`
4. **Implement plugin pairing flow**

```typescript
export async function pairPlugin(projectId: string, pairingCode: string) {
  // Exchange pairing code for connection details
  const response = await fetch(`${siteUrl}/wp-json/yourapp/v1/pair`, {
    method: 'POST',
    body: JSON.stringify({ pairing_code: pairingCode, project_id: projectId }),
  });
  
  const { site_id, key_id, secret } = await response.json();
  
  // Encrypt secret and store
  await db.wpSiteConnection.create({
    data: {
      projectId,
      siteUrl,
      mode: 'plugin',
      keyId: key_id,
      secretEncrypted: await encrypt(secret),
      status: 'ok',
    },
  });
}
```

5. **Diagnostics panel**
    - Show connection mode
    - Show last ping result
    - Show WordPress version
    - Show detected plugins
    - Show common errors with solutions

6. **WordPress Plugin Auto-Updater**

```php
// includes/class-auto-updater.php
<?php

class AutoBlogger_Auto_Updater {
  private $plugin_slug = 'yourapp-autoblogger';
  private $plugin_file = 'yourapp-autoblogger/yourapp-autoblogger.php';
  private $update_url = 'https://api.yourapp.com/plugin/updates';
  private $version;

  public function __construct() {
    $this->version = AUTOBLOGGER_VERSION;
    
    // Hook into WordPress update system
    add_filter('pre_set_site_transient_update_plugins', [$this, 'check_for_update']);
    add_filter('plugins_api', [$this, 'plugin_info'], 20, 3);
    add_action('in_plugin_update_message-' . $this->plugin_file, [$this, 'update_message']);
  }

  /**
   * Check for plugin updates
   */
  public function check_for_update($transient) {
    if (empty($transient->checked)) {
      return $transient;
    }

    // Make request to update API
    $response = $this->request_update();
    
    if ($response && version_compare($this->version, $response->new_version, '<')) {
      $transient->response[$this->plugin_file] = (object) [
        'slug' => $this->plugin_slug,
        'new_version' => $response->new_version,
        'url' => $response->url ?? 'https://yourapp.com/plugin',
        'package' => $response->download_url,
        'tested' => $response->tested ?? '6.4',
        'requires_php' => $response->requires_php ?? '7.4',
        'icons' => $response->icons ?? [],
      ];
    }

    return $transient;
  }

  /**
   * Get plugin info for details view
   */
  public function plugin_info($result, $action, $args) {
    if ($action !== 'plugin_information') {
      return $result;
    }

    if ($args->slug !== $this->plugin_slug) {
      return $result;
    }

    $response = $this->request_update();
    
    if (!$response) {
      return $result;
    }

    return (object) [
      'name' => 'AutoBlogger Integration',
      'slug' => $this->plugin_slug,
      'version' => $response->new_version,
      'author' => '<a href="https://yourapp.com">AutoBlogger</a>',
      'author_profile' => 'https://yourapp.com',
      'requires' => $response->requires ?? '6.0',
      'tested' => $response->tested ?? '6.4',
      'requires_php' => $response->requires_php ?? '7.4',
      'last_updated' => $response->last_updated ?? date('Y-m-d'),
      'sections' => [
        'description' => $response->description ?? 'Secure connection to AutoBlogger SaaS for AI-powered autoblogging.',
        'changelog' => $response->changelog ?? '<p>See changelog at https://yourapp.com/changelog</p>',
      ],
      'download_link' => $response->download_url,
    ];
  }

  /**
   * Request update info from API
   */
  private function request_update() {
    $cache_key = 'autoblogger_update_check';
    $cached = get_transient($cache_key);
    
    if ($cached !== false) {
      return $cached;
    }

    $response = wp_remote_get(add_query_arg([
      'version' => $this->version,
      'site' => home_url(),
    ], $this->update_url), [
      'timeout' => 10,
      'headers' => [
        'Accept' => 'application/json',
      ],
    ]);

    if (is_wp_error($response)) {
      return false;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body);

    if (json_last_error() !== JSON_ERROR_NONE || !isset($data->new_version)) {
      return false;
    }

    // Cache for 12 hours
    set_transient($cache_key, $data, 12 * HOUR_IN_SECONDS);

    return $data;
  }

  /**
   * Custom update message
   */
  public function update_message() {
    $response = $this->request_update();
    
    if ($response && isset($response->message)) {
      echo '<p style="color: #d63638; margin-top: 8px;">' . esc_html($response->message) . '</p>';
    }
  }
}

// Initialize updater
new AutoBlogger_Auto_Updater();
```

**Update API Endpoint (SaaS side):**

```typescript
// app/api/plugin/updates/route.ts
import { NextRequest, NextResponse } from 'next/server';

const LATEST_VERSION = '1.2.0';
const DOWNLOAD_URL = 'https://releases.yourapp.com/autoblogger-plugin-1.2.0.zip';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currentVersion = searchParams.get('version') || '0.0.0';
  const site = searchParams.get('site');

  // Compare versions
  const needsUpdate = compareVersions(currentVersion, LATEST_VERSION) < 0;

  if (!needsUpdate) {
    return NextResponse.json({ 
      new_version: LATEST_VERSION,
      message: 'You are running the latest version.',
    });
  }

  return NextResponse.json({
    new_version: LATEST_VERSION,
    download_url: DOWNLOAD_URL,
    url: 'https://yourapp.com/plugin',
    requires: '6.0',
    tested: '6.4',
    requires_php: '7.4',
    last_updated: '2024-01-15',
    description: 'AutoBlogger Integration - AI-powered autoblogging for WordPress.',
    changelog: `
      <h4>Version ${LATEST_VERSION}</h4>
      <ul>
        <li>Added: Multi-site support</li>
        <li>Fixed: Connection timeout issues</li>
        <li>Improved: Error handling</li>
      </ul>
    `,
    message: 'Important: This update includes security fixes. Please update immediately.',
  });
}

function compareVersions(a: string, b: string): number {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);
  
  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] || 0;
    const bVal = bParts[i] || 0;
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
  }
  return 0;
}
```

#### Deliverables

- ✅ WordPress plugin (zip artifact)
- ✅ HMAC authentication
- ✅ Plugin REST endpoints
- ✅ SaaS wp-client package
- ✅ Connection UI
- ✅ Diagnostics panel
- ✅ Plugin auto-updater


#### Acceptance Criteria

- Can pair via plugin with pairing code
- Can connect via Application Password
- Ping endpoint returns correct data
- Test connection validates auth
- Diagnostics shows helpful error messages
- Plugin packaged as installable zip
- Plugin auto-updates from SaaS API

***

### Phase 5: Content Editor \& Conversion (Week 4-5)

**Goal**: Markdown editor with Gutenberg conversion and preview

#### Tasks

1. **Install editor dependencies**

```bash
npm install @uiw/react-markdown-editor
npm install rehype-stringify remark-parse remark-rehype
npm install turndown
```

2. **Create content module**
    - `modules/content/components/ContentEditor.tsx`
    - `modules/content/components/MarkdownEditor.tsx`
    - `modules/content/components/PreviewPanel.tsx`
    - `modules/content/components/SEOPanel.tsx`
    - `modules/content/components/FeaturedImagePicker.tsx`
3. **Markdown to Gutenberg converter**

```typescript
// modules/content/lib/markdown-to-gutenberg.ts
export function markdownToGutenberg(markdown: string): string {
  const html = marked.parse(markdown);
  const dom = parseHTML(html);
  
  let gutenberg = '';
  
  // Convert each element
  dom.querySelectorAll('h1,h2,h3,p,ul,ol,img').forEach(el => {
    if (el.tagName === 'H2') {
      gutenberg += `<!-- wp:heading {"level":2} -->
<h2>${el.textContent}</h2>
<!-- /wp:heading -->\n\n`;
    } else if (el.tagName === 'P') {
      gutenberg += `<!-- wp:paragraph -->
<p>${el.innerHTML}</p>
<!-- /wp:paragraph -->\n\n`;
    } else if (el.tagName === 'IMG') {
      gutenberg += `<!-- wp:image {"id":${mediaId}} -->
<figure class="wp-block-image">
  <img src="${el.src}" alt="${el.alt}"/>
</figure>
<!-- /wp:image -->\n\n`;
    }
    // ... handle lists, headings, etc.
  });
  
  return gutenberg;
}
```

4. **SEO analyzer**

```typescript
// modules/content/lib/seo-analyzer.ts
export function analyzeSEO(content: string, focusKeyword: string) {
  const wordCount = content.split(/\s+/).length;
  const keywordDensity = calculateDensity(content, focusKeyword);
  const headings = extractHeadings(content);
  const readability = calculateFleschKincaid(content);
  
  let score = 0;
  const suggestions = [];
  
  // Check keyword in title
  if (title.includes(focusKeyword)) score += 20;
  else suggestions.push('Add focus keyword to title');
  
  // Check keyword density (1-3% ideal)
  if (keywordDensity >= 1 && keywordDensity <= 3) score += 20;
  else suggestions.push('Adjust keyword density to 1-3%');
  
  // Check headings structure
  if (headings.h2 >= 2) score += 15;
  else suggestions.push('Add at least 2 H2 headings');
  
  // Check word count (800+ ideal)
  if (wordCount >= 800) score += 15;
  else suggestions.push(`Add ${800 - wordCount} more words`);
  
  // Check readability
  if (readability >= 60) score += 15;
  else suggestions.push('Improve readability (shorter sentences)');
  
  // Check meta description
  if (metaDesc && metaDesc.length >= 120 && metaDesc.length <= 160) {
    score += 15;
  } else {
    suggestions.push('Write meta description (120-160 chars)');
  }
  
  return { score, suggestions };
}
```

5. **Content quality gates**

```typescript
// modules/content/lib/content-quality-gates.ts
export async function validateContent(content: ScheduledPost) {
  const issues = [];
  
  // Required fields
  if (!content.title) issues.push({ type: 'error', msg: 'Title required' });
  if (!content.markdown) issues.push({ type: 'error', msg: 'Content required' });
  if (!content.featuredImageMode) issues.push({ type: 'error', msg: 'Featured image required' });
  
  // Content quality
  const wordCount = content.markdown.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push({ type: 'warning', msg: 'Content too short (min 300 words)' });
  }
  
  // SEO checks
  if (!content.metaTitle) {
    issues.push({ type: 'warning', msg: 'Meta title missing' });
  }
  if (!content.metaDescription) {
    issues.push({ type: 'warning', msg: 'Meta description missing' });
  }
  
  // Profanity filter
  const hasProfanity = checkProfanity(content.markdown);
  if (hasProfanity) {
    issues.push({ type: 'error', msg: 'Content contains inappropriate language' });
  }
  
  return {
    isValid: issues.filter(i => i.type === 'error').length === 0,
    issues,
  };
}
```

6. **Preview panel**
    - Render Gutenberg HTML
    - Show mobile/desktop views
    - Show featured image
    - Show meta preview (title/description in SERP)

#### Deliverables

- ✅ Markdown editor
- ✅ Markdown → Gutenberg converter
- ✅ SEO analyzer
- ✅ Content quality gates
- ✅ Preview panel


#### Acceptance Criteria

- Can write content in Markdown
- Preview shows correct Gutenberg rendering
- SEO score calculated correctly
- Quality gates block invalid content
- Gutenberg HTML renders correctly in WordPress

***

### Phase 6: AI Content Generation (Week 5-6)

**Goal**: AI-powered content generation with quality gates

#### Tasks

1. **Create ai-gateway package**

```typescript
// packages/ai-gateway/src/client.ts
export class AIGateway {
  async generateText(prompt: string, options: GenerateOptions) {
    const chain = await this.getFallbackChain('text', options.orgId);
    
    for (const endpoint of chain) {
      try {
        const result = await this.tryProvider(endpoint, prompt, options);
        
        await this.logUsage({
          organizationId: options.orgId,
          providerId: endpoint.id,
          providerName: endpoint.name,
          requestType: 'text',
          model: endpoint.defaultModelText,
          tokensUsed: result.usage.total_tokens,
          costUsd: calculateCost(result.usage, endpoint.pricing),
          success: true,
          latencyMs: result.latency,
        });
        
        return result.content;
      } catch (error) {
        if (isPermanentError(error)) {
          // Skip to next provider
          continue;
        }
        
        // Retry with backoff for transient errors
        await retry(() => this.tryProvider(endpoint, prompt, options), {
          retries: 2,
          backoff: 'exponential',
        });
      }
    }
    
    throw new Error('All AI providers unavailable');
  }
}
```

2. **Content generation pipeline**

```typescript
// modules/content/actions/generate-content.ts
export async function generateContent(input: GenerateContentInput) {
  // Step 1: Generate outline
  const outlinePrompt = `Create a detailed outline for a blog post about "${input.topic}".
  Target audience: ${input.targetAudience}
  Tone: ${input.tone}
  Include: Introduction, 3-5 main sections, Conclusion`;
  
  const outline = await aiGateway.generateText(outlinePrompt, {
    orgId: input.organizationId,
    model: 'gpt-4o-mini', // Cheap model for outlines
  });
  
  // Step 2: Generate content sections
  const sections = [];
  for (const section of parseOutline(outline)) {
    const sectionPrompt = `Write the "${section.title}" section.
    Context: ${input.topic}
    Tone: ${input.tone}
    Length: ~300 words`;
    
    const content = await aiGateway.generateText(sectionPrompt, {
      orgId: input.organizationId,
      model: 'gpt-4o', // Better model for content
    });
    
    sections.push({ title: section.title, content });
  }
  
  // Step 3: Combine and format
  let markdown = `# ${input.title}\n\n`;
  for (const section of sections) {
    markdown += `## ${section.title}\n\n${section.content}\n\n`;
  }
  
  // Step 4: SEO optimization pass
  if (input.focusKeyword) {
    const seoPrompt = `Optimize this content for SEO.
    Focus keyword: "${input.focusKeyword}"
    Current density: ${calculateDensity(markdown, input.focusKeyword)}%
    Target: 1-3%
    
    ${markdown}`;
    
    markdown = await aiGateway.generateText(seoPrompt, {
      orgId: input.organizationId,
    });
  }
  
  // Step 5: Quality checks
  const validation = await validateContent({
    title: input.title,
    markdown,
    focusKeyword: input.focusKeyword,
  });
  
  if (!validation.isValid) {
    throw new Error(`Content quality check failed: ${validation.issues.join(', ')}`);
  }
  
  // Step 6: Convert to Gutenberg
  const gutenbergHtml = markdownToGutenberg(markdown);
  
  return {
    markdown,
    gutenbergHtml,
    outline,
    seoScore: validation.seoScore,
  };
}
```

3. **AI provider settings UI**
    - `modules/ai/components/ProviderList.tsx`
    - `modules/ai/components/AddProviderDialog.tsx`
    - `modules/ai/components/FallbackChainEditor.tsx`
    - Show managed providers (your keys)
    - Allow BYOK providers (paid only)
    - Drag-and-drop fallback chain ordering
4. **SSRF protection**

```typescript
// packages/security/src/ssrf-guard.ts
import { isPrivateIp } from 'private-ip';
import dns from 'dns/promises';

export async function validateUrl(url: string, env: string) {
  const parsed = new URL(url);
  
  // Dev-only: allow localhost
  if (env !== 'production') {
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return { valid: true };
    }
  }
  
  // Production: require HTTPS
  if (env === 'production' && parsed.protocol !== 'https:') {
    return { valid: false, reason: 'HTTPS required in production' };
  }
  
  // Resolve DNS
  const addresses = await dns.resolve(parsed.hostname);
  
  // Block private IPs
  for (const ip of addresses) {
    if (isPrivateIp(ip)) {
      return { valid: false, reason: 'Private IP addresses not allowed' };
    }
    
    // Block cloud metadata IPs
    if (ip === '169.254.169.254') {
      return { valid: false, reason: 'Cloud metadata IP blocked' };
    }
  }
  
  return { valid: true };
}
```

5. **Content Moderation (AI Safety)**

```typescript
// modules/content/lib/content-moderation.ts
import OpenAI from 'openai';

interface ModerationResult {
  safe: boolean;
  flagged: boolean;
  categories: string[];
  action: 'allow' | 'warn' | 'block';
  reason?: string;
}

export async function moderateContent(text: string): Promise<ModerationResult> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const moderation = await openai.moderations.create({ input: text });
    
    const result = moderation.results[0];
    const flagged = result.flagged;
    
    // Get flagged categories
    const categories = Object.entries(result.categories)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    
    if (flagged) {
      // Determine severity
      const severeCategories = ['violence', 'hate', 'self-harm', 'sexual'];
      const hasSevere = categories.some(c => severeCategories.includes(c));
      
      return {
        safe: false,
        flagged: true,
        categories,
        action: hasSevere ? 'block' : 'warn',
        reason: `Content flagged for: ${categories.join(', ')}`,
      };
    }
    
    return {
      safe: true,
      flagged: false,
      categories: [],
      action: 'allow',
    };
  } catch (error) {
    // On error, allow but log
    console.error('Moderation API error:', error);
    return {
      safe: true,
      flagged: false,
      categories: [],
      action: 'allow',
    };
  }
}

// Profanity filter (lightweight, local check)
const profanityList = ['badword1', 'badword2', /* ... */];

export function checkProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
}

// Plagiarism check (optional, via Copyscape API)
export async function checkPlagiarism(text: string): Promise<{
  unique: boolean;
  similarity: number;
  sources?: string[];
}> {
  // Implementation depends on plagiarism API
  // This is a placeholder
  return { unique: true, similarity: 0 };
}
```

**Content Moderation Integration:**

```typescript
// modules/content/actions/generate-content.ts (updated)
export async function generateContent(input: GenerateContentInput) {
  // ... existing generation logic ...
  
  // Step 5: Quality checks (updated with moderation)
  const moderationResult = await moderateContent(markdown);
  
  if (moderationResult.action === 'block') {
    throw new Error(`Content blocked: ${moderationResult.reason}`);
  }
  
  const validation = await validateContent({
    title: input.title,
    markdown,
    focusKeyword: input.focusKeyword,
  });
  
  // Include moderation warning in response
  return {
    markdown,
    gutenbergHtml,
    outline,
    seoScore: validation.seoScore,
    moderationWarning: moderationResult.action === 'warn' ? moderationResult.reason : null,
  };
}
```

**Moderation Categories:**
- `violence` - Violent content
- `sexual` - Sexual content
- `hate` - Hate speech
- `harassment` - Harassment
- `self-harm` - Self-harm content
- `illicit` - Illegal content
- `self-harm/intent` - Self-harm intent
- `self-harm/instructions` - Self-harm instructions


#### Deliverables

- ✅ AI gateway package
- ✅ Content generation pipeline
- ✅ Provider fallback chains
- ✅ SSRF protection
- ✅ Cost tracking
- ✅ Content moderation (AI safety)


#### Acceptance Criteria

- AI generates coherent content
- SEO optimization applied
- Quality gates enforce standards
- Provider fallback works (simulate failure)
- SSRF protection blocks private IPs
- BYOK locked for free users
- Content moderation blocks inappropriate content

***

### Phase 7: Featured Image Pipeline (Week 6)

**Goal**: Required featured images with 3 modes: AI, upload, URL

#### Tasks

1. **Image generation**

```typescript
// modules/content/actions/generate-image.ts
export async function generateFeaturedImage(input: GenerateImageInput) {
  // Extract key concepts from content
  const concepts = extractKeyPhrases(input.content, 3);
  
  const prompt = input.customPrompt || 
    `A professional blog featured image representing: ${concepts.join(', ')}. 
     Style: ${input.style || 'modern, clean, minimalist'}. 
     No text in image.`;
  
  const imageChain = await getImageFallbackChain(input.orgId);
  
  for (const provider of imageChain) {
    try {
      const response = await fetch(`${provider.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await decrypt(provider.apiKeyEncrypted)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: provider.defaultModelImage,
          prompt,
          size: '1792x1024',
          quality: 'standard',
          n: 1,
        }),
      });
      
      const data = await response.json();
      const imageUrl = data.data.url || data.data.b64_json;
      
      // Download and store in R2/S3
      const objectKey = await uploadToStorage(imageUrl);
      
      return {
        objectKey,
        prompt,
        provider: provider.name,
      };
    } catch (error) {
      // Try next provider
      continue;
    }
  }
  
  throw new Error('All image providers failed');
}
```

2. **Image upload handler**

```typescript
// app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Validate
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Must be an image' }, { status: 400 });
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max 5MB' }, { status: 400 });
  }
  
  // Upload to R2/S3
  const buffer = await file.arrayBuffer();
  const objectKey = `images/${orgId}/${Date.now()}-${file.name}`;
  
  await r2.putObject({
    Bucket: env.R2_BUCKET,
    Key: objectKey,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  });
  
  return NextResponse.json({ objectKey, cdnUrl: `${env.CDN_URL}/${objectKey}` });
}
```

3. **URL import with SSRF protection**

```typescript
// modules/content/actions/import-image-url.ts
export async function importImageFromUrl(url: string, orgId: string) {
  // SSRF validation
  const validation = await validateUrl(url, process.env.NODE_ENV);
  if (!validation.valid) {
    throw new Error(`Invalid URL: ${validation.reason}`);
  }
  
  // Fetch image
  const response = await fetch(url, {
    headers: { 'User-Agent': 'AutoBlogger/1.0' },
    redirect: 'manual', // Don't follow redirects
  });
  
  // Validate content type
  const contentType = response.headers.get('content-type');
  if (!contentType?.startsWith('image/')) {
    throw new Error('URL does not point to an image');
  }
  
  // Validate size
  const contentLength = parseInt(response.headers.get('content-length') || '0');
  if (contentLength > 10 * 1024 * 1024) {
    throw new Error('Image too large (max 10MB)');
  }
  
  // Store in R2/S3
  const buffer = await response.arrayBuffer();
  const objectKey = `images/${orgId}/${Date.now()}.jpg`;
  
  await r2.putObject({
    Bucket: env.R2_BUCKET,
    Key: objectKey,
    Body: Buffer.from(buffer),
    ContentType: contentType,
  });
  
  return { objectKey };
}
```

4. **WordPress media import**

```typescript
// packages/wp-client/src/plugin-client.ts
async importMedia(sourceUrl: string, filename: string, alt: string) {
  return this.request('/media/import', {
    method: 'POST',
    body: JSON.stringify({ source_url: sourceUrl, filename, alt }),
  });
}
```

```php
// WordPress plugin: includes/class-media-handler.php
function handle_media_import($request) {
  $sourceUrl = $request['source_url'];
  $filename = $request['filename'];
  $alt = $request['alt'];
  
  // Download file
  $tmpFile = download_url($sourceUrl);
  if (is_wp_error($tmpFile)) {
    return new WP_Error('download_failed', $tmpFile->get_error_message());
  }
  
  // Prepare file for WP
  $fileArray = [
    'name' => $filename,
    'tmp_name' => $tmpFile,
  ];
  
  // Import to media library
  $mediaId = media_handle_sideload($fileArray);
  
  if (is_wp_error($mediaId)) {
    @unlink($tmpFile);
    return $mediaId;
  }
  
  // Set alt text
  update_post_meta($mediaId, '_wp_attachment_image_alt', $alt);
  
  return [
    'media_id' => $mediaId,
    'source_url' => wp_get_attachment_url($mediaId),
  ];
}
```


#### Deliverables

- ✅ AI image generation
- ✅ Image upload
- ✅ URL import with SSRF protection
- ✅ WordPress media import
- ✅ Featured image required enforcement


#### Acceptance Criteria

- AI generates relevant images
- Image fallback chain works
- Can upload images (<5MB)
- URL import validates and blocks private IPs
- Images imported into WordPress media library
- Publishing blocked without featured image

***

### Phase 8: Planner \& Worker (Week 7-8)

**Goal**: Calendar scheduling with BullMQ worker

#### Tasks

1. **Install BullMQ**

```bash
npm install bullmq ioredis
```

2. **Create planner module**
    - `modules/planner/components/CalendarView.tsx`
    - `modules/planner/components/ScheduleDialog.tsx`
    - `modules/planner/actions/schedule-post.ts`
3. **Enqueue job**

```typescript
// modules/planner/actions/schedule-post.ts
import { Queue } from 'bullmq';
import { connection } from '@/lib/redis';

const publishQueue = new Queue('publish', { connection });

export async function schedulePost(data: SchedulePostInput) {
  // Create ScheduledPost record
  const post = await db.scheduledPost.create({
    data: {
      projectId: data.projectId,
      externalId: generateId(),
      title: data.title,
      markdown: data.markdown,
      gutenbergHtml: data.gutenbergHtml,
      status: 'scheduled',
      desiredStatus: data.desiredStatus, // draft or publish
      scheduledAt: data.scheduledAt,
      featuredImageMode: data.featuredImageMode,
      featuredImageSource: data.featuredImageSource,
      categories: data.categories,
      tags: data.tags,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      focusKeyword: data.focusKeyword,
    },
  });
  
  // Enqueue BullMQ job
  await publishQueue.add(
    'publish-post',
    { scheduledPostId: post.id },
    {
      jobId: `publish-${post.id}`,
      delay: data.scheduledAt.getTime() - Date.now(),
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    }
  );
  
  return post;
}
```

4. **Worker implementation**

```typescript
// apps/worker/src/jobs/publish-post.ts
import { Worker, Job } from 'bullmq';
import { connection } from './lib/redis';

const worker = new Worker(
  'publish',
  async (job: Job) => {
    const { scheduledPostId } = job.data;
    const traceId = generateTraceId();
    
    logger.info('Starting publish job', { scheduledPostId, traceId });
    
    // Create JobRun record
    const jobRun = await db.jobRun.create({
      data: {
        scheduledPostId,
        jobId: job.id,
        traceId,
        status: 'running',
      },
    });
    
    try {
      // Load post
      const post = await db.scheduledPost.findUnique({
        where: { id: scheduledPostId },
        include: { project: { include: { wpConnection: true } } },
      });
      
      if (!post) throw new Error('Post not found');
      
      // Ensure featured image exists
      let mediaId = post.wpMediaId;
      if (!mediaId && post.featuredImageMode) {
        const imageResult = await ensureFeaturedImage(post);
        mediaId = imageResult.wpMediaId;
      }
      
      // Get organization plan
      const org = await db.organization.findUnique({
        where: { id: post.project.organizationId },
      });
      
      // Enforce plan limits
      let publishStatus = post.desiredStatus;
      if (org.planId === 'free' && publishStatus === 'publish') {
        publishStatus = 'draft'; // Force draft for free tier
      }
      
      // Publish to WordPress
      const wpClient = createWPClient(post.project.wpConnection);
      
      const wpResult = await wpClient.upsertPost({
        externalId: post.externalId,
        title: post.title,
        content: post.gutenbergHtml,
        status: publishStatus,
        dateGmt: post.scheduledAt?.toISOString(),
        slug: post.slug,
        categories: post.categories,
        tags: post.tags,
        featuredMediaId: mediaId,
        seo: {
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          focusKeyword: post.focusKeyword,
        },
      });
      
      // Update post record
      await db.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: 'published',
          wpPostId: wpResult.postId,
          wpEditUrl: wpResult.editUrl,
          publishedAt: new Date(),
        },
      });
      
      // Update JobRun
      await db.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: 'completed',
          finishedAt: new Date(),
          wpResponseCode: 200,
          wpResponseSummary: wpResult,
        },
      });
      
      // Increment usage counter
      await db.organization.update({
        where: { id: org.id },
        data: { publishesThisMonth: { increment: 1 } },
      });
      
      logger.info('Job completed', { scheduledPostId, wpPostId: wpResult.postId });
      
    } catch (error) {
      logger.error('Job failed', { scheduledPostId, error });
      
      await db.jobRun.update({
        where: { id: jobRun.id },
        data: {
          status: 'failed',
          finishedAt: new Date(),
          errorMessage: error.message,
          errorStack: error.stack,
        },
      });
      
      throw error; // BullMQ will retry
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  logger.info('Worker completed job', { jobId: job.id });
});

worker.on('failed', (job, err) => {
  logger.error('Worker failed job', { jobId: job?.id, error: err });
});
```

5. **Idempotency enforcement**
    - Use `externalId` to prevent duplicate posts
    - WordPress plugin checks for existing post with this meta key
    - Worker retries are safe

#### Deliverables

- ✅ Calendar UI
- ✅ BullMQ queue setup
- ✅ Worker service
- ✅ Publishing logic
- ✅ Plan enforcement in worker


#### Acceptance Criteria

- Can schedule posts
- Worker executes at scheduled time
- Free tier forced to draft
- Paid tier can publish
- Retries don't duplicate posts
- Job logs created

***

### Phase 9: Observability \& Diagnostics (Week 9)

**Goal**: Comprehensive logging, monitoring, and debugging tools

#### Tasks

1. **Install observability tools**

```bash
npm install @sentry/nextjs
npm install posthog-js posthog-node
npm install pino pino-pretty
```

2. **Structured logging**

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: ['password', 'apiKey', 'secret', 'token'],
    remove: true,
  },
});

// Usage
logger.info({ orgId, projectId, action: 'project.create' }, 'Project created');
logger.error({ error, scheduledPostId }, 'Failed to publish post');
```

3. **Sentry integration**

```typescript
// instrumentation.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event, hint) {
    // Scrub sensitive data
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['x-ya-signature'];
    }
    return event;
  },
});
```

4. **Diagnostics panel**

```typescript
// modules/wp/components/DiagnosticsPanel.tsx
export function DiagnosticsPanel({ projectId }: Props) {
  const { data: diagnostics } = useQuery({
    queryKey: ['wp-diagnostics', projectId],
    queryFn: () => runDiagnostics(projectId),
  });
  
  return (
    <div>
      <DiagnosticItem
        label="WordPress Version"
        value={diagnostics.wpVersion}
        status={diagnostics.wpVersion >= '6.0' ? 'ok' : 'warning'}
      />
      
      <DiagnosticItem
        label="REST API"
        value={diagnostics.restOk ? 'Reachable' : 'Blocked'}
        status={diagnostics.restOk ? 'ok' : 'error'}
        suggestion={!diagnostics.restOk && 'Check security plugins and WAF settings'}
      />
      
      <DiagnosticItem
        label="Connection Mode"
        value={diagnostics.mode}
        status="ok"
      />
      
      <DiagnosticItem
        label="Last Ping"
        value={formatDistance(diagnostics.lastCheckedAt, new Date())}
        status={diagnostics.lastCheckedAt > Date.now() - 60000 ? 'ok' : 'warning'}
      />
      
      {diagnostics.detectedPlugins.wordfence && (
        <Alert>
          <AlertTitle>Wordfence Detected</AlertTitle>
          <AlertDescription>
            Ensure Application Passwords are enabled in Wordfence settings.
            <Link href="/docs/wordfence">Learn more</Link>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

5. **Job logs UI**

```typescript
// modules/jobs/components/JobLogsList.tsx
export function JobLogsList({ scheduledPostId }: Props) {
  const { data: logs } = useQuery({
    queryKey: ['job-logs', scheduledPostId],
    queryFn: () => getJobLogs(scheduledPostId),
  });
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Started</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>WP Response</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{format(log.startedAt, 'PPp')}</TableCell>
            <TableCell>
              <Badge variant={log.status === 'completed' ? 'success' : 'destructive'}>
                {log.status}
              </Badge>
            </TableCell>
            <TableCell>{log.durationMs}ms</TableCell>
            <TableCell>
              {log.textProviderUsed}
              {log.fallbackCount > 0 && ` (+${log.fallbackCount} fallbacks)`}
            </TableCell>
            <TableCell>
              {log.wpResponseCode === 200 ? (
                <Check className="text-green-500" />
              ) : (
                <X className="text-red-500" />
              )}
            </TableCell>
            <TableCell>
              <Button onClick={() => openDetailsDialog(log)}>Details</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

6. **Health endpoints**

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    storage: await checkStorage(),
  };
  
  const healthy = Object.values(checks).every(c => c.ok);
  
  return NextResponse.json(
    { status: healthy ? 'ok' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  );
}
```


#### Deliverables

- ✅ Structured logging
- ✅ Sentry error tracking
- ✅ Diagnostics panel
- ✅ Job logs UI
- ✅ Health endpoints


#### Acceptance Criteria

- All logs have traceId/orgId/projectId
- Sentry captures errors
- Diagnostics panel shows actionable suggestions
- Support can debug from job logs UI
- Health endpoint returns correct status

***

### Phase 10: Testing \& Quality Assurance (Week 9-10)

**Goal**: Comprehensive test coverage and QA

#### Tasks

1. **Unit tests**

```typescript
// __tests__/lib/hmac.test.ts
describe('HMAC signing', () => {
  it('generates valid signature', () => {
    const signature = generateHMAC({
      method: 'POST',
      path: '/posts/upsert',
      timestamp: 1234567890,
      nonce: 'abc123',
      body: '{"title":"Test"}',
      secret: 'supersecret',
    });
    
    expect(signature).toMatch(/^[A-Za-z0-9+/=]+$/);
  });
  
  it('rejects old timestamps', () => {
    const isValid = verifyHMAC({
      timestamp: Date.now() / 1000 - 400, // 400 seconds ago
    });
    
    expect(isValid).toBe(false);
  });
});
```

2. **Integration tests**

```typescript
// __tests__/integration/publish.test.ts
describe('Publishing flow', () => {
  it('publishes post to WordPress', async () => {
    // Setup mock WP server
    const wpServer = await startMockWPServer();
    
    // Create test data
    const org = await createTestOrg({ planId: 'starter' });
    const project = await createTestProject({ organizationId: org.id });
    await createWPConnection({
      projectId: project.id,
      siteUrl: wpServer.url,
    });
    
    // Schedule post
    const post = await schedulePost({
      projectId: project.id,
      title: 'Test Post',
      markdown: '## Hello World',
      desiredStatus: 'publish',
      scheduledAt: new Date(Date.now() + 1000),
    });
    
    // Wait for worker to process
    await waitForJob(post.id, { timeout: 5000 });
    
    // Verify WordPress received the post
    const wpCalls = wpServer.getCalls();
    expect(wpCalls).toHaveLength(1);
    expect(wpCalls.body.title).toBe('Test Post');
    expect(wpCalls.body.status).toBe('publish');
    
    // Verify database updated
    const updated = await db.scheduledPost.findUnique({ where: { id: post.id } });
    expect(updated.status).toBe('published');
    expect(updated.wpPostId).toBeDefined();
  });
});
```

3. **WordPress compatibility testing**
    - Test WordPress 6.0, 6.2, 6.4+
    - Test with Wordfence, Sucuri, iThemes Security
    - Test with Yoast, Rank Math, AIOSEO
    - Test on WP Engine, SiteGround, Kinsta hosting
4. **AI provider fallback testing**

```typescript
// __tests__/integration/ai-fallback.test.ts
describe('AI provider fallback', () => {
  it('falls back when primary provider fails', async () => {
    // Setup: Provider 1 returns 429, Provider 2 succeeds
    const mockProvider1 = createMockProvider({
      response: { status: 429, body: 'Rate limited' },
    });
    
    const mockProvider2 = createMockProvider({
      response: { status: 200, body: { choices: [{ message: { content: 'Test' } }] } },
    });
    
    await setupFallbackChain(org.id, [mockProvider1.id, mockProvider2.id]);
    
    // Execute
    const result = await aiGateway.generateText('Test prompt', { orgId: org.id });
    
    // Verify
    expect(result).toBe('Test');
    expect(mockProvider1.calls).toHaveLength(1);
    expect(mockProvider2.calls).toHaveLength(1);
    
    // Verify usage logged
    const usage = await db.aiProviderUsage.findFirst({
      where: { organizationId: org.id },
    });
    expect(usage.providerId).toBe(mockProvider2.id);
  });
});
```

5. **Load testing**

```bash
# k6 load test script
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 50,
  duration: '30s',
};

export default function() {
  let res = http.post(
    'https://api.yourapp.com/api/content/generate',
    JSON.stringify({
      topic: 'Test topic',
      targetAudience: 'Developers',
    }),
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${__ENV.TOKEN}` } }
  );
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
  });
}
```


#### Deliverables

- ✅ Unit test suite
- ✅ Integration tests
- ✅ E2E tests
- ✅ WordPress compatibility matrix
- ✅ Load tests


#### Acceptance Criteria

- 80%+ code coverage
- All critical paths tested
- CI passes on every commit
- WordPress compatibility documented

***

### Phase 11: Deployment \& DevOps (Week 10)

**Goal**: Production-ready deployment with CI/CD

#### Tasks

1. **Docker setup**

```dockerfile
# apps/worker/Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/index.js"]
```

2. **Docker Compose for local dev**

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: autoblogger
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - '5432:5432'
    volumes:
      - postgres-data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
  
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - minio-data:/data
  
  web:
    build:
      context: ./apps/web
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/autoblogger
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
  
  worker:
    build:
      context: ./apps/worker
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/autoblogger
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres-data:
  minio-data:
```

3. **CI/CD pipeline**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run typecheck
      
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
      
      - name: Build
        run: npm run build
```

4. **Deployment configs**

```yaml
# Deploy to Vercel (web)
# vercel.json
{
  "buildCommand": "turbo run build --filter=web",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database_url",
    "REDIS_URL": "@redis_url",
    "STRIPE_SECRET_KEY": "@stripe_secret_key"
  }
}
```

```yaml
# Deploy to Railway (worker)
# railway.toml
[build]
builder = "dockerfile"
dockerfilePath = "apps/worker/Dockerfile"

[deploy]
restartPolicyType = "on-failure"
restartPolicyMaxRetries = 3
```

5. **Environment management**

```bash
# .env.example
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/autoblogger

# Redis
REDIS_URL=redis://localhost:6379

# Auth
BETTER_AUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Email
MAILJET_API_KEY=
MAILJET_SECRET_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
CDN_URL=

# AI Providers (managed)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Monitoring
SENTRY_DSN=
POSTHOG_API_KEY=

# Security
ENCRYPTION_KEY=your-32-byte-key-here
```


#### Deliverables

- ✅ Docker containers
- ✅ Docker Compose
- ✅ CI/CD pipeline
- ✅ Deployment configs
- ✅ Environment documentation


#### Acceptance Criteria

- Local dev runs via `docker-compose up`
- CI passes on every commit
- Web app deploys to Vercel
- Worker deploys to Railway
- Environment variables documented

***

### Phase 11.5: API Documentation (Week 10-11)

**Goal**: Create comprehensive API documentation for public API and webhooks

#### Tasks

##### 1. Install API Documentation Tools

```bash
npm install @scalar/nextjs-api-reference
# or alternatively
npm install swagger-jsdoc swagger-ui-react
```

##### 2. Create OpenAPI Specification

```typescript
// docs/api/openapi.ts
export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'AutoBlogger API',
    version: '1.0.0',
    description: 'API for AI-powered WordPress autoblogging',
    contact: {
      name: 'API Support',
      email: 'api@yourapp.com',
    },
  },
  servers: [
    { url: 'https://api.yourapp.com', description: 'Production' },
    { url: 'http://localhost:3000', description: 'Development' },
  ],
  security: [
    { bearerAuth: [] },
    { apiKey: [] },
  ],
  paths: {
    '/api/v1/projects': {
      get: {
        summary: 'List all projects',
        tags: ['Projects'],
        responses: {
          '200': {
            description: 'List of projects',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProjectList' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new project',
        tags: ['Projects'],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProjectInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Project created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Project' },
              },
            },
          },
        },
      },
    },
    '/api/v1/projects/{projectId}/posts': {
      get: {
        summary: 'List posts in a project',
        tags: ['Posts'],
        parameters: [
          { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'scheduled', 'published', 'failed'] } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
        ],
        responses: {
          '200': {
            description: 'List of posts',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PostList' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new post',
        tags: ['Posts'],
        parameters: [
          { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreatePostInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Post created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Post' },
              },
            },
          },
        },
      },
    },
    '/api/v1/projects/{projectId}/posts/{postId}/schedule': {
      post: {
        summary: 'Schedule a post for publishing',
        tags: ['Posts'],
        parameters: [
          { name: 'projectId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'postId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  scheduledAt: { type: 'string', format: 'date-time' },
                  status: { type: 'string', enum: ['draft', 'publish'] },
                },
                required: ['scheduledAt'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Post scheduled',
          },
        },
      },
    },
    '/api/v1/generate': {
      post: {
        summary: 'Generate AI content',
        tags: ['AI'],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/GenerateContentInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Generated content',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GeneratedContent' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ProjectList: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Project' },
          },
          total: { type: 'integer' },
        },
      },
      CreateProjectInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
        },
      },
      Post: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'scheduled', 'published', 'failed'] },
          scheduledAt: { type: 'string', format: 'date-time' },
          publishedAt: { type: 'string', format: 'date-time' },
          wpPostId: { type: 'integer' },
          wpEditUrl: { type: 'string', format: 'uri' },
        },
      },
      CreatePostInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          markdown: { type: 'string' },
          categories: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
          focusKeyword: { type: 'string' },
        },
      },
      GenerateContentInput: {
        type: 'object',
        required: ['topic'],
        properties: {
          topic: { type: 'string', description: 'Main topic for content generation' },
          title: { type: 'string', description: 'Optional custom title' },
          tone: { type: 'string', enum: ['professional', 'casual', 'technical', 'friendly'] },
          targetAudience: { type: 'string' },
          wordCount: { type: 'integer', minimum: 300, maximum: 3000 },
          focusKeyword: { type: 'string' },
        },
      },
      GeneratedContent: {
        type: 'object',
        properties: {
          markdown: { type: 'string' },
          gutenbergHtml: { type: 'string' },
          seoScore: { type: 'integer' },
          wordCount: { type: 'integer' },
        },
      },
    },
  },
};
```

##### 3. Create API Documentation Page

```typescript
// app/docs/api/page.tsx
import { ApiReference } from '@scalar/nextjs-api-reference';

const config = {
  spec: {
    url: '/api/docs/openapi.json',
  },
  theme: 'purple',
  layout: 'modern',
};

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <ApiReference config={config} />
    </div>
  );
}
```

##### 4. Webhook Documentation

```typescript
// app/docs/webhooks/page.tsx
export default function WebhooksDocsPage() {
  return (
    <div className="container mx-auto py-8 prose prose-lg max-w-4xl">
      <h1>Webhooks</h1>
      <p>
        AutoBlogger can send webhook notifications to your application when certain events occur.
        Configure your webhook URL in the dashboard settings.
      </p>

      <h2>Events</h2>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>post.published</code></td>
            <td>Triggered when a post is successfully published to WordPress</td>
          </tr>
          <tr>
            <td><code>post.failed</code></td>
            <td>Triggered when a post fails to publish</td>
          </tr>
          <tr>
            <td><code>post.scheduled</code></td>
            <td>Triggered when a post is scheduled</td>
          </tr>
          <tr>
            <td><code>content.generated</code></td>
            <td>Triggered when AI content generation completes</td>
          </tr>
          <tr>
            <td><code>subscription.updated</code></td>
            <td>Triggered when subscription plan changes</td>
          </tr>
        </tbody>
      </table>

      <h2>Webhook Payload</h2>
      <pre><code>{`{
  "event": "post.published",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "postId": "clx123abc",
    "title": "My Blog Post",
    "wpPostId": 123,
    "wpEditUrl": "https://example.com/wp-admin/post.php?post=123&action=edit",
    "wpPublicUrl": "https://example.com/my-blog-post",
    "projectId": "proj_abc123",
    "organizationId": "org_xyz789"
  },
  "signature": "sha256=abc123..."
}`}</code></pre>

      <h2>Verifying Webhooks</h2>
      <pre><code>{`import crypto from 'crypto';

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = 'sha256=' + 
    crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}`}</code></pre>

      <h2>Retry Policy</h2>
      <p>
        Webhooks are retried up to 5 times with exponential backoff if your endpoint
        returns a non-2xx response. After 5 failures, the webhook is disabled.
      </p>
    </div>
  );
}
```

##### 5. Code Examples

Create code examples in multiple languages:

```typescript
// app/docs/examples/page.tsx
const codeExamples = {
  typescript: `import { AutoBloggerClient } from '@autoblogger/sdk';

const client = new AutoBloggerClient({
  apiKey: 'your-api-key',
});

// Create a project
const project = await client.projects.create({
  name: 'My Blog',
  description: 'Technology blog',
});

// Generate content
const content = await client.generate({
  topic: 'Introduction to TypeScript',
  tone: 'professional',
  wordCount: 1000,
});

// Schedule the post
await client.posts.schedule({
  projectId: project.id,
  title: content.title,
  markdown: content.markdown,
  scheduledAt: new Date('2024-02-01T10:00:00Z'),
});`,

  python: `import requests

API_KEY = 'your-api-key'
BASE_URL = 'https://api.yourapp.com/api/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json',
}

# Create a project
response = requests.post(
    f'{BASE_URL}/projects',
    headers=headers,
    json={'name': 'My Blog', 'description': 'Technology blog'}
)
project = response.json()

# Generate content
response = requests.post(
    f'{BASE_URL}/generate',
    headers=headers,
    json={
        'topic': 'Introduction to Python',
        'tone': 'professional',
        'wordCount': 1000
    }
)
content = response.json()

# Schedule the post
response = requests.post(
    f'{BASE_URL}/projects/{project["id"]}/posts',
    headers=headers,
    json={
        'title': 'Introduction to Python',
        'markdown': content['markdown'],
        'scheduledAt': '2024-02-01T10:00:00Z'
    }
)`,

  curl: `# Create a project
curl -X POST https://api.yourapp.com/api/v1/projects \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Blog", "description": "Technology blog"}'

# Generate content
curl -X POST https://api.yourapp.com/api/v1/generate \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "Introduction to cURL", "tone": "professional", "wordCount": 1000}'

# Schedule a post
curl -X POST https://api.yourapp.com/api/v1/projects/{projectId}/posts \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "My Post", "markdown": "...", "scheduledAt": "2024-02-01T10:00:00Z"}'`,
};

export default function CodeExamplesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Code Examples</h1>
      {/* Render tabs with code examples */}
    </div>
  );
}
```

#### Deliverables

- ✅ OpenAPI specification
- ✅ API documentation page (Scalar/Swagger)
- ✅ Webhook documentation
- ✅ Code examples (TypeScript, Python, cURL)
- ✅ Authentication documentation


#### Acceptance Criteria

- API docs accessible at /docs/api
- All endpoints documented
- Request/response examples provided
- Webhook events documented
- Code examples work correctly

***

### Phase 11.6: Backup & Disaster Recovery (Week 11)

**Goal**: Implement comprehensive backup strategy and disaster recovery plan

#### Tasks

##### 1. Database Backups

```typescript
// scripts/backup-database.ts
import { exec } from 'child_process';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@prisma/client';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `autoblogger-${timestamp}.sql.gz`;
  const bucket = process.env.BACKUP_BUCKET!;
  
  console.log(`Starting database backup: ${filename}`);

  // Create pg_dump with compression
  const dumpCommand = `pg_dump "${process.env.DATABASE_URL}" | gzip > /tmp/${filename}`;
  
  await new Promise((resolve, reject) => {
    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });

  // Upload to S3 (separate region for disaster recovery)
  const fileBuffer = await fs.readFile(`/tmp/${filename}`);
  
  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: `database/${filename}`,
    Body: fileBuffer,
    ContentType: 'application/gzip',
    Metadata: {
      'backup-type': 'daily',
      'environment': process.env.NODE_ENV!,
    },
  }));

  // Cleanup local file
  await fs.unlink(`/tmp/${filename}`);

  // Log backup completion
  console.log(`Backup completed: ${filename}`);
  
  // Prune old backups (keep 30 daily, 12 weekly, 12 monthly)
  await pruneOldBackups(bucket);

  return { filename, size: fileBuffer.length };
}

async function pruneOldBackups(bucket: string) {
  // Implementation to delete old backups based on retention policy
  // Keep: 30 daily, 12 weekly, 12 monthly
}

// Run backup
backupDatabase().catch(console.error);
```

**Backup Schedule (Cron):**

```yaml
# .github/workflows/backup.yml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install PostgreSQL client
        run: sudo apt-get install -y postgresql-client
      
      - name: Run backup
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          BACKUP_BUCKET: ${{ secrets.BACKUP_BUCKET }}
        run: npx ts-node scripts/backup-database.ts
```

##### 2. Content Backups

```typescript
// scripts/backup-content.ts
import { S3Client, ListObjectsV2Command, CopyObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function backupContent() {
  const sourceBucket = process.env.R2_BUCKET!;
  const backupBucket = process.env.BACKUP_BUCKET!;
  
  // List all objects
  let continuationToken: string | undefined;
  let backedUp = 0;

  do {
    const response = await s3.send(new ListObjectsV2Command({
      Bucket: sourceBucket,
      ContinuationToken: continuationToken,
    }));

    for (const object of response.Contents || []) {
      // Copy to backup bucket with versioning
      await s3.send(new CopyObjectCommand({
        Bucket: backupBucket,
        Key: `content/${object.Key}`,
        CopySource: `${sourceBucket}/${object.Key}`,
        MetadataDirective: 'COPY',
      }));
      backedUp++;
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log(`Backed up ${backedUp} content objects`);
}
```

##### 3. Disaster Recovery Plan

```markdown
# Disaster Recovery Plan

## Recovery Time Objective (RTO): 4 hours
## Recovery Point Objective (RPO): 1 hour

## Scenarios

### 1. Database Failure
1. Stop all application instances
2. Provision new database instance
3. Restore from latest backup:
   ```bash
   # Download latest backup
   aws s3 cp s3://backup-bucket/database/latest.sql.gz /tmp/
   
   # Restore
   gunzip -c /tmp/latest.sql.gz | psql $DATABASE_URL
   ```
4. Verify data integrity
5. Restart application

### 2. Application Failure
1. Identify failed component
2. Roll back to previous deployment:
   ```bash
   vercel rollback
   ```
3. Monitor error rates
4. Investigate root cause

### 3. Redis Failure
1. Redis is ephemeral - no data loss expected
2. Provision new Redis instance
3. Update environment variables
4. Restart workers

### 4. S3/R2 Failure
1. Enable S3 cross-region replication
2. Switch to backup region:
   - Update CDN origin
   - Update application config
3. Monitor for recovery

### 5. Complete Region Failure
1. Activate DR region
2. Restore database from backup
3. Deploy application to DR region
4. Update DNS
5. Notify users

## Backup Locations

| Data Type | Primary | Backup | Retention |
|-----------|---------|--------|-----------|
| Database | Railway | S3 (us-east-1) | 30 daily, 12 weekly, 12 monthly |
| Content (R2) | Cloudflare R2 | S3 (us-west-2) | Indefinite with versioning |
| Redis | Railway | N/A (ephemeral) | N/A |
| Code | GitHub | GitHub | Indefinite |

## Testing

- Monthly: Test database restore in staging
- Quarterly: Full DR drill
- Annually: Complete failover test
```

##### 4. Backup Verification

```typescript
// scripts/verify-backup.ts
import { exec } from 'child_process';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Client } from 'pg';

async function verifyBackup() {
  const timestamp = new Date().toISOString();
  console.log(`Starting backup verification: ${timestamp}`);

  // Download latest backup
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const response = await s3.send(new GetObjectCommand({
    Bucket: process.env.BACKUP_BUCKET!,
    Key: 'database/latest.sql.gz',
  }));

  // Restore to test database
  const testDbUrl = process.env.TEST_DATABASE_URL!;
  
  await execPromise(`gunzip -c ${response.Body} | psql ${testDbUrl}`);

  // Verify data integrity
  const client = new Client({ connectionString: testDbUrl });
  await client.connect();

  const checks = [
    { name: 'Users count', query: 'SELECT COUNT(*) FROM "User"' },
    { name: 'Organizations count', query: 'SELECT COUNT(*) FROM "Organization"' },
    { name: 'Projects count', query: 'SELECT COUNT(*) FROM "Project"' },
    { name: 'Posts count', query: 'SELECT COUNT(*) FROM "ScheduledPost"' },
  ];

  for (const check of checks) {
    const result = await client.query(check.query);
    console.log(`${check.name}: ${result.rows[0].count}`);
  }

  await client.end();

  // Cleanup test database
  await execPromise(`psql ${testDbUrl} -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"`);

  console.log('Backup verification completed successfully');
}

verifyBackup().catch(console.error);
```

##### 5. Monitoring & Alerts

```typescript
// scripts/check-backup-health.ts
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

async function checkBackupHealth() {
  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const bucket = process.env.BACKUP_BUCKET!;

  // Check for recent backups
  const response = await s3.send(new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: 'database/',
    MaxKeys: 10,
  }));

  const latestBackup = response.Contents?.[0];
  if (!latestBackup) {
    throw new Error('No database backups found!');
  }

  const backupAge = Date.now() - latestBackup.LastModified!.getTime();
  const maxAge = 26 * 60 * 60 * 1000; // 26 hours

  if (backupAge > maxAge) {
    throw new Error(`Latest backup is too old: ${latestBackup.LastModified}`);
  }

  // Check backup size (should be at least 1MB)
  if (latestBackup.Size! < 1024 * 1024) {
    throw new Error(`Backup size is suspiciously small: ${latestBackup.Size} bytes`);
  }

  console.log('Backup health check passed');
  return { latestBackup: latestBackup.Key, age: backupAge };
}
```

#### Deliverables

- ✅ Automated daily database backups
- ✅ Content backup to separate region
- ✅ Disaster recovery plan documented
- ✅ Backup verification script
- ✅ Backup health monitoring


#### Acceptance Criteria

- Daily backups run automatically
- Backups stored in separate region
- Backup retention policy enforced
- Monthly restore test passes
- Alerts on backup failures

***

## Security Checklist

### Application Security

- [x] Multi-tenant isolation enforced server-side
- [x] Secrets encrypted at rest (AES-256-GCM)
- [x] HMAC request signing with replay protection
- [x] Rate limiting on auth endpoints
- [x] CAPTCHA on free tier signup
- [x] SSRF protection on all outbound requests
- [x] Input sanitization and validation (Zod)
- [x] SQL injection prevention (Prisma parameterized queries)
- [x] XSS prevention (React escaping + CSP headers)
- [x] CSRF protection (Better Auth + SameSite cookies)


### WordPress Security

- [x] Application Passwords over Basic Auth
- [x] HMAC signing with timestamp + nonce
- [x] Permission callbacks on all REST routes
- [x] No secrets in logs or error messages
- [x] Connection diagnostics for firewall detection


### Infrastructure Security

- [x] HTTPS only in production
- [x] Database connection pooling
- [x] Redis authentication
- [x] Environment variable validation
- [x] Audit logging for sensitive actions

***

## Performance Optimizations

### Frontend

- Next.js App Router with streaming SSR
- TanStack Query for client-side caching
- Image optimization via Next/Image
- Code splitting and lazy loading
- Debounced search and autosave


### Backend

- Database query optimization (indexes)
- Redis caching for frequently accessed data
- BullMQ job priorities (paid users first)
- Rate limiting to prevent abuse
- CDN for static assets


### AI Optimization

- Cheaper models for outlines, better models for final content
- Aggressive prompt caching (1 hour for outlines)
- Token budgets per request type
- Cost tracking per organization
- Provider fallback to cheaper alternatives

***

## Monitoring \& Alerts

### Key Metrics

- **Web App**
    - Response times (p50, p95, p99)
    - Error rate
    - Active users
    - Page views
- **Worker**
    - Job processing time
    - Job success/failure rate
    - Queue depth
    - Provider fallback frequency
- **WordPress**
    - Connection success rate
    - Publish success rate
    - Average publish latency
- **Business**
    - Signups per day
    - Conversion rate (free → paid)
    - Churn rate
    - Monthly recurring revenue (MRR)


### Alerts

- Worker queue depth > 1000
- Job failure rate > 10%
- Database connection pool exhausted
- WordPress connection failures > 5 in 10 minutes
- AI provider cost > \$100/hour
- Disk usage > 80%
- Memory usage > 90%

***

## Launch Checklist

### Pre-Launch Essentials

- [ ] **Brand identity defined** (colors, logo, typography)
- [ ] **Email templates** (6 templates minimum: verification, welcome, reset, receipt, job-failed, digest)
- [ ] **Rate limiting** configured per endpoint
- [ ] **GDPR compliance** (cookie consent, privacy policy, data export/delete)
- [ ] **Error boundaries** on all routes
- [ ] **Loading states** for all async operations
- [ ] **Onboarding flow** for new users
- [ ] **Feature flags** system
- [ ] **Content moderation** (AI safety checks)
- [ ] **API documentation** public
- [ ] **Backup strategy** documented and tested
- [ ] **WordPress plugin auto-updater**
- [ ] **Status page** (e.g., status.yourapp.com)
- [ ] **Legal pages** (terms, privacy, cookies, DPA)
- [ ] **Support widget** (Intercom, Crisp, or Tawk.to)

### Pre-Launch

- [ ] All phases completed and tested
- [ ] WordPress plugin submitted to WordPress.org
- [ ] Documentation published (API docs, user guides)
- [ ] Pricing page live
- [ ] Terms of Service + Privacy Policy
- [ ] GDPR compliance review
- [ ] Security audit completed
- [ ] Load testing passed
- [ ] Monitoring and alerts configured
- [ ] Database backups verified
- [ ] Disaster recovery plan tested
- [ ] Email deliverability tested (SPF, DKIM, DMARC)
- [ ] SSL certificates validated
- [ ] CDN configured and tested


### Launch Day

- [ ] Deploy to production
- [ ] DNS configured
- [ ] SSL certificates validated
- [ ] Stripe webhooks configured
- [ ] Email deliverability tested
- [ ] Support email monitored
- [ ] Status page live
- [ ] Error tracking (Sentry) verified
- [ ] Analytics (PostHog) verified
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Redis connected
- [ ] Worker service running


### Post-Launch

- [ ] Monitor error rates
- [ ] Monitor job queue health
- [ ] Collect user feedback
- [ ] Track conversion metrics
- [ ] Iterate based on data
- [ ] Daily backup verification
- [ ] Weekly failed job review
- [ ] Monthly dependency updates

***

## Support \& Maintenance

### Daily

- Monitor error rates in Sentry
- Check worker queue health
- Review support tickets


### Weekly

- Review usage metrics
- Check AI provider costs
- Analyze failed jobs
- Update WordPress compatibility matrix


### Monthly

- Review and optimize database queries
- Update dependencies
- Security patch review
- Backup verification

***

## Future Enhancements (Post-MVP)

### Phase 12: Advanced Features

- Content templates marketplace
- Bulk scheduling
- Multi-site publishing (1 project → N sites)
- Content calendar analytics
- Team collaboration (comments, approvals)
- Content versioning
- A/B testing titles/images


### Phase 13: Integrations

- Ghost, Webflow, Wix, Squarespace
- Zapier/Make.com webhooks
- Google Analytics integration
- SEMrush/Ahrefs keyword research
- Grammarly integration
- Plagiarism detection


### Phase 14: AI Enhancements

- Fine-tuned models for specific niches
- Brand voice training
- Competitor content analysis
- Automatic internal linking suggestions
- Schema markup generation
- Multi-language content generation

***

## Complete Pre-Launch Essentials Checklist

### Brand & Design
- [ ] Brand colors defined (use Blue #3b82f6 as primary)
- [ ] Logo created (SVG + PNG, primary and monochrome)
- [ ] Typography configured (Inter for UI, Fraunces for headings)
- [ ] Favicon created (16x16, 32x32, 180x180)
- [ ] Social share images created (Open Graph, Twitter)
- [ ] Email header image created

### Email Templates
- [ ] Verification email template
- [ ] Welcome email template
- [ ] Password reset email template
- [ ] Billing receipt email template
- [ ] Failed job notification email template
- [ ] Weekly digest email template

### Security & Compliance
- [ ] Rate limiting configured per endpoint
- [ ] Cookie consent banner implemented
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Cookie policy page
- [ ] Data processing agreement (DPA) for EU customers
- [ ] Data deletion endpoint (GDPR Right to Erasure)
- [ ] Data export endpoint (GDPR Right to Portability)
- [ ] Privacy-focused analytics (IP anonymization)

### User Experience
- [ ] Error boundaries on all routes
- [ ] Loading skeletons for all async operations
- [ ] Onboarding wizard for new users
- [ ] Feature flags system

### Content Safety
- [ ] Content moderation (OpenAI Moderation API)
- [ ] Profanity filter
- [ ] Quality gates enforced

### Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Webhook documentation
- [ ] Code examples (TypeScript, Python, cURL)
- [ ] User guides

### Infrastructure
- [ ] WordPress plugin auto-updater
- [ ] Database backups (daily, automated)
- [ ] Content backups (S3/R2 versioning)
- [ ] Disaster recovery plan documented
- [ ] Backup verification tested
- [ ] Status page (status.yourapp.com)
- [ ] Support widget integrated

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Product analytics (PostHog)
- [ ] Uptime monitoring
- [ ] Backup health alerts
- [ ] Job queue alerts

### Testing
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests
- [ ] E2E tests
- [ ] WordPress compatibility testing
- [ ] Load testing
- [ ] Security audit

***

## Implementation Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Pre-Phase 0.05 | 1 day | Brand identity, colors, typography |
| Pre-Phase 0.1 | 2-3 hours | UI library setup, all shadcn components |
| Phase 0 | 1 week | Monorepo, app shell, routing |
| Phase 1 | 1-2 weeks | Authentication, email verification, rate limiting |
| Phase 1.5 | 1 week | GDPR compliance, onboarding, feature flags |
| Phase 2 | 1 week | Multi-tenant foundation, projects |
| Phase 3 | 1 week | Billing, Stripe integration |
| Phase 4 | 1-2 weeks | WordPress plugin, connection |
| Phase 5 | 1-2 weeks | Content editor, Gutenberg conversion |
| Phase 6 | 1-2 weeks | AI content generation, moderation |
| Phase 7 | 1 week | Featured image pipeline |
| Phase 8 | 1-2 weeks | Planner, BullMQ worker |
| Phase 9 | 1 week | Observability, diagnostics |
| Phase 10 | 1-2 weeks | Testing, QA |
| Phase 11 | 1 week | Deployment, DevOps |
| Phase 11.5 | 1 week | API documentation |
| Phase 11.6 | 1 week | Backup & disaster recovery |

**Total Estimated Time: 12-16 weeks**

***

**This comprehensive plan provides everything needed to build a production-ready WordPress autoblogging SaaS. Each phase is implementable, testable, and delivers user value. Start with Pre-Phase 0.05 and iterate through each phase systematically.**

