# WordPress Project Dialog + Sidebar UX Modernization Design

## Context

The current dashboard has functional progress, but UX gaps remain in three critical areas:

1. WordPress connection setup is not clearly discoverable in project workflows.
2. Users need explicit support for both Plugin Pairing and Username/App Password paths with clear setup instructions.
3. Sidebar labels feel compressed, reducing readability and perceived quality.

This design keeps architecture modular (`src/app` routes, `src/api` services, `src/modules` features, `src/components` shared UI) while improving UX using shadcn/ui patterns.

---

## Approved Information Architecture

### Primary placement

- `Dashboard > Projects` is the connection control center.
- Each project card exposes a dedicated **Connect WordPress** CTA.
- The CTA opens a full connection dialog scoped to that project.

### Sidebar behavior

- Keep collapsible desktop sidebar behavior.
- Increase expanded width and improve text spacing/typography for readability.

---

## Component-Level UX Design

## Project card actions

Each project card shows:

- Status badge (`connected`, `pending`, `error`, `not connected`)
- `Connect WordPress` CTA
- Existing project actions (e.g., `Create Draft`) in a clear hierarchy

## Connection dialog structure

Use shadcn components:

- [`Dialog`](apps/web/src/components/ui/dialog.tsx)
- [`Tabs`](apps/web/src/components/ui/tabs.tsx)
- [`Card`](apps/web/src/components/ui/card.tsx)
- [`Alert`](apps/web/src/components/ui/alert.tsx)
- [`Accordion`](apps/web/src/components/ui/accordion.tsx)
- [`Badge`](apps/web/src/components/ui/badge.tsx)
- [`Input`](apps/web/src/components/ui/input.tsx)
- [`Button`](apps/web/src/components/ui/button.tsx)

Dialog sections:

1. Header
   - Connection status
   - Current mode
   - Last checked timestamp

2. Tab: Plugin Pairing (Recommended)
   - Step-by-step setup guide:
     1. Install and activate plugin
     2. Copy key ID and secret from WP plugin page
     3. Save and run test
   - Form fields: site URL, key ID, secret

3. Tab: Username/App Password
   - Step-by-step setup guide:
     1. Open WP profile and create application password
     2. Copy username + app password
     3. Save and run test
   - Form fields: site URL, username, app password

4. Shared control row
   - `Test Connection`
   - `Disconnect` (only when connected)

---

## Data Flow and Architecture Alignment

## Route composition only

- Route file stays thin at [`dashboard/projects/page.tsx`](apps/web/src/app/dashboard/projects/page.tsx).
- All logic stays in modules/services.

## Module scope

- Connection dialog component remains in module scope at [`WpConnectionManager`](apps/web/src/modules/wp/components/WpConnectionManager.tsx).
- Projects UI integration remains in [`ProjectsPage`](apps/web/src/modules/projects/components/ProjectsPage.tsx).

## Service and actions

- Project and connection state loaded through service layer in `src/api/*`.
- Mutations continue through server actions in:
  - [`connect-plugin.ts`](apps/web/src/modules/wp/actions/connect-plugin.ts)
  - [`connect-fallback.ts`](apps/web/src/modules/wp/actions/connect-fallback.ts)
  - [`test-connection.ts`](apps/web/src/modules/wp/actions/test-connection.ts)
  - [`disconnect.ts`](apps/web/src/modules/wp/actions/disconnect.ts)

## Refresh behavior

- After each mutation, refresh projects route data to reflect status changes immediately.

---

## Visual System Improvements (Modern shadcn UX)

## Sidebar readability updates

- Increase desktop sidebar expanded width token from `16rem` to `18rem` in [`sidebar.tsx`](apps/web/src/components/ui/sidebar.tsx).
- Keep icon-collapsed width unchanged.
- Improve primary nav legibility by:
  - Slightly larger nav label text
  - Better vertical rhythm
  - Better spacing between icon and label

## Sidebar grouping polish

- Keep existing `Workspace` and `Account` groups.
- Improve group separation density and text contrast without changing IA.

## Projects and dialog polish

- Clearer CTA emphasis and visual hierarchy on project cards.
- Instructional accordion blocks in connection tabs for better first-time onboarding.

---

## Error Handling

- Show inline error alerts for each failed connect/test action.
- Keep status card visible so users understand current connection state after failure.
- Avoid silent failures; every mutation returns explicit UI feedback.

---

## Accessibility and Responsiveness

- Dialog must remain keyboard-navigable with proper focus flow.
- Tabs and accordions must have clear labels and semantic structure.
- Sidebar readability improvements apply on desktop; mobile sheet behavior unchanged.

---

## Acceptance Criteria

1. Users can connect WordPress from each project card via a clear `Connect WordPress` action.
2. Dialog offers both Plugin Pairing and Username/App Password setup with explicit instructions.
3. Test and disconnect actions are available from the same dialog context.
4. Sidebar remains collapsible but with improved readability and spacing.
5. shadcn/ui remains the component system and `components.json` remains schema-compliant.

---

## Out of Scope

- New global WordPress route (`/dashboard/wordpress`)
- Replacing existing sidebar architecture or removing collapse feature
- Introducing non-shadcn UI libraries

