# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm start.        # Start production server
npm run lint      # run ESLint
```

No test suite is configured yet.

## Architecture

This is a Next.js 16 project using the App Router pattern with TypeScript and Tailwind CSS v4

**Key directories:**
- `src/app/` - App Router pages and layouts (not Pages Router)
- `public/`- Static assets

**Path alias:** Use `@/`for imports from the src directory (e.g., `@/app/...`)

**Styling:** Tailwind CSS 4 with CSS variables for theming. Dark mode is supported via `prefers-color-scheme`.

**Fonts:** Geist Sans and Geist Mono are pre-configured via next/front.

## Stack

- **Next.js 16** (App Router) with **React 19**, **TypeScript**, **Tailwind CSS v4**
- App entry: `src/app/page.tsx`; root layout: `src/app/layout.tsx`; global styles: `src/app/globals.css`

## CRITICAL: Always consult /docs first

**Before writing any code**, check the `/docs` directory for a relevant guide. Every feature area (auth, database, routing, styling, etc.) may have a doc there. Read the relevant file before proceeding — do not rely on training data or assumptions.

Code Generation Guidelines
IMPORTANT: When generating any code, ALWAYS first refer to the relevant documentation files within the /docs directory to understand existing patterns, conventions, and best practices before implementation:

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md
- /docs/server-components.md


## Key conventions

- This project uses **Next.js 16**, which has breaking changes from earlier versions. Before writing any routing, data-fetching, or rendering code, read the relevant docs in `node_modules/next/dist/docs/`.
- App Router only — no `pages/` directory.
- Tailwind CSS v4 uses a CSS-first config (no `tailwind.config.*` file); customizations go in `globals.css` via `@theme`.
