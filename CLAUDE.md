# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Astro 5** - SSR-enabled web framework (configured with Node adapter in standalone mode)
- **React 19** - For interactive UI components only
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling via Vite plugin
- **Shadcn/ui** - UI component library (New York style, Lucide icons)
- **Supabase** - Backend services and database (when configured)
- **Zustand** - State management

## Development Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
```

## Project Architecture

### Directory Structure

- `src/layouts/` - Astro layout components
- `src/pages/` - File-based routing (Astro pages)
- `src/pages/api/` - API endpoint routes
- `src/components/` - UI components (Astro for static, React for interactive)
- `src/components/ui/` - Shadcn/ui components
- `src/lib/` - Services and utility helpers
- `src/middleware/index.ts` - Request/response middleware
- `src/db/` - Supabase clients and database types
- `src/types.ts` - Shared types (Entities, DTOs)
- `src/assets/` - Internal static assets
- `public/` - Public static files

### Import Aliases

TypeScript path aliases configured in `tsconfig.json`:
- `@/*` maps to `src/*`

Shadcn component aliases from `components.json`:
- `@/components` → components directory
- `@/lib/utils` → utility functions
- `@/components/ui` → UI components
- `@/lib` → services/helpers
- `@/hooks` → custom React hooks

### Rendering Architecture

- **Output mode**: `server` (SSR enabled)
- **Adapter**: Node standalone mode
- **Port**: 3000
- Astro components (.astro) are for static/server-rendered content
- React components (.tsx) are for client-side interactivity only
- Never use "use client" or Next.js directives (this is Astro, not Next.js)

## Key Coding Practices

### Error Handling Pattern

- Handle errors and edge cases at the beginning of functions
- Use early returns for error conditions (avoid deep nesting)
- Place happy path last for readability
- Use guard clauses for preconditions
- Implement proper error logging

### API Routes (Astro Endpoints)

- Use uppercase HTTP method names: `export async function GET(context) { }`
- Add `export const prerender = false` for dynamic API routes
- Validate input with Zod schemas
- Extract business logic to `src/lib/services`
- Access Supabase via `context.locals.supabase` (not direct imports)

### Supabase Integration

- Use `SupabaseClient` type from `src/db/supabase.client.ts`
- Never import directly from `@supabase/supabase-js`
- Access via `context.locals` in Astro routes
- Validate data exchanges with Zod schemas

### React Component Guidelines

- Functional components with hooks only (no class components)
- Custom hooks go in `src/components/hooks/`
- Use `React.memo()` for components that re-render often with same props
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive calculations
- Use `useId()` for accessibility attribute IDs
- Consider `useOptimistic` for optimistic UI updates
- Consider `useTransition` for non-urgent state updates

### Styling with Tailwind

- Styles defined in `src/styles/global.css`
- Use `@layer` directive for organizing styles
- Use arbitrary values with square brackets: `w-[123px]`
- Dark mode via `dark:` variant
- Responsive: `sm:`, `md:`, `lg:`, etc.
- State variants: `hover:`, `focus-visible:`, `active:`, etc.

### Shadcn/ui

- reusable components should be created with Shadcn/ui library
- list of available shadcn components can be found here: https://ui.shadcn.com/r
- to add new shadcn component use: npx shadcn@latest add [component-name]

### Accessibility (ARIA)

- Use ARIA landmarks (main, navigation, search, etc.)
- Apply `aria-expanded` and `aria-controls` for expandable content
- Use `aria-live` for dynamic content updates
- Apply `aria-label`/`aria-labelledby` for unlabeled elements
- Use `aria-describedby` for form inputs
- Implement `aria-current` for navigation states
- Avoid redundant ARIA that duplicates native HTML semantics

## Linting & Code Quality

- ESLint configured with TypeScript, React, Astro, and JSX a11y plugins
- React Compiler plugin enabled
- Prettier integration for formatting
- Husky + lint-staged for pre-commit checks
- Lints `*.{ts,tsx,astro}` files on commit
- Formats `*.{json,css,md}` files on commit

## Environment & Configuration

- Node.js version: `v22.14.0` (see `.nvmrc`)
- Environment variables via `import.meta.env`
- Cookie management via `Astro.cookies`
- View Transitions API available (use ClientRouter)
