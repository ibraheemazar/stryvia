# Admin Console (`@stryvia/admin`)

Internal operations console for STRYVIA. Used by the team to review AI
analyses, monitor engine runs, manage benchmark data, onboard organizations,
and operate the system. **Not customer-facing.**

**Stack:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS v3 ·
shadcn/ui · next-intl · TanStack Query · react-hook-form + zod.

The app talks to the Python valuation engine through a typed fetch wrapper that
returns the shared `ApiResponse<T>` envelope from `@stryvia/types`.

## Prerequisites

- Node.js ≥ 20 and npm ≥ 10
- The monorepo bootstrapped: `npm install` from the repo root
- The Python valuation engine running on `http://localhost:8000` (only required
  for the engine-health hooks; placeholder pages render fine without it)

## Running

From the repo root:

```bash
npm run dev --workspace=@stryvia/admin
```

…or, equivalently, from this directory:

```bash
cd apps/admin
npm run dev
```

The dev server binds to **`http://localhost:3002`** (Producer uses 3001, the
engine uses 8000).

## Routes

next-intl routes every page under a locale prefix.

| Path                      | Route group                                    | Layout                        |
| ------------------------- | ---------------------------------------------- | ----------------------------- |
| `/`                       | redirected to `/{defaultLocale}` by middleware | —                             |
| `/{locale}`               | `(marketing)`                                  | centered card splash          |
| `/{locale}/auth/sign-in`  | `auth`                                         | centered card, no sidebar     |
| `/{locale}/overview`      | `(app)`                                        | full admin shell with sidebar |
| `/{locale}/runs`          | `(app)`                                        | full admin shell              |
| `/{locale}/benchmarks`    | `(app)`                                        | full admin shell              |
| `/{locale}/organizations` | `(app)`                                        | full admin shell              |
| `/{locale}/users`         | `(app)`                                        | full admin shell              |
| `/{locale}/audit`         | `(app)`                                        | full admin shell              |
| `/{locale}/system`        | `(app)`                                        | full admin shell              |

`(marketing)` and `(app)` are Next.js route groups — they organise layouts but
do not appear in the URL.

## Languages

STRYVIA Admin ships in English and Arabic with full RTL support.

- Switch via the language picker in the header (sidebar/topbar on app pages,
  marketing/auth headers elsewhere).
- Or hit the URL directly: `/en/overview` vs. `/ar/overview`.
- The `<html lang dir>` attribute and the body font (Inter for English, IBM
  Plex Sans Arabic for Arabic) flip automatically.

Locale registry lives in `src/i18n/config.ts`. Translations live in
`src/i18n/messages/{en,ar}.json` and are typed through `src/types/global.d.ts`.
The Admin Console keeps its own translation file because its vocabulary
("Engine Runs", "Benchmarks", "Audit Log") differs from the Producer App.

## Engine API

`src/lib/api/client.ts` is a typed `fetch` wrapper that returns
`ApiResponse<T>` (success or `ApiError` envelope). `src/lib/api/health.ts`
exposes TanStack Query hooks for the three engine probes:

```ts
import { useEngineLiveness, useEngineReadiness, useEngineVersion } from '@/lib/api/health';
```

Admin-only endpoints don't exist yet — those are wired in Phase 1B.

## Environment

Copy `.env.local.example` to `.env.local` and adjust:

```
NEXT_PUBLIC_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=STRYVIA Admin
```

`.env*` files are gitignored at the repo root.

## Design system note

The Admin Console intentionally **duplicates** the producer app's design
system (Tailwind config, tokens, shadcn components, layout primitives) rather
than importing from a shared package. This is deliberate for Phase 1A — the
producer app is the design source of truth, and we want the admin to track it
exactly without coupling the two apps before we know how the system will
evolve.

A future cleanup pass will extract the shared bits into a `packages/ui` (or
similar) workspace package and have both apps consume it. **Don't do that
extraction now** — premature.

If you're editing design tokens here: also edit them in `apps/producer/` to
keep the two apps visually aligned.

## Stopping the dev server

`Ctrl-C` in the terminal running `next dev`.
