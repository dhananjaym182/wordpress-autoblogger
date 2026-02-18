# Implementation Recovery (Approach 2) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore route reliability, replace degraded mock flows with persisted behavior, and deliver a high-quality shadcn-first dashboard UX with consistent modular architecture.

**Architecture:** Route files remain thin (`src/app`), feature behaviors stay in `src/modules`, and domain orchestration/data access live in `src/api`. Shared visual primitives in `src/components/ui` enforce consistent UX patterns across all dashboard surfaces.

**Tech Stack:** Next.js App Router, TypeScript, Prisma, Better Auth, shadcn/ui, Tailwind CSS, Redis/BullMQ, WordPress client package.

---

### Task 1: Stabilize route constants and middleware targets (Phase 0)

**Files:**
- Create: `apps/web/src/api/core/routes.ts`
- Modify: `apps/web/src/middleware.ts`
- Modify: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/projects/page.tsx`

**Step 1: Write failing route contract test scaffold (if test infra missing, add static verification script placeholder).**

**Step 2: Implement canonical route constants and legacy redirect behavior.**

**Step 3: Update middleware auth redirects and protected-path checks to canonical dashboard paths.**

**Step 4: Remove dead `/demo` dependency (replace link or route).**

**Step 5: Verify by smoke-running route checks manually in dev and commit.**

### Task 2: Remove stale `/projects/*` revalidation drift (Phase 0)

**Files:**
- Modify: `apps/web/src/modules/projects/actions/create-project.ts`
- Modify: `apps/web/src/modules/projects/actions/delete-project.ts`
- Modify: `apps/web/src/modules/content/actions/save-draft.ts`
- Modify: `apps/web/src/modules/wp/actions/connect-plugin.ts`
- Modify: `apps/web/src/modules/wp/actions/connect-fallback.ts`
- Modify: `apps/web/src/modules/wp/actions/disconnect.ts`
- Modify: `apps/web/src/modules/wp/actions/test-connection.ts`

**Step 1: Add failing grep-based verification command to detect stale `/projects` invalidation usage.**

**Step 2: Update all revalidate targets to canonical dashboard routes.**

**Step 3: Re-run grep verification and commit.**

### Task 3: Introduce core service boundaries and auth/org context (Phase 1)

**Files:**
- Create: `apps/web/src/api/core/errors.ts`
- Create: `apps/web/src/api/core/auth-context.ts`
- Create: `apps/web/src/api/core/organization-context.ts`
- Create: `apps/web/src/api/org/service.ts`
- Create: `apps/web/src/api/projects/service.ts`

**Step 1: Add minimal failing type-check references in consuming modules.**

**Step 2: Implement session resolution and active organization selection helpers.**

**Step 3: Add org/project service functions used by UI and actions.**

**Step 4: Re-run typecheck for touched workspaces and commit.**

### Task 4: Relocate settings actions out of route folder (Phase 1)

**Files:**
- Create: `apps/web/src/modules/settings/actions/export-data.ts`
- Create: `apps/web/src/modules/settings/actions/delete-account.ts`
- Create: `apps/web/src/modules/settings/components/SettingsActions.tsx`
- Modify: `apps/web/src/app/dashboard/settings/page.tsx`
- Delete: `apps/web/src/app/dashboard/settings/actions/export-data.ts`
- Delete: `apps/web/src/app/dashboard/settings/actions/delete-account.ts`

**Step 1: Move action logic into module scope with explicit typing fixes.**

**Step 2: Wire settings page buttons to real actions with shadcn dialogs/toasts.**

**Step 3: Typecheck and commit.**

### Task 5: Add missing dashboard projects route and module UX (Phase 1/2)

**Files:**
- Create: `apps/web/src/app/dashboard/projects/page.tsx`
- Create: `apps/web/src/modules/projects/components/ProjectsPage.tsx`
- Modify: `apps/web/src/components/app-sidebar.tsx`

**Step 1: Create route page for projects index under dashboard.**

**Step 2: Add persisted project list/create/delete UI using shadcn dialogs/forms.**

**Step 3: Update sidebar/navigation to include projects route.**

**Step 4: Verify project CRUD manually and commit.**

### Task 6: Replace mock org, content, planner, jobs, AI, billing data flows (Phase 2)

**Files:**
- Modify: `apps/web/src/modules/org/components/OrgSwitcher.tsx`
- Create: `apps/web/src/modules/org/components/OrgSwitcherClient.tsx`
- Create: `apps/web/src/modules/org/actions/set-active-organization.ts`
- Create: `apps/web/src/api/content/service.ts`
- Create: `apps/web/src/api/planner/service.ts`
- Create: `apps/web/src/api/jobs/service.ts`
- Create: `apps/web/src/api/ai/service.ts`
- Create: `apps/web/src/api/billing/service.ts`
- Modify: `apps/web/src/app/dashboard/content/page.tsx`
- Modify: `apps/web/src/modules/planner/components/CalendarView.tsx`
- Modify: `apps/web/src/app/dashboard/planner/page.tsx`
- Modify: `apps/web/src/modules/jobs/components/JobLogsList.tsx`
- Modify: `apps/web/src/app/dashboard/jobs/page.tsx`
- Modify: `apps/web/src/modules/ai/components/ProviderList.tsx`
- Modify: `apps/web/src/app/dashboard/ai/page.tsx`
- Modify: `apps/web/src/modules/billing/components/CurrentPlan.tsx`
- Modify: `apps/web/src/modules/billing/components/PricingTable.tsx`
- Modify: `apps/web/src/app/dashboard/billing/page.tsx`

**Step 1: Implement domain services and return typed view models.**

**Step 2: Replace local mock arrays and static cards with server-backed data.
**

**Step 3: Add provider CRUD/test and fallback-policy editor.
**

**Step 4: Add planner CRUD and jobs query wiring.
**

**Step 5: Add billing actions and graceful not-configured responses.
**

**Step 6: Typecheck, lint touched files, and commit.**

### Task 7: Replace placeholder auth + WP test behavior with real integrations (Phase 2/4)

**Files:**
- Modify: `apps/web/src/lib/auth.ts`
- Create: `apps/web/src/lib/email.ts`
- Modify: `apps/web/src/modules/auth/components/VerifyEmailBanner.tsx`
- Modify: `apps/web/src/app/(auth)/verify-email/page.tsx`
- Modify: `apps/web/src/modules/wp/actions/test-connection.ts`
- Create: `apps/web/src/api/wp/service.ts`

**Step 1: Implement transactional email sender abstraction and Mailjet provider.
**

**Step 2: Replace placeholder resend verification logic with real action/client call.
**

**Step 3: Replace WP synthetic success with real ping and persisted status update.
**

**Step 4: Validate failure modes with missing credentials and commit.**

### Task 8: UI consistency overhaul with shared shadcn-first primitives (Phase 3)

**Files:**
- Create: `apps/web/src/components/ui/page-header.tsx`
- Create: `apps/web/src/components/ui/stats-card.tsx`
- Create: `apps/web/src/components/ui/empty-state.tsx`
- Create: `apps/web/src/components/ui/error-state.tsx`
- Create: `apps/web/src/components/ui/data-toolbar.tsx`
- Create: `apps/web/src/components/ui/status-badge.tsx`
- Create: `apps/web/src/components/ui/section-shell.tsx`
- Create: `apps/web/src/components/ui/skeleton-block.tsx`
- Modify: `apps/web/src/modules/onboarding/components/OnboardingWizard.tsx`
- Modify: `apps/web/src/modules/content/components/ContentEditor.tsx`
- Modify: `apps/web/src/modules/planner/components/CalendarView.tsx`
- Modify: dashboard route pages for consistent composition

**Step 1: Create reusable UI primitives from shadcn components only.
**

**Step 2: Refactor degraded pages/components to reuse shared primitives.
**

**Step 3: Replace native controls with shadcn `Select`/`RadioGroup` etc.
**

**Step 4: Verify no new inline styles; commit.**

### Task 9: Plan parity routes and docs endpoints (Phase 4)

**Files:**
- Create: `apps/web/src/app/(legal)/legal/dpa/page.tsx`
- Create: `apps/web/src/app/api/health/route.ts`
- Create: `apps/web/src/app/docs/api/page.tsx`
- Create: `apps/web/src/app/api/openapi/route.ts`

**Step 1: Add missing legal DPA route.
**

**Step 2: Add health endpoint and OpenAPI scaffold endpoint.
**

**Step 3: Add docs API shell page linking generated spec.
**

**Step 4: Smoke-check endpoints and commit.**

### Task 10: Environment contracts and verification hardening (Phase 5)

**Files:**
- Modify: `apps/web/.env.example`
- Modify: `apps/worker/.env.example`
- Modify: `apps/web/src/lib/env.ts`
- Modify: project docs as needed

**Step 1: Add all required env keys with comments and safe defaults.
**

**Step 2: Ensure missing integrations fail gracefully per-feature, not app-wide.
**

**Step 3: Run verification suite:
- `npm run typecheck`
- `npm run lint`
- grep checks for stale `/projects` and mock placeholders in dashboard modules.
**

**Step 4: Commit final recovery bundle and summarize validation evidence.
**
