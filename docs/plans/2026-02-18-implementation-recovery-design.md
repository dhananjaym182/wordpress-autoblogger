# Implementation Recovery Design (Approach 2)

## Objective
Restore implementation parity with `implementation_recovery_plan.md` and recover product UX quality through a phased architecture-first recovery.

## Highlighted UX Commitment (Hard Requirement)
> The implementation must deliver a visibly improved, user-attractive, modern dashboard UX with consistent spacing, typography, interaction patterns, and shadcn/ui-first composition.
>
> Guarantee constraints:
> 1. No inline styles.
> 2. No ad-hoc native control usage in core product surfaces when a shadcn/ui equivalent exists.
> 3. If a needed component is missing, install or implement a reusable component under `apps/web/src/components/ui/`.
> 4. Preserve and improve existing sidebar/theme modernization without regressions.

## Execution Mode
- Continuous phase execution with checkpoint summaries after each phase.
- External integration features must return explicit `not configured` errors when credentials are absent.
- Required `.env` parameters must be documented now; values can be added later.
- Prisma schema changes (if required) must use proper migrations via `npx prisma migrate dev --name <name>`.

## Architecture Contract
- `apps/web/src/app`: route entry points only (pages/layouts/route handlers)
- `apps/web/src/api`: domain services and orchestration
- `apps/web/src/modules`: feature vertical slices and actions
- `apps/web/src/components`: shared reusable UI

## Phase Plan

### Phase 0: Route and Path Contract Stabilization
- Introduce centralized route constants.
- Fix middleware authenticated redirect targets.
- Remove stale `/projects/*` invalidation/revalidate targets.
- Remove or resolve dead `/demo` link behavior.

### Phase 1: Architecture Normalization
- Create `apps/web/src/api/*` domain service structure.
- Relocate route-scoped settings actions from `src/app/dashboard/settings/actions` to `src/modules/settings/actions`.
- Keep route files as composition wrappers.
- Add missing `/dashboard/projects` route and module view.

### Phase 2: Replace Mock and Placeholder Flows
- Org switcher: DB-backed org list + active org selection state.
- Billing: real plan + usage queries, checkout/portal actions.
- AI providers: persisted CRUD + provider tests + fallback policy editor.
- Planner: persisted schedule CRUD connected to `ScheduledPost`.
- Jobs: real `JobRun` query/table/detail flow.
- Content dashboard: real metrics/recent posts and editor entry.
- Auth verification resend: remove placeholder logic.
- WP connection test: perform real ping via WP client.

### Phase 3: UI/UX Consistency Recovery
- Build shared dashboard UI primitives (headers/cards/empty/error/toolbar/status).
- Replace non-shadcn controls in onboarding/planner/content assistant flows.
- Standardize dashboard route layouts and interaction patterns.

### Phase 4: Plan Parity Gaps
- Add `/legal/dpa`.
- Add `/api/health`.
- Add `/docs/api` shell and `/api/openapi` scaffold.
- Replace auth email sender TODO with real provider wiring and graceful config errors.

### Phase 5: Validation and Acceptance Hardening
- Typecheck + lint.
- Search-based checks for stale routes/mock placeholders.
- Route and feature smoke checks.
- Non-regression checks for sidebar/theme.

## Data Flow
- `app` route/page -> module action/component -> `src/api` service -> Prisma/client integrations.
- Authorization and org/project scope checks centralized in services.

## Error Handling
- User-facing actions return clear actionable errors.
- Missing integration credentials return explicit `Not configured` errors.
- Detailed failure diagnostics remain server-side.

## Risks and Controls
- Risk: broad UI refactor regressions.
  - Control: introduce reusable UI primitives and update pages incrementally.
- Risk: service boundary churn during move.
  - Control: preserve public module action interfaces while changing internals.
- Risk: missing credentials in dev environments.
  - Control: graceful, explicit runtime messages and `.env.example` updates.
