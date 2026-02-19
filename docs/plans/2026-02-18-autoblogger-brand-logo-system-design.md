# AutoBlogger Brand Logo System Design

Date: 2026-02-18
Status: Approved

## 1) Context and Goal

The app currently uses ad-hoc text/initial marks (for example, `A + AutoBlogger`) across public and auth surfaces. We need a unified brand system that:

- Provides **3 logo variants** for selection:
  - minimal
  - icon-first
  - wordmark
- Keeps current blue-primary visual direction with light/dark-safe contrast.
- Applies branding consistently across:
  - public pages
  - auth pages
  - dashboard shell branding
  - browser favicon/app icon
  - social preview image metadata

## 2) Options Considered

### Option 1 — Component-first inline SVG system
- Implement all logo variants as inline React SVG components.
- Pros: direct theme control, no additional asset management.
- Cons: weaker path for favicon/app/OG asset pipeline; more duplication for metadata and static integrations.

### Option 2 — Brand asset pack + shared wrapper (**selected**)
- Store master logo assets in `public/brand`.
- Create one shared `BrandLogo` component wrapper to consume selected variant and sizing modes.
- Reuse static assets for favicon/app/OG metadata.
- Pros: strongest fit for full-scope rollout, reusable in UI + metadata + static channels.
- Cons: requires slightly more upfront asset organization.

### Option 3 — Icon sprite/font approach
- Bundle logos as sprite/font-style resources.
- Pros: compact runtime distribution.
- Cons: more maintenance complexity; weaker flexibility for OG/favicons and accessibility labeling.

## 3) Approved Architecture

Use **Option 2**.

### Asset layer
- Add `public/brand/*` for master logo SVG files (3 variants).
- Add stable static files for browser/app/social usage:
  - favicon assets
  - apple touch icon
  - default OG image

### Component layer
- Add shared component in `src/components/brand`:
  - `BrandLogo`
  - API shape:
    - `variant: 'minimal' | 'icon' | 'wordmark'`
    - `size`
    - `mode: 'light' | 'dark' | 'auto'`
    - optional `withText`
- Component provides graceful fallback to a safe text mark if an asset reference is invalid.

### Integration layer
- Replace hardcoded brand marks in:
  - public navigation
  - auth pages (login, signup, verify-email)
  - dashboard shell/sidebar/header branding
- Route files stay composition-only; feature/page modules remain under `src/modules` and shared brand UI under `src/components`.

### Metadata layer
- Update app metadata to reference checked-in static brand assets for:
  - favicon/icon
  - apple-touch-icon
  - OG image

## 4) Data Flow and Rendering Rules

1. Page/layout requests a brand logo via `BrandLogo` props.
2. `BrandLogo` resolves variant + mode + size to static asset or inline render token.
3. If asset is unavailable, component falls back to safe text mark.
4. Metadata references static files only (no runtime generation dependency).

## 5) Accessibility and Reliability

- Decorative logos: `aria-hidden` where appropriate.
- Brand-identifying logos: explicit readable labeling.
- No broken-image UX: fallback text mark behavior.
- Keep color contrast within current theme tokens for both light and dark usage.

## 6) Validation Strategy

- Visual verification:
  - home/public navigation
  - login/signup/verify-email
  - dashboard branding surface
- Browser verification:
  - favicon and app icon render in tab/device contexts
- Social verification:
  - metadata points to expected OG image asset
- Regression checks:
  - no broken links to brand files
  - no layout regressions from logo component replacement

## 7) Non-Goals (for this phase)

- Rebranding color palette beyond current blue-primary direction.
- Runtime logo generation service.
- Animated logo variants.

## 8) Approved Decisions

- 3 variants required: minimal, icon-first, wordmark.
- Keep existing blue-primary brand palette with light/dark optimization.
- Apply everywhere including public/auth/dashboard + favicon/app icon + OG image.
- Implement via brand asset pack in `public/brand` plus a shared `BrandLogo` wrapper component.
