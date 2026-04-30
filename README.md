# STRYVIA

STRYVIA is a software platform for valuing brand integration opportunities in TV and film. It helps producers, brands, and media planners quantify the value of product placements, on-screen branding, and integrated marketing across screen content.

This repository is a [Turborepo](https://turbo.build/repo)-orchestrated monorepo containing all STRYVIA frontend apps, backend services, and shared packages.

## Repository layout

```
stryvia/
├── apps/                  # User-facing applications
│   ├── producer/          # Producer Workspace (Next.js)
│   ├── brand/             # Brand Portal (Next.js, Phase 2)
│   └── admin/             # Admin Console (Next.js)
├── services/              # Backend services
│   └── engine/            # Python FastAPI valuation engine
├── packages/              # Shared internal libraries
│   ├── ui/                # Shared React component library
│   ├── types/             # Shared TypeScript types
│   ├── api-client/        # Typed API client for frontend apps
│   ├── i18n/              # Arabic + English translations
│   └── config/            # Shared tsconfig / eslint / prettier
├── infrastructure/        # Local + deployment infrastructure
│   └── docker/            # docker-compose for local dev
├── docs/                  # Project documentation
│   ├── architecture/      # Architecture decisions & diagrams
│   └── runbooks/          # Operational runbooks
└── scripts/               # Build / dev helper scripts
```

## Prerequisites

- Node.js `>=20` (see `.nvmrc`)
- npm `>=10`
- Python `3.11` exactly (the engine pins to `>=3.11,<3.12`)
- Docker Desktop (for the local Postgres + Adminer stack)

## Getting started

One-command bootstrap from a fresh clone:

```bash
./scripts/setup.sh
```

The script verifies prerequisites, installs npm + Python deps, copies
`.env.example` templates into populated `.env` files, generates strong
random passwords for any placeholder `*_PASSWORD` field, starts the
Postgres container, and applies database migrations. It is idempotent —
re-run anytime.

After it finishes:

1. **Paste your Anthropic API key** into `services/engine/.env` (replace
   the `ANTHROPIC_API_KEY=sk-ant-replace-with-your-key` line). Get a key
   at <https://console.anthropic.com/>. _Optional for Phase 1A; required
   from Phase 1B onward._
2. Verify your environment is healthy:
   ```bash
   ./scripts/check-env.sh
   ```
3. Start everything:
   ```bash
   npm run dev:all
   ```

## Configuration

Every environment variable consumed by the system is documented in
**[`docs/environment.md`](./docs/environment.md)** — the single source of
truth for what each variable does, where it lives, and whether it is
required. Production secret management is intentionally deferred and
tracked in
[`docs/runbooks/production-secrets.md`](./docs/runbooks/production-secrets.md).

## Development

| Command                | What it does                                                | Port       |
| ---------------------- | ----------------------------------------------------------- | ---------- |
| `npm run dev:all`      | Engine + Producer + Admin in parallel (via `concurrently`)  | —          |
| `npm run dev:db`       | Start the Postgres + Adminer Docker stack in the background | 5432, 8080 |
| `npm run dev:engine`   | FastAPI valuation engine (`uvicorn --reload`)               | 8000       |
| `npm run dev:producer` | Producer Workspace (Next.js)                                | 3000       |
| `npm run dev:admin`    | Admin Console (Next.js)                                     | 3001       |
| `npm run build`        | Build all workspaces                                        | —          |
| `npm run lint`         | Lint all workspaces                                         | —          |
| `npm run test`         | Run tests across all workspaces                             | —          |
| `npm run typecheck`    | Type-check all workspaces                                   | —          |
| `npm run format`       | Auto-format the entire repo with Prettier                   | —          |
| `npm run format:check` | Check formatting without writing changes                    | —          |

To stop everything: `Ctrl-C` ends the npm processes; the database keeps
running in the background until you `docker compose -f
infrastructure/docker/docker-compose.yml down`.

## Local database

PostgreSQL 16 (plus Adminer for visual inspection) runs in Docker via
`infrastructure/docker/docker-compose.yml`. Schema layout, role model,
migration tooling (Alembic), and the helper scripts in `scripts/db-*.sh`
are documented in [`services/engine/README.md`](./services/engine/README.md).

## Code quality

The monorepo uses **TypeScript**, **ESLint** (v9 flat config), and **Prettier**, with all
shared configuration living in `packages/config/` so every app and package extends from a
single source of truth:

- `@stryvia/typescript-config` — `base`, `nextjs`, and `library` tsconfig presets
- `@stryvia/eslint-config` — `base`, `react`, and `nextjs` flat-config presets
- `@stryvia/prettier-config` — shared Prettier options

Run `npm run format` to auto-format the repo, and `npm run typecheck` to validate types
across all workspaces.

## Status

Phase 1A — foundational scaffold. Application code is added in subsequent sessions; see `docs/architecture/` for the staged build plan.
