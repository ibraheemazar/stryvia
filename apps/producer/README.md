# Producer Workspace (`@stryvia/producer`)

The primary STRYVIA application for producers and production companies. Users
plan and value product placement opportunities here, before they shoot.

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
npm run dev --workspace=@stryvia/producer
```

…or, equivalently, from this directory:

```bash
cd apps/producer
npm run dev
```

The dev server binds to **`http://localhost:3001`** (admin will use 3002, the
engine uses 8000).

## Routes

next-intl routes every page under a locale prefix.

| Path                     | Route group                                    | Layout                      |
| ------------------------ | ---------------------------------------------- | --------------------------- |
| `/`                      | redirected to `/{defaultLocale}` by middleware | —                           |
| `/{locale}`              | `(marketing)`                                  | minimal header, no sidebar  |
| `/{locale}/auth/sign-in` | `auth`                                         | centered card, no sidebar   |
| `/{locale}/dashboard`    | `(app)`                                        | full app shell with sidebar |
| `/{locale}/projects`     | `(app)`                                        | full app shell              |
| `/{locale}/reports`      | `(app)`                                        | full app shell              |
| `/{locale}/settings`     | `(app)`                                        | full app shell              |

`(marketing)` and `(app)` are Next.js route groups — they organise layouts but
do not appear in the URL.

## Languages

STRYVIA ships in English and Arabic with full RTL support.

- Switch via the language picker in the header (sidebar/topbar on app pages,
  marketing/auth headers elsewhere).
- Or hit the URL directly: `/en/dashboard` vs. `/ar/dashboard`.
- The `<html lang dir>` attribute and the body font (Inter for English, IBM
  Plex Sans Arabic for Arabic) flip automatically.

Locale registry lives in `src/i18n/config.ts`. Translations live in
`src/i18n/messages/{en,ar}.json` and are typed through
`src/types/global.d.ts`.

## Engine API

`src/lib/api/client.ts` is a typed `fetch` wrapper that returns
`ApiResponse<T>` (success or `ApiError` envelope). `src/lib/api/health.ts`
exposes TanStack Query hooks for the three engine probes:

```ts
import { useEngineLiveness, useEngineReadiness, useEngineVersion } from '@/lib/api/health';
```

These compile and are importable today; they're wired into pages in a later
session.

## Environment

Copy `.env.local.example` to `.env.local` and adjust:

```
NEXT_PUBLIC_ENGINE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=STRYVIA
```

`.env*` files are gitignored at the repo root.

## Stopping the dev server

`Ctrl-C` in the terminal running `next dev`. If it was launched as a
background process from this assistant, kill the matching `next-server`
process — see the verification section in the session notes.
