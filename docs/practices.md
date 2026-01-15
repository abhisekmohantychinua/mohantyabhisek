# Project Practices & Guidelines

This document captures the conventions actually used in the codebase. Keep it aligned as patterns evolve — it reflects current, opinionated conventions used across this repository.

## 📁 File & Folder Organization

### Current Structure

```text
components.json
docs/
 └── practices.md
public/
 ├── fonts/
 │   ├── break/
 │   └── neutral-sans/
 ├── logo.png
 └── services/
src/
 ├── app/
 │   ├── api/
 │   │   └── contact/route.ts
 │   ├── globals.css
 │   ├── layout.tsx
 │   └── page.tsx
 ├── components/
 │   ├── shared/   # reusable feature-agnostic components (Navbar, Footer, ScrollControl)
 │   └── ui/       # design-system primitives (shadcn + CVA variants)
 ├── features/
 │   └── home/
 │       ├── cta/
 │       ├── hero/
 │       ├── problem/
 │       ├── services/
 │       └── thinking/
 ├── lib/          # utilities (cn, helpers)
 └── schemas/      # zod/type schemas (contact, etc.)

package.json
next.config.ts
tsconfig.json
README.md
```

### Naming Conventions

- Files and folders: kebab-case (e.g., hero-section, navbar)
- Components: PascalCase (e.g., Navbar, Hero)
- Variants/state: clear suffixes (-active, -open, -scrolled)

### Component Placement

- Shared, reusable UI: `src/components/shared`
- Design-system primitives: `src/components/ui` (shadcn, CVA variants)
- Feature-scoped UI: `src/features/<area>/<component>` with colocated CSS when needed

## 💻 Code Writing Guidelines

- **TypeScript-first:** All source under `src/` uses TypeScript. Prefer explicit prop and return types for public components and exported helper functions. Define small interfaces for props rather than large implicit `any` objects.
- **Server vs Client:** Use Next.js App Router patterns: prefer server components by default; add `"use client"` only where DOM APIs, hooks, or client-only libraries (GSAP, lucide-react, etc.) are required. Keep client components as small and focused as possible.
- **Component shape:** Functional components with clear prop types and named exports. Avoid anonymous inline components for readability and devtools clarity. Prefer small presentational components composed by higher-level containers.
- **Hooks & effects:** Keep effects deterministic and idempotent. Clean up listeners (`removeEventListener`, `observer.disconnect()`, cancel animation frames) and prefer passive listeners where appropriate (e.g., `addEventListener('scroll', fn, { passive: true })`). Use `startTransition` when deferring non-urgent state updates after navigation.
- **State & rendering:** Prefer early returns for loading/empty states. Keep heavy logic out of render — compute derived values with `useMemo` only when beneficial. Keep key lists and static content outside rendering loops (top-level constants) to avoid reallocation on each render.
- **Utilities & composition:** Use the repository `cn` helper (`src/lib/utils.ts`) for class composition and `cva` for variant-driven UI primitives (see `src/components/ui/button.tsx`). Keep variant definitions in UI primitives and reuse them across features.
- **Data types & schemas:** Centralize shared schemas in `src/schemas/` (Zod/TS types) and prefer typed data boundaries between server and client code.

### Accessibility

- **Semantic markup:** Prefer `nav`, `main`, `section`, `article`, `figure`, `figcaption`, `button`, `ul/ol` where appropriate.
- **ARIA & dynamic updates:** Use ARIA only when necessary. For visually driven, dynamic text swaps (Problem section) combine visual GSAP swaps with an `aria-live` region or programmatic announcements to assistive tech; set `aria-atomic` if partial updates should be read as a whole.
- **Keyboard & focus:** Provide `tabIndex` and clear focus-visible styles for interactive cards and custom controls. Use `focus-visible`/`outline` utilities from global components.
- **Images & alt text:** Use `next/image` and supply `alt` where meaningful; use empty `alt=""` for decorative images.
- **Performance-friendly animations:** Avoid animating layout properties where possible; prefer `transform` + `opacity` and GPU-friendly easings. Respect reduced-motion preferences where appropriate.

## 🎨 Styling & CSS Guidelines

### Tailwind + Tokens

- **Single source of tokens:** Global design tokens (colors, radii, fonts, keyframes) live in `src/app/globals.css` and are consumed via CSS custom properties (`:root`) and Tailwind utilities. Prefer these tokens (`bg-background`, `text-foreground`) rather than raw hex values.
- **Fonts & performance:** Fonts are declared with `@font-face` in `globals.css` and use `font-display: swap`. Map font families to custom properties (`--font-neutral-sans`, `--font-break`) and use those in components.

### Component Layer & `@layer components`

- **Global component styles:** Shared visual patterns live under `@layer components` in `globals.css` (navbar, footer, focus rings, utility tokens). Use these for consistent focus/hover/transition rules.
- **Prefer `@apply`:** Compose Tailwind utilities with `@apply` for readable component CSS. Reserve raw CSS for layout calculations, pseudo-elements, and complex selectors that Tailwind can't express succinctly.
- **Mobile-first:** Author styles mobile-first and progressively enhance with responsive prefixes (`sm:`, `md:`, `lg:`).

### Scoped feature CSS

- **Colocated scoped files:** Feature-level CSS lives under `src/features/*/` and imports global tokens via `@reference "../../../app/globals.css"` when needed. Scoped files follow a Tailwind-first approach with a small set of custom properties to control local behavior (e.g., `--line-growth`).
- **Naming & structure:** Use clear BEM-like or semantic class names per feature (e.g., `.problem-section`, `.services-card`) and keep animations and layout rules near related markup.

### Animations & motion

- **Transform + opacity:** Prefer `transform` and `opacity` for motion. GSAP + ScrollTrigger is used for scrubbed/pinned interactions (Problem section). Keep timelines predictable, scrubbed, and accessible.
- **Reduce motion & a11y:** Honor `prefers-reduced-motion` where appropriate and provide non-animated fallbacks for critical content.

### Images & media

- **Next/image:** Use `next/image` for responsive images; prefer `loading="lazy"` when appropriate and provide sizes when possible.
- **Overflow & pin caveats:** Avoid `overflow: hidden` on ancestors of pinned/sticky elements. Pin wrappers should live in non-clipped containers and use a small top offset (e.g., `10vh`) to avoid pinned content sitting flush to the viewport top.

### Utilities & primitives

- **Design primitives:** Keep UI primitives in `src/components/ui` (CVA for variants, Radix Slot for `asChild` patterns). Export variant props from primitives so features can reuse them consistently (see `Button` example).
- **Class composition:** Use `cn` (`src/lib/utils.ts`) to merge classes and `twMerge` for conflict resolution.

### Practical CSS rules

- Keep component custom properties minimal and documented in the scoped file header.
- Use `vh`-based shells for scroll-pinned sections and tune them to minimize trailing empty space.
- Use pseudo-elements for decorative gradients/overlays to keep markup focused on content.

## 🌊 Animations & Scroll

- This project intentionally favors calm, content-first motion: gentle translate + opacity is the baseline.
- GSAP + ScrollTrigger are used for complex, scrubbed, pinned scroll interactions (e.g., the Problem section). Use GSAP timelines for precise control over pinning, scrub, and per-step easing.
- When implementing sticky/pin behavior, be aware: `position: sticky`/`pin` can be broken by ancestor `overflow` rules — avoid `overflow: hidden` on ancestors that contain sticky elements.
- Prefer scrubbed timelines over time-based delays for scroll-linked sequences; guard against duplicated final state by conditionally rendering the target element only when appropriate.
- For accessible dynamic text swaps, combine GSAP-driven visual swaps with `aria-live` regions so screen readers announce content changes.

## 🌊 Scroll & Pin Caveats (practical rules)

- Pin wrappers should be placed inside non-clipped containers (no `overflow: hidden` on ancestors that require pin/sticky behavior).
- Use a small top offset (e.g., 10vh) when pinning so pinned headings don't sit at the absolute top of the viewport.
- Tune scroll shell heights per component (vh-based blocks) to minimize trailing empty scroll space.

## 🧩 shadcn/ui & Utilities

- Buttons and primitives live in `src/components/ui` and use CVA variants; prefer variants over ad-hoc class lists.
- Compose classes with `cn` from `src/lib/utils.ts` (clsx + tailwind-merge).

## 🧭 Design Philosophy

- Calm, content-first visual language — quiet authority rather than loud UI flourishes.
- Subtle motion guides reading order (hero and problem use staged translate + fade).
- Maintain strong focus and hover states without visual noise.

## 📊 Performance Notes

- Use `font-display: swap` for custom fonts.
- Prefer `next/image` for images where appropriate and specify sizes to enable optimal delivery.
- Keep custom CSS minimal so Tailwind tree-shaking remains effective.

## 🔄 Development Workflow

1. Clarify intent and accessibility before coding.
2. Implement mobile-first, add responsive prefixes.
3. Prefer Tailwind utilities and shared component classes; add scoped CSS only when necessary.
4. Use shadcn primitives (Button) with variants; avoid bespoke buttons.
5. When a change requires multiple steps (scan, update, test), track it with the project's task plan tool (use the repo's TODO process).

### Code Review Checklist

- Types are explicit and props are clear.
- Accessibility is wired (ARIA, semantics, focus states).
- Tailwind-first, tokens instead of raw values.
- Responsive prefixes applied (mobile-first).
- Reuse shared components/variants where possible.
- Animations use GSAP/ScrollTrigger for complex scroll interactions and are purposefully timed and accessible.

---

Last updated: January 15, 2026
