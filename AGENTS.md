# Polaris AI Agent Instructions

## Architecture & Conventions

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript 5.9.
- **Component Separation**:
    - Server components (`src/components/server/`) should directly interact with backend DB/API via `async function`.
      NEVER use `'use client'` here.
    - Client components (`src/components/client/`) contain interactivity and state, and MUST start with `'use client'`.
      Do not fetch server data directly here.
    - Common utilities are in `src/components/common/`.
- **Styling Architecture** (Three-tier system):
    - **Panda CSS** (Primary): Use `css\`...\`` literal from `@/gen/styled/css`. Auto-generated in `src/gen/styled/
      ` (DO NOT modify manually). Run `npm run panda` in watch mode during development.
    - **Tailwind CSS v4 + DaisyUI v5**: Applied via `className`.
    - **MUI v7**: Managed via `ThemeProvider` for light/dark switching.
    - **Styling Rule**: DO NOT hardcode colors; use CSS variables defined in `src/app/global.css` (e.g.,
      `var(--primary-color)`). Look for `body.darkTheme` for dark mode logic.
- **Routing & i18n**: Multi-language dynamic routing via the `[lang]` parameter. The root `/` route detects language
  natively via `Accept-Language` headers, redirecting to the detected `[lang]` segment. Unmatched languages return
  `notFound()`.

## Developer Workflow

- **Launch Next.js Dev**: `npm run next` (Turbo mode, port 7100)
- **Watch Panda CSS**: `npm run panda` (CRITICAL: run this process concurrently with `next` to parse and generate
  utility classes for new CSS-in-JS blocks)
- **Watch Vite Client Build**: `npm run dev`
- **Production Build**: `npm run build`
- **Testing**: `npm run test` (Vitest unit testing framework)
- **Bundle Analysis**: `npm run analyze`

## Data Flows & Integrations

- **State Management**: Jotai (atomic state management) + SWR (data fetching/caching)
- **Database / Storage**: IndexedDB natively with `idb-keyval` and browser SQLite Wasm for frontend storage.
- **Portal (Public API)**: Available via `INTERNAL_PORTAL_URL` at port 8001 (Server-side access). Handles public API and
  authentication.
- **Stargate (Auth API)**: Available via `INTERNAL_STARGATE_URL` at port 8101 (Server-side access). Handles
  personal/community API after login.
