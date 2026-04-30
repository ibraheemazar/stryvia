# Environment configuration

Single source of truth for every environment variable consumed anywhere in
the STRYVIA monorepo. Each component has its own `.env` (or `.env.local`)
file alongside an `.env.example` template; the running script for a given
component reads its own file only — the docs below mirror what each one
reads, in one place, so onboarding does not require spelunking.

For local development, run `./scripts/setup.sh` from the repo root once,
then `./scripts/check-env.sh` to confirm everything is wired correctly.
Production secret management is **deferred** to the deployment phase — see
[`runbooks/production-secrets.md`](./runbooks/production-secrets.md).

## Table of contents

- [Conventions](#conventions)
- [Database (PostgreSQL container)](#database-postgresql-container)
- [Engine (FastAPI valuation service)](#engine-fastapi-valuation-service)
- [Producer Workspace (Next.js)](#producer-workspace-nextjs)
- [Admin Console (Next.js)](#admin-console-nextjs)
- [Future / production-only variables](#future--production-only-variables)
- [Secrets management](#secrets-management)

## Conventions

- **File locations**: each component owns its own env file. Files end in
  `.env` (Python services, Docker) or `.env.local` (Next.js apps — Next's
  convention). Templates end in `.example` and ARE checked into git;
  populated files are NOT.
- **Types**: `string`, `int`, `bool` (`true` / `false`), `url`, `secret`.
  `secret` means "never log, never paste in chat, never commit".
- **`NEXT_PUBLIC_` prefix**: Next.js inlines these into the browser bundle.
  Never put a secret behind that prefix.
- **Required vs optional**: "required" means the component refuses to start
  (or behaves incorrectly) without it. Optional vars have safe defaults.

## Database (PostgreSQL container)

File: `infrastructure/docker/.env` · Template: `infrastructure/docker/.env.example`

Read by `docker compose` when starting the local Postgres + Adminer stack.
The values become the superuser credentials inside the container; the
engine itself connects with the lower-privilege `stryvia_app` role
provisioned by `infrastructure/docker/initdb/03-roles.sql`.

| Variable            | Type   | Required | Default       | Used by      | Description                                                                                |
| ------------------- | ------ | -------- | ------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `POSTGRES_USER`     | string | yes      | `stryvia`     | docker, psql | Superuser name initialised inside the Postgres container.                                  |
| `POSTGRES_PASSWORD` | secret | yes      | _(random)_    | docker, psql | Superuser password. Generate with `openssl rand -base64 24`. `setup.sh` does this for you. |
| `POSTGRES_DB`       | string | yes      | `stryvia_dev` | docker       | Database name created at container init.                                                   |

## Engine (FastAPI valuation service)

File: `services/engine/.env` · Template: `services/engine/.env.example`

Loaded by `pydantic-settings` via `Settings` in
`services/engine/src/stryvia_engine/config.py`. Field names are
case-insensitive: `database_url` ↔ `DATABASE_URL`.

### Runtime

| Variable      | Type                                      | Required | Default       | Description                                                     |
| ------------- | ----------------------------------------- | -------- | ------------- | --------------------------------------------------------------- |
| `ENVIRONMENT` | `development` \| `test` \| `production`   | no       | `development` | Selects environment-conditional behavior (e.g. key validators). |
| `LOG_LEVEL`   | `DEBUG` \| `INFO` \| `WARNING` \| `ERROR` | no       | `INFO`        | Python log level.                                               |
| `LOG_FORMAT`  | `console` \| `json`                       | no       | `console`     | `json` is for log aggregators; `console` is human-readable.     |
| `HOST`        | string                                    | no       | `127.0.0.1`   | uvicorn bind address. Set to `0.0.0.0` inside containers.       |
| `PORT`        | int                                       | no       | `8000`        | uvicorn port.                                                   |

### Database

| Variable          | Type | Required | Default                                                                         | Description                                                                                  |
| ----------------- | ---- | -------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `DATABASE_URL`    | url  | yes      | `postgresql+psycopg://stryvia_app:stryvia_app_devpw@localhost:5432/stryvia_dev` | Async psycopg 3 URL. Connect as `stryvia_app` (least-privilege), NOT the Postgres superuser. |
| `DB_ECHO`         | bool | no       | `false`                                                                         | Echo SQL to logs. Useful for debugging.                                                      |
| `DB_POOL_SIZE`    | int  | no       | `5`                                                                             | SQLAlchemy connection pool size.                                                             |
| `DB_MAX_OVERFLOW` | int  | no       | `10`                                                                            | Extra connections allowed beyond the pool size before blocking.                              |

### AI providers

| Variable            | Type   | Required                           | Default | Description                                                                                                                                                                                   |
| ------------------- | ------ | ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | secret | dev/test: no · **production: yes** | _none_  | Claude API key. Used by `stryvia_engine.core.anthropic_client`, the single point through which all AI calls route. Get one at <https://console.anthropic.com/>. Format starts with `sk-ant-`. |

The model validator on `Settings` enforces the production requirement: if
`ENVIRONMENT=production` and `ANTHROPIC_API_KEY` is missing, the engine
refuses to start.

## Producer Workspace (Next.js)

File: `apps/producer/.env.local` · Template: `apps/producer/.env.local.example`

Next.js loads `.env.local` automatically. `NEXT_PUBLIC_*` values are
inlined into the browser bundle at build time — never put secrets here.

| Variable                 | Type   | Required | Default                 | Description                                                        |
| ------------------------ | ------ | -------- | ----------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_ENGINE_URL` | url    | yes      | `http://localhost:8000` | Base URL of the FastAPI engine. Reached from both server + client. |
| `NEXT_PUBLIC_APP_NAME`   | string | yes      | `STRYVIA`               | App name shown in browser tab + metadata.                          |

## Admin Console (Next.js)

File: `apps/admin/.env.local` · Template: `apps/admin/.env.local.example`

| Variable                 | Type   | Required | Default                 | Description                               |
| ------------------------ | ------ | -------- | ----------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_ENGINE_URL` | url    | yes      | `http://localhost:8000` | Base URL of the FastAPI engine.           |
| `NEXT_PUBLIC_APP_NAME`   | string | yes      | `STRYVIA Admin`         | App name shown in browser tab + metadata. |

## Future / production-only variables

Listed here so future-you knows the shape of what's coming, but **not
implemented in the current phase** — adding any of these now is out of
scope. They will be wired up alongside the deployment work:

- `JWT_SECRET` — signing key for session tokens (auth).
- `ENCRYPTION_KEY` — symmetric key for at-rest field encryption.
- `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — object storage for uploads.
- `SENTRY_DSN` — error reporting.
- `OTEL_EXPORTER_OTLP_ENDPOINT` — distributed tracing.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — billing (Phase 3+).
- `RESEND_API_KEY` (or equivalent) — transactional email.
- `REDIS_URL` — caching / rate limiting / pub-sub.

Production-only operational values (`POSTGRES_HOST`, replicas, TLS certs,
etc.) are also deferred — see the runbook.

## Secrets management

### Local development

All secrets live in `.env` / `.env.local` files on the developer's
machine. These files are gitignored: `.gitignore` excludes `.env` and
`.env.*` while explicitly allowing `.env.example` / `.env.*.example`
templates. `setup.sh` generates random passwords for any `*_PASSWORD`
field still set to a placeholder.

Rules:

- **Never commit** a populated `.env` file.
- **Never log** secret values — pydantic-settings models should never be
  serialized into log lines or error responses.
- **Never paste** secrets into chat, PRs, issues, screenshots, or screen
  recordings. If a key is exposed, rotate it immediately.

### Production (deferred)

Production secret management is implemented in the deployment phase.
Planned approach:

- Secrets stored in **AWS Secrets Manager** (or Parameter Store for
  non-sensitive config), pulled at container start by the orchestrator.
- Rotation policies for the database password and `ANTHROPIC_API_KEY`.
- Audit logging on secret access.
- Per-environment KMS keys for encryption-at-rest.

See [`runbooks/production-secrets.md`](./runbooks/production-secrets.md)
for the placeholder runbook. **Do not implement production secret
management against local dev** — that is explicitly out of scope until the
deployment phase.
