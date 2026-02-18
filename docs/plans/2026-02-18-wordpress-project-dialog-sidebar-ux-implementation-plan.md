# WordPress Project Dialog + Sidebar UX Modernization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a first-class WordPress connection flow from project cards (Plugin + Username/App Password with instructions) and improve sidebar readability while keeping current architecture and shadcn consistency.

**Architecture:** Keep route composition in `src/app`, data orchestration in `src/api`, feature UI/actions in `src/modules`, and shared UI primitives in `src/components`. Integrate the existing connection manager into a project-card dialog flow and polish sidebar tokens/classes for modern readability.

**Tech Stack:** Next.js App Router, TypeScript, shadcn/ui, server actions, Prisma.

---

### Task 1: Expand project data contract for connection dialog

**Files:**
- Modify: `apps/web/src/api/projects/service.ts`
- Modify: `apps/web/src/app/dashboard/projects/page.tsx`
- Modify: `apps/web/src/modules/projects/components/ProjectsPage.tsx`

**Step 1: Write failing type assertion (compile-time guard)**

Add/adjust `ProjectItem` type so it requires a connection payload shape that does not yet exist in route mapping.

```ts
type ProjectWpConnection = {
  id: string;
  status: string | null;
  mode: string | null;
  siteUrl: string | null;
  lastError: string | null;
  lastCheckedAt: string | null;
  keyId: string | null;
  wpUsername: string | null;
} | null;
```

**Step 2: Run check to verify failure**

Run: `cd apps/web && npm run typecheck`

Expected: compile error in `ProjectsPage` props mapping because `wpConnection` fields are missing.

**Step 3: Implement minimal data mapping**

- Ensure list query includes `wpConnection` (already present).
- Map project route output to include `wpConnection` object with nullable fields.
- Update `ProjectsPage` prop interface to accept `wpConnection`.

**Step 4: Run check to verify pass**

Run: `cd apps/web && npm run typecheck`

Expected: typecheck passes for updated project payload contract.

**Step 5: Commit**

```bash
git add apps/web/src/api/projects/service.ts apps/web/src/app/dashboard/projects/page.tsx apps/web/src/modules/projects/components/ProjectsPage.tsx
git commit -m "feat(projects): expose wp connection payload for project dialog"
```

---

### Task 2: Add project-card “Connect WordPress” dialog integration

**Files:**
- Modify: `apps/web/src/modules/projects/components/ProjectsPage.tsx`
- Reuse: `apps/web/src/modules/wp/components/WpConnectionManager.tsx`

**Step 1: Write failing UI expectation in component comments/checklist**

Add TODO checklist near project card action row requiring:
- `Connect WordPress` button
- Dialog wrapper
- Project-scoped manager render

```ts
// EXPECTED UX:
// - Project cards expose "Connect WordPress"
// - Clicking opens dialog with both setup modes
// - Existing status stays visible after close
```

**Step 2: Run check to verify pre-implementation gap**

Run: `cd apps/web && npm run lint`

Expected: no button/dialog exists in rendered project card actions (manual visual verification still fails).

**Step 3: Implement minimal integration**

- Import shadcn `Dialog` primitives.
- Add `Connect WordPress` CTA per card.
- Render `WpConnectionManager` inside dialog and pass:
  - `projectId`
  - `connection` object derived from `project.wpConnection`

**Step 4: Run checks**

Run:
- `cd apps/web && npm run lint`
- `cd apps/web && npm run typecheck`

Expected: both pass and project cards now include dialog trigger.

**Step 5: Commit**

```bash
git add apps/web/src/modules/projects/components/ProjectsPage.tsx
git commit -m "feat(projects): add connect wordpress dialog per project card"
```

---

### Task 3: Modernize WordPress connection UX with explicit setup instructions

**Files:**
- Modify: `apps/web/src/modules/wp/components/WpConnectionManager.tsx`

**Step 1: Write failing structure requirement**

Document required sections before editing component:

```ts
// Required structure:
// 1) Status summary card
// 2) Tabs: Plugin Pairing, Username/App Password
// 3) Instructional accordion for each mode
// 4) Shared action row (test/disconnect)
```

**Step 2: Run pre-check**

Run: `cd apps/web && npm run typecheck`

Expected: passes, but manual UX requirement still fails (tabs/instructions not present).

**Step 3: Implement minimal UX-complete component**

- Add `Tabs` with two values (`plugin`, `app-password`).
- Add `Accordion` based setup guides for each mode.
- Keep existing action handlers and error/success feedback.
- Keep app-password option clearly visible and first-class.

**Step 4: Run checks**

Run:
- `cd apps/web && npm run lint`
- `cd apps/web && npm run typecheck`

Expected: no lint/type errors.

**Step 5: Commit**

```bash
git add apps/web/src/modules/wp/components/WpConnectionManager.tsx
git commit -m "feat(wp): add tabbed connection setup with plugin and app-password instructions"
```

---

### Task 4: Improve sidebar readability while preserving collapse behavior

**Files:**
- Modify: `apps/web/src/components/ui/sidebar.tsx`
- Modify: `apps/web/src/components/nav-main.tsx`
- Modify: `apps/web/src/components/app-sidebar.tsx`

**Step 1: Write failing readability acceptance checklist**

```ts
// Readability acceptance:
// - Expanded width >= 18rem
// - Primary labels are not visually cramped
// - Group spacing is clearer without breaking collapse mode
```

**Step 2: Verify baseline gap**

Run visual check in app:
- Sidebar feels narrow and text compressed in expanded mode.

**Step 3: Implement minimal style changes**

- Change `SIDEBAR_WIDTH` to `18rem` in `sidebar.tsx`.
- Slightly improve nav label classes in `nav-main.tsx` (size/weight/line-height/spacing).
- Tune sidebar header + group spacing in `app-sidebar.tsx`.

**Step 4: Run checks**

Run:
- `cd apps/web && npm run lint`
- `cd apps/web && npm run typecheck`

Expected: passes with no regressions.

**Step 5: Commit**

```bash
git add apps/web/src/components/ui/sidebar.tsx apps/web/src/components/nav-main.tsx apps/web/src/components/app-sidebar.tsx
git commit -m "feat(sidebar): widen layout and improve nav readability"
```

---

### Task 5: Route-level verification for Projects connection flow

**Files:**
- Modify (if needed): `apps/web/src/app/dashboard/projects/page.tsx`
- Optional notes: `implementation_recovery_plan.md`

**Step 1: Define failing route checks**

Checklist:
- `/dashboard/projects` shows project cards
- each card has `Connect WordPress`
- dialog opens and shows both tabs
- status/test/disconnect controls visible

**Step 2: Run route verification**

Run app and manually verify:

```bash
cd apps/web && npm run dev
```

Expected before fix: one or more checks fail.

**Step 3: Apply route-level glue fixes (if any)**

- Ensure all required props are passed.
- Ensure no stale condition hides connection controls.

**Step 4: Re-run verification**

Expected: all route checks pass.

**Step 5: Commit**

```bash
git add apps/web/src/app/dashboard/projects/page.tsx implementation_recovery_plan.md
git commit -m "fix(projects): finalize route reliability for wordpress connection dialog"
```

---

### Task 6: Final quality pass and documentation sync

**Files:**
- Modify: `implementation_recovery_plan.md`
- Optional: `README.md` (only if navigation/setup docs changed)

**Step 1: Write final acceptance checklist**

```md
- [ ] Plugin setup instructions visible
- [ ] Username/app-password setup visible
- [ ] Sidebar readability improved in expanded mode
- [ ] shadcn-only UI approach preserved
- [ ] lint + typecheck clean
```

**Step 2: Run final verification**

Run:
- `cd apps/web && npm run lint`
- `cd apps/web && npm run typecheck`

Expected: both pass.

**Step 3: Update roadmap status**

- Mark implemented items completed in `implementation_recovery_plan.md`.
- Add any remaining blockers and next tasks.

**Step 4: Commit**

```bash
git add implementation_recovery_plan.md README.md
git commit -m "docs: update recovery status after wp dialog and sidebar ux modernization"
```

---

## Validation Commands (Consolidated)

```bash
cd apps/web && npm run lint
cd apps/web && npm run typecheck
```

Manual route smoke:

- `/dashboard/projects`
- Open per-project `Connect WordPress` dialog
- Confirm tab switch between Plugin and Username/App Password
- Trigger `Test Connection` and confirm feedback

