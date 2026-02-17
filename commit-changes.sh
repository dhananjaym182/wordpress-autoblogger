#!/bin/bash
set -e

echo "Committing AutoBlogger implementation changes..."

# Stage all changes
git add -A

# Commit
git commit -m "feat: Implement AutoBlogger foundation - Phase 0-4 completed

Implemented the foundational phases of the AutoBlogger SaaS platform:

Pre-Phase 0.05 - Brand Identity:
- Brand colors (Tech Blue #3b82f6)
- Typography (Inter, Fraunces)
- CSS variables for theming

Pre-Phase 0.1 - UI Library:
- Monorepo structure with Turborepo
- Next.js 14 app with Tailwind CSS
- shadcn/ui components (Button, Card, Input, Badge)
- Theme provider with dark mode support

Phase 0 - Foundation:
- App shell with home page
- Core libraries (env, db, redis, crypto, logger, rate-limit)
- Error handling utilities
- Middleware with security headers

Phase 1 Foundation - Auth Module:
- Auth schemas (login, signup, verify email)
- Basic authentication structure

Phase 4 Foundation - WordPress Plugin:
- Complete WordPress plugin structure
- HMAC authentication class
- REST API endpoints (pair, ping, posts/upsert, media/import)
- Post, Media, Terms handlers
- Admin UI with pairing code generation
- Diagnostics panel

Database Schema:
- Complete Prisma schema with all models
- Multi-tenant architecture
- Job queue tracking
- AI provider management
- Audit logging

Infrastructure:
- Docker Compose configurations
- Development Dockerfile
- Getting started guide

Documentation:
- README.md
- GETTING_STARTED.md
- PROGRESS.md

This is ~30% of the complete implementation. Next phases needed:
- Authentication (Better Auth)
- Multi-tenant foundation
- Billing (Stripe)
- Content editor
- AI generation
- Full worker implementation"

echo "Changes committed successfully!"
echo "Branch: feature/autoblogger-implementation"
