# Project Practices & Guidelines

This document captures the conventions actually used in the codebase. Keep it aligned as patterns evolve.

## 📁 File & Folder Organization

### Current Structure

```text
src/
├── app/
│   ├── globals.css        # Global styles, tokens, component layer, keyframes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── shared/
│   │   └── navbar.tsx     # Primary navigation
│   └── ui/
│       └── button.tsx     # shadcn button (CVA variants)
├── features/
│   └── home/
│       └── hero/
│           ├── index.tsx  # Hero content + shadcn buttons
│           └── styles.css # Scoped Tailwind styles with responsive prefixes
└── lib/
   └── utils.ts           # `cn` helper (clsx + tailwind-merge)

docs/practices.md           # This guide
public/fonts/               # Custom font files (Neutral Sans, Break)
public/logo.png             # Brand asset
```

### Naming Conventions

- Files and folders: kebab-case (e.g., `hero-section`, `navbar`)
- Components: PascalCase (e.g., `Navbar`, `Hero`)
- Variants/state: clear suffixes (`-active`, `-open`, `-scrolled`)

### Component Placement

- Shared, reusable UI: `src/components/shared`
- Design-system primitives (shadcn): `src/components/ui`
- Feature-scoped UI: `src/features/<area>/<component>` with colocated CSS when needed

## 💻 Code Writing Guidelines

- TypeScript everywhere in `src/`; prefer explicit prop typing
- Functional components with hooks at the top; avoid inline anonymous components when possible
- Use early returns for loading/error paths when they materially simplify logic
- Keep comments purposeful: component intent, non-obvious logic, accessibility rationale

### Accessibility

- Semantic elements (`nav`, `section`, `button`, etc.)
- ARIA for stateful controls (`aria-expanded`, `aria-controls`, `aria-label`)
- Keyboard support by default; avoid pointer-only interactions
- Screen reader helpers via `sr-only` for CTA descriptions and similar content

## 🎨 Styling & CSS Guidelines

### Tailwind v4 + Custom Properties

- Tailwind is pulled via `@import "tailwindcss";` in `globals.css`
- Design tokens live in `:root` (`--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, etc.)
- `@theme inline` maps tokens to Tailwind variables; prefer semantic utilities (`bg-background`, `text-foreground`)
- Fonts are defined with `@font-face` and exposed as `--font-neutral-sans` and `--font-break`; use `font-sans` / `font-break`

### Component Layer

- Use `@layer components` in `globals.css` for shared component classes (navbar, animations)
- Prefer `@apply` with utilities over raw CSS properties
- Mobile-first, then `sm:`, `md:`, `lg:` prefixes for responsive adjustments (see hero styles)

### Scoped CSS (feature-level)

- Import globals with `@reference "../../../app/globals.css";` when using a scoped CSS file
- Keep scoped files Tailwind-first; limit custom properties unless necessary
- Use Tailwind responsive prefixes instead of manual media queries

### Animations

- Global keyframes: `fade-up`, `fade-in`, `fade-down`, `slide-in-left`, `slide-in-right` defined in `globals.css`
- Use Tailwind arbitrary animations: `animate-[fade-up_1.2s_ease-out_0.3s_both]`, etc.
- Avoid bouncy/scale-heavy motion; prefer gentle translate/opacity

### Pseudo-elements

- Use Tailwind pseudo utilities (`after:*`) for simple cases; fall back to `::after` with `content: "";` when clearer

## 🌊 Tailwind & Design System Patterns

- Design tokens first; avoid hard-coded colors when a token exists
- Opacity modifiers: `text-foreground/70`, `border-primary/10`, etc.
- Spacing and layout: lean on Tailwind utilities; `container` + padding for consistent page gutters
- Responsive visibility: `hidden md:flex` for desktop-only sections, `md:hidden` for mobile-only

## 🧩 shadcn/ui & Utilities

- Buttons come from `src/components/ui/button.tsx` using CVA variants
  - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `accent`
  - Sizes: `default`, `sm`, `lg`, `icon`, `icon-sm`, `icon-lg`
- Compose classes with `cn` from `src/lib/utils.ts` (clsx + tailwind-merge)
- Prefer variant props over ad-hoc class stacking to stay consistent with the design system

## 🧭 Design Philosophy (Current UI)

- Calm, content-first, "quiet authority" tone
- Subtle motion with staged delays to guide reading order (hero uses stepped fade-up/fade-in)
- Clear focus and hover states without visual noise
- Progressive disclosure: keep nav simple, invite conversation over conversion

## 📊 Performance Notes

- Fonts use `font-display: swap`
- Use `next/image` with dimensions for logo/imagery
- Keep custom CSS minimal so Tailwinds tree-shaking is effective

## 🔄 Development Workflow

1. Clarify intent and accessibility before coding
2. Build mobile-first, layer in `sm:`/`md:`/`lg:`
3. Favor Tailwind utilities and shared component classes; add scoped CSS only when needed
4. Use shadcn primitives (e.g., `Button`) with variants; avoid bespoke buttons
5. Document non-obvious choices inline; keep this guide updated when patterns change

### Code Review Checklist

- [ ] Types are explicit and props are clear
- [ ] Accessibility is wired (ARIA, semantics, focus states)
- [ ] Tailwind-first, tokens instead of raw values
- [ ] Responsive prefixes applied (mobile-first)
- [ ] Reuses shared components/variants where possible
- [ ] Animations use global keyframes and are purposefully timed

---

Last updated: January 2026
