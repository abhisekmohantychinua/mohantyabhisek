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
 │   │   ├── blogs/route.ts
 │   │   └── contact/route.ts
 │   ├── blogs/
 │   │   ├── page.tsx
 │   │   └── [slug]/page.tsx
 │   ├── globals.css
 │   ├── layout.tsx
 │   ├── page.tsx
 │   └── sitemap.ts
 ├── components/
 │   ├── shared/   # reusable feature-agnostic components (Navbar, Footer, ScrollProgressBar, CTA Form)
 │   └── ui/       # shadcn primitives and variants (Button, Card, Field, Input, Label, Popover, Separator, Skeleton)
 ├── features/
 │   ├── blogs/
 │   │   ├── components/
 │   │   │   ├── blog-card/
 │   │   │   ├── blog-card-skeleton/
 │   │   │   ├── list/
 │   │   │   ├── list-client/
 │   │   │   ├── list-skeleton/
 │   │   │   ├── read-more/
 │   │   │   └── blog-content/
 │   │   └── services/
 │   │       └── blog-service.ts
 │   └── home/
 │       └── components/
 │           ├── cta/
 │           ├── hero/
 │           ├── problem/
 │           ├── services/
 │           └── thinking/
 ├── lib/          # utilities (cn, mongodb helpers)
 ├── models/       # shared data shapes and page-response types
 └── schemas/      # typed validation schemas

package.json
next.config.ts
tsconfig.json
README.md
```

### Naming Conventions

- Files and folders: kebab-case (e.g. `blog-card`, `list-client`, `generate-metadata`).
- Components: PascalCase (e.g. `Navbar`, `BlogListClient`).
- Hooks/helpers: camelCase.
- Variants/state classes: descriptive suffixes (`-active`, `-open`, `-scrolled`, `-skeleton`).

### Component Placement

- Shared, cross-cutting components: `src/components/shared`.
- Design-system primitives: `src/components/ui`.
- Feature-specific UI and skeletons: `src/features/<area>/components`.
- Feature services and data access: `src/features/<area>/services`.
- Shared type definitions: `src/models`.
- API routes: `src/app/api/*`.

## 💻 Code Writing Guidelines

- **TypeScript-first:** All source under `src/` uses TypeScript. Prefer explicit prop and return types for public components and exported helper functions. Define narrow interfaces rather than broad `any` objects.
- **App Router by default:** Prefer server components for page logic and initial rendering. Use `"use client"` only for browser-only behavior, hooks, or interactive state.
- **Client boundaries:** Keep client components small and focused. Examples: `Navbar`, `ScrollProgressBar`, `BlogListClient`, `section-view`, `gsap-init`, `cta-form`.
- **Data flow:** Keep server-side data fetches in feature services, not in presentation components. The blog list pattern is:
  - `BlogList` (server) loads initial page data,
  - `BlogListClient` handles infinite scrolling and loading states.

  Example:

  ```ts
  // src/features/blogs/components/list/index.tsx
  import { getCachedBlogCardsPage } from "@/features/blogs/services/blog-service";

  export default async function BlogList() {
    const page = await getCachedBlogCardsPage({ page: 1 });
    return <BlogListClient initialPage={page} />;
  }
  ```

  ```tsx
  // src/features/blogs/components/list-client/index.tsx
  "use client";
  import { useState } from "react";

  export default function BlogListClient({ initialPage }) {
    const [page, setPage] = useState(initialPage);
    // client-side fetches /api/blogs?page=2 for pagination
  }
  ```

- **Service caching:** Use Next.js `unstable_cache` for cacheable server fetchers. Example: `getCachedBlogCardsPage()` mirrors `getBlogCardsPage()` but adds a cached wrapper with `revalidate`.
- **Page-level revalidation:** Use `export const revalidate = 86400` on stable routes and `generateStaticParams()` for static slug generation.
- **Route metadata:** Use `generateMetadata()` and the `Metadata` type for route-level SEO, Open Graph, and canonical values.
- **Component shape:** Functional components with named exports and typed props. Avoid anonymous inline components for readability and devtools clarity.
- **Hooks & effects:** Keep effects deterministic, clean up observers and listeners, and prefer passive event listeners for scroll/resize.
- **State & rendering:** Prefer early returns for loading/empty states. Keep heavy logic out of render and use stable list keys.
- **Utilities & composition:** Use `cn` from `src/lib/utils.ts` and cva-driven design primitives in `src/components/ui`.
- **Data boundaries:** Serialize server data explicitly. Treat `postedAt` as a string at network boundaries and convert to `Date` only where formatting is required.

### Accessibility

- **Semantic markup:** Prefer `nav`, `main`, `section`, `article`, `figure`, `figcaption`, `button`, `ul/ol` where appropriate.
- **ARIA & dynamic updates:** Use ARIA only when necessary. For content swaps, combine visual motion with screen-reader-friendly announcements or `aria-live` regions.
- **Keyboard & focus:** Provide clear focus-visible states. Use shared focus styles from global CSS rather than ad hoc outlines.
- **Images & alt text:** Use `next/image` with meaningful `alt`; use empty `alt=""` for purely decorative visuals.
- **Performance-friendly animations:** Avoid layout animations when possible; prefer `transform` and `opacity`. Respect reduced-motion preferences.

## 🎨 Styling & CSS Guidelines

### Tailwind + Tokens

- Global design tokens live in `src/app/globals.css` using CSS custom properties. Use token utilities like `bg-background`, `text-foreground`, `border-primary/10`, and `rounded-2xl`.
- Fonts are declared in `globals.css` with `@font-face` and `font-display: swap`. Custom font families are mapped to properties like `--font-neutral-sans` and `--font-break`.

### Global component styles

- Shared visual patterns belong under `@layer components` in `src/app/globals.css`.
- Global component rules include the navbar, footer, blog card surface, focus rings, and skeleton defaults.
- Use `@apply` to compose Tailwind utilities and reserve raw CSS for layout, pseudo-elements, and truncation rules.

### Scoped feature CSS

- Feature CSS lives under `src/features/*/components` and imports global tokens via `@reference "../../../app/globals.css"`.
- Keep scoped files mobile-first and use responsive prefixes for enhancements.
- Use semantic class names and keep styles close to the feature markup.

### Skeleton styling

- Skeletons are built with the shadcn `Skeleton` primitive and a muted base tone (`bg-primary/20`) rather than the bold accent color.
- `BlogCardSkeleton` mirrors blog card layout; `BlogListSkeleton` provides heading and grid placeholders for loading states.

### Animations & motion

- Prefer GPU-friendly motion: `transform`, `opacity`, and subtle transitions.
- Use GSAP where precise scroll-driven timing or pinning is required.
- Keep client animation logic inside client components and avoid global side effects.

### Layout and pinning

- Avoid `overflow: hidden` on ancestors of sticky/pinned sections.
- Pin wrappers should live in non-clipped containers and use a small top offset when needed.
- Use `vh`-based shells for scroll interactions and tune them to minimize trailing empty space.

### Utilities & primitives

- Keep primitives in `src/components/ui` and reuse them across features.
- Use `cn` for class composition and `twMerge` for conflict resolution.
- Prefer primitive variants over ad hoc button or card class lists.

## 🌐 Architecture and feature separation

- Feature grouping is domain-driven. Example:
  - `src/features/blogs/components/*`
  - `src/features/blogs/services/blog-service.ts`
  - `src/features/blogs/models/blog.ts`
- Shared UI lives in `src/components/shared` and `src/components/ui`.
- `src/models` contains shared response and error types.
- `src/lib` contains runtime helpers such as `cn` and Mongo helpers.

## 🧩 shadcn/ui & utilities

- Use shadcn primitives for consistent UI behavior.
- Keep primitives small and composable: Button, Card, Field, Input, Label, Popover, Separator, Skeleton, Textarea.
- Avoid duplicating primitive behavior in feature code.

## 🧠 Client/server boundaries

- Server components fetch data and render initial markup.
- Client components handle interactivity and browser-only APIs.
- Example pattern: `BlogList` server component renders initial data; `BlogListClient` handles infinite scroll and loading.
- Mark client-boundary files with `"use client"` and keep responsibilities narrow.

## 🔄 API and pagination

- API routes live in `src/app/api/*`.
- Search queries are dynamic; non-query blog pages can use cached responses.
- The blog API route uses query params and returns typed `PageResponse<BlogCard>`.
- Use explicit error responses and logging for API failures.

## 🧪 Performance notes

- Cache non-search blog pages with `unstable_cache` and explicit TTLs.
- Use `revalidate` exports on stable pages to keep stale content bounded.
- Keep custom CSS minimal to preserve Tailwind tree-shaking.
- Prefer `next/image` and specify sizes for images.

## 🧭 Design philosophy

- Calm, content-first visual language.
- Quiet authority through strong typography, restrained motion, and soft accents.
- Subtle motion should guide reading order, not distract.

## ✅ Code Review Checklist

- Are prop types explicit and data shapes typed?
- Is server/client separation correct and minimal?
- Are shared tokens used instead of raw values?
- Are scoped feature styles imported with `@reference` and kept local?
- Are skeletons present for async list loading?
- Is metadata and JSON-LD handled in page routes?
- Is `unstable_cache` used for cacheable server data, and are stable routes configured with `revalidate`?
- Is `use client` limited to interactive components and side effects?

---

Last updated: June 2, 2026
