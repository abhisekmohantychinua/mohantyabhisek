# Project Practices & Guidelines

> This document outlines the development practices, coding standards, and organizational principles for this Next.js project. It serves as a living guide that evolves with the project.

## 📁 File & Folder Organization

### Project Structure

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css        # Global styles, design tokens, component layers
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Homepage
├── components/            # React components
│   └── shared/           # Shared/common components
│       └── navbar.tsx    # Navigation component
└── lib/                  # Utility functions and configurations
    └── utils.ts          # General utilities

docs/                     # Project documentation
└── practices.md         # This file

public/                   # Static assets
├── fonts/               # Custom font files
└── logo.png            # Brand assets
```

### Naming Conventions

- **Files**: Use kebab-case for file names (`navbar.tsx`, `user-profile.tsx`)
- **Components**: Use PascalCase for component names (`Navbar`, `UserProfile`)
- **Directories**: Use kebab-case for folder names (`shared`, `user-management`)
- **Assets**: Use descriptive names with hyphens (`company-logo.png`, `hero-image.jpg`)

### Component Organization

- **Shared components**: Place in `src/components/shared/` for reusable UI elements
- **Feature components**: Group related components in feature-specific folders
- **Page components**: Keep page-specific components close to their routes

## 💻 Code Writing Guidelines

### TypeScript Standards

- **Always use TypeScript**: No plain JavaScript files in src/
- **Explicit typing**: Define interfaces for props and complex objects
- **Type imports**: Use `import type` for type-only imports when possible

```typescript
// ✅ Good
interface NavigationItem {
  name: string;
  href: string;
}

// ✅ Good - explicit prop types
interface NavbarProps {
  items: NavigationItem[];
  className?: string;
}

export default function Navbar({ items, className }: NavbarProps) {
  // component logic
}
```

### React Component Patterns

- **Functional components**: Use function declarations over arrow functions for components
- **Hooks at top**: Place all hooks at the beginning of components
- **Early returns**: Use early returns for loading/error states
- **Meaningful comments**: Document complex logic and component purpose

```typescript
// ✅ Good
export default function Navbar() {
  // All hooks at the top
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // Early return for loading state
  if (!items) return <LoadingSpinner />;
  
  // Main component logic
  return (
    <nav>
      {/* Component content */}
    </nav>
  );
}
```

### State Management

- **useState** for local component state
- **useEffect** with proper cleanup and dependency arrays
- **Custom hooks** for reusable stateful logic

### Accessibility Requirements

- **Semantic HTML**: Use proper HTML elements (`nav`, `button`, `main`)
- **ARIA labels**: Include `aria-label`, `aria-expanded`, `role` attributes
- **Keyboard navigation**: Ensure all interactive elements are keyboard accessible
- **Screen reader support**: Provide meaningful alt text and labels

```typescript
// ✅ Good - Accessible button
<button
  className="navbar-mobile-toggle"
  onClick={() => setIsOpen(!isOpen)}
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  aria-label="Toggle navigation menu"
>
```

## 🎨 Style & CSS Guidelines

### Design System Approach

- **Design tokens**: Define all colors, fonts, and spacing in CSS custom properties
- **Semantic naming**: Use purpose-based names (`--color-primary`, `--font-heading`)
- **Single source of truth**: Centralize design decisions in `globals.css`

### Custom Properties Structure

```css
:root {
  /* Typography */
  --font-neutral-sans: "Neutral Sans", "Neutral Sans VF", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-break: "Break", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  
  /* Colors - Semantic naming */
  --background: #F7F9FC;
  --foreground: #2B2B2B;
  --primary: #1F3A5F;
  --secondary: #3A7D7C;
  --accent: #C89B3C;
}
```

## 🌊 Tailwind CSS Guidelines

### Tailwind-First Approach

- **Prefer Tailwind utilities**: Use `@apply bg-transparent` instead of `background: transparent`
- **Design token integration**: Use semantic color classes like `text-foreground` instead of `color: #2B2B2B`
- **Opacity utilities**: Use `text-foreground/70` instead of `rgba(43, 43, 43, 0.7)`
- **Font utilities**: Use `font-sans` instead of explicit `font-family` declarations

### Typography System

- **Primary font**: Use `font-sans` which maps to `--font-neutral-sans` (Neutral Sans family)
- **Alternative font**: Use custom class `font-break` for Break typeface  
- **System fallbacks**: Both fonts include comprehensive fallback chains
- **Variable font**: Neutral Sans VF provides optimal performance when supported

```css
/* Available font utilities */
.text-primary {
  @apply font-sans; /* Neutral Sans family */
}

.text-accent {
  @apply font-break; /* Break family - requires custom utility class */
}


```

### Component Layer Architecture

- **Use @layer components**: Organize component styles in dedicated layer
- **@apply directive**: Prefer @apply over inline utilities for component styles
- **Custom classes**: Create semantic class names for component variants

```css
@layer components {
  /* ✅ Good - Tailwind utilities with design tokens */
  .navbar {
    @apply fixed top-0 left-0 right-0 z-50 w-full bg-transparent;
    @apply transition-all duration-500 ease-out;
  }
  
  /* ✅ Good - Using design token colors with proper opacity */
  .navbar-scrolled {
    @apply bg-background border-b border-primary/10;
  }
}
```

### Pseudo-element Guidelines

- **Simple pseudo-elements**: Use Tailwind `after:content-[""]` utilities for basic cases
- **Complex pseudo-elements**: Use separate `::after` with explicit `content` for better readability
- **Performance consideration**: Tailwind utilities are tree-shakable and optimized
- **Maintainability**: Choose the approach that's most readable for your team

**When to use each approach:**

- `after:content-[""]` → Simple decorative elements, single-line definitions
- `::after { content: ""; }` → Complex animations, multiple properties, better IDE support

```css
/* ✅ Good - Tailwind pseudo-element utilities */
.navbar-nav-link {
  @apply relative text-foreground font-sans;
  @apply after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0;
  @apply after:bg-secondary after:transition-all after:duration-300 after:ease-out;
}

```

### Color System Integration

- **Always use design tokens**: Reference CSS variables through Tailwind utilities
- **Semantic naming**: Use purpose-based color classes (`bg-primary`, `text-accent`)
- **Opacity modifiers**: Leverage Tailwind's opacity syntax (`text-foreground/70`)

```css
/* ✅ Good - Design token usage */
.component {
  @apply bg-background text-foreground border-border;
  @apply hover:bg-primary hover:text-primary-foreground;
}

/* ❌ Avoid - Direct color values */
.component {
  background: #F7F9FC;
  color: #2B2B2B;
  border-color: #E5E7EB;
}
```

### Scoped CSS Guidelines

- **Reference globals.css**: Always import global styles in scoped CSS files
- **Minimal scoping**: Only use scoped CSS when component-specific styling is needed
- **Tailwind utilities only**: Prefer Tailwind over custom CSS in scoped files
- **shadcn exception**: Only shadcn component definitions may use inline Tailwind utilities

```css
/* ✅ Good - Scoped CSS file structure */
@reference '../app/globals.css';

.component-specific-class {
  @apply bg-card text-card-foreground;
  @apply border border-border rounded-lg;
}
```

### Modern Tailwind Patterns

- **Transform utilities**: Use `translate-x-0` instead of `transform: translateX(0)`
- **Opacity with colors**: Use `border-primary/10` for 10% opacity of primary color
- **Content utilities**: Use `after:content-[""]` for pseudo-element content when possible
- **Arbitrary values**: Only use when design tokens don't exist `bg-[#custom]`

```css
/* ✅ Good - Modern Tailwind transform utilities */
.navbar-visible {
  @apply translate-y-0;
}

.navbar-hidden {
  @apply -translate-y-full;
}

/* ✅ Good - Opacity with design tokens */
.border-style {
  @apply border-primary/10; /* 10% opacity */
  @apply text-foreground/70; /* 70% opacity */
}
```

### Class Naming Conventions

- **Component prefix**: Start with component name (`navbar-`, `button-`, `card-`)
- **BEM-inspired**: Use descriptive suffixes (`-container`, `-header`, `-active`)
- **State modifiers**: Clear state indicators (`-open`, `-scrolled`, `-visible`)

### Responsive Design

- **Mobile-first**: Start with mobile styles, add larger breakpoints
- **Semantic breakpoints**: Use `sm:`, `md:`, `lg:` appropriately
- **Hide/show patterns**: Use responsive display utilities consistently

```typescript
// ✅ Good - Mobile first approach
<div className="hidden md:flex items-center space-x-8">
  {/* Desktop navigation */}
</div>
```

### Animation Guidelines

- **Purposeful motion**: Every animation should have a clear purpose
- **Consistent timing**: Use standard duration classes (`duration-200`, `duration-300`)
- **Smooth transitions**: Prefer `ease-out` and `ease-in-out` over `ease-in`
- **Respect user preferences**: Consider `prefers-reduced-motion`
- **Tailwind transitions**: Use Tailwind utilities for consistent animations

```css
/* ✅ Good - Tailwind-first animations with design tokens */
.navbar-nav-link {
  @apply transition-all duration-300 ease-out;
  @apply after:bg-secondary after:transition-all after:duration-300 after:ease-out;
}

/* ✅ Good - Hover states with design tokens */
.button {
  @apply bg-primary text-primary-foreground;
  @apply hover:bg-primary/90 transition-colors duration-200;
}
```

### CSS Architecture Principles

- **Consistency over convenience**: Always prefer established patterns
- **Design token first**: Never use arbitrary values when design tokens exist  
- **Minimal custom CSS**: Leverage Tailwind's utility system maximally
- **Performance conscious**: Minimize custom CSS that can't be purged

```css
/* ✅ Good - Following established patterns */
.custom-component {
  @apply bg-background text-foreground font-sans;
  @apply border border-border rounded-lg p-4;
}

/* ❌ Avoid - Arbitrary values when design tokens exist */
.custom-component {
  background: #F7F9FC; /* Use bg-background instead */
  color: #2B2B2B;      /* Use text-foreground instead */
  font-family: "Neutral Sans"; /* Use font-sans instead */
}
```

## 🎯 Design Philosophy

### Core Principles

- **Calm and reliable**: Every UI element should feel intentional and trustworthy
- **Content-first**: Design should support content, never compete with it
- **Progressive disclosure**: Show only what's needed, when it's needed
- **Accessible by default**: Accessibility is not optional

### Visual Hierarchy

- **Typography scale**: Use consistent font sizes and weights
- **Color purpose**: Each color should have a clear semantic meaning
- **Spacing system**: Use consistent spacing based on design tokens
- **Focus states**: Clear, accessible focus indicators for all interactive elements

### Interaction Patterns

- **Hover states**: Subtle feedback that doesn't overwhelm
- **Loading states**: Clear indication of system state
- **Error handling**: Helpful, human-readable error messages
- **Empty states**: Guidance when content is not available

## 📊 Performance Guidelines

### Code Splitting

- **Dynamic imports**: Use for heavy components or routes
- **Lazy loading**: Implement for images and non-critical content
- **Bundle analysis**: Regular checks on bundle size

### Image Optimization

- **Next.js Image**: Always use `next/image` component
- **Proper sizing**: Specify width and height to prevent layout shift
- **Lazy loading**: Enable for below-the-fold images

```typescript
// ✅ Good - Optimized image usage
<Image
  src="/logo.png"
  alt="Company Logo"
  width={120}
  height={34}
  priority // For above-the-fold images
  className="navbar-logo-image"
/>
```

## ⚡ Implementation Specifics\n\n### Current Project Setup\n\n- **Tailwind CSS**: v4 with modern features and CSS custom properties\n- **Font Loading**: `font-display: swap` for all custom fonts to improve performance\n- **Design Tokens**: CSS custom properties integrated with Tailwind theme configuration\n- **Component Architecture**: `@layer components` for all custom component styles\n\n### Required Custom Utilities\n\nSince Break font is not configured in the default Tailwind theme, add this to your Tailwind config:\n\n```javascript\n// tailwind.config.ts\nmodule.exports = {\n  theme: {\n    extend: {\n      fontFamily: {\n        break: ['var(--font-break)']\n      }\n    }\n  }\n}\n```\n\n### Critical Implementation Notes\n\n- **Pseudo-element content**: Use `after:content-[\"\"]` in Tailwind, but escape properly in CSS files\n- **Opacity syntax**: `text-primary/10` means 10% opacity of primary color\n- **Transform utilities**: Prefer `translate-y-0` over custom `transform` properties\n- **Border shortcuts**: `border-b` is equivalent to `border-bottom-width: 1px`\n\n## 🔄 Development Workflow

### Component Development

1. **Design first**: Understand the component's purpose and behavior
2. **Accessibility consideration**: Plan for keyboard navigation and screen readers
3. **Mobile-responsive**: Design for mobile first, enhance for desktop
4. **Documentation**: Add meaningful comments explaining complex logic

### Testing Approach

- **Visual testing**: Ensure components look correct across devices
- **Interaction testing**: Verify all interactive states work properly
- **Accessibility testing**: Test with keyboard navigation and screen readers

### Code Review Checklist

- [ ] Follows established naming conventions
- [ ] Includes proper TypeScript types
- [ ] Has meaningful comments for complex logic
- [ ] Follows accessibility guidelines
- [ ] Uses consistent styling patterns
- [ ] Responsive design implemented correctly

---

## 📝 Notes

This document will be updated as the project evolves and new patterns emerge. When adding new practices:

1. **Document rationale**: Explain why a practice exists
2. **Provide examples**: Show good and bad patterns
3. **Update consistently**: Keep guidelines current with codebase changes
4. **Team input**: Incorporate feedback from all team members

*Last updated: January 2026*
