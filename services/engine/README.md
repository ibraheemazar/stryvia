# Valuation Engine

The core STRYVIA backend service. Computes brand integration valuations for
scenes, scripts, and full productions, exposing a typed HTTP API consumed by
the frontend apps via `@stryvia/api-client`.

**Stack:** Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.x (async),
Alembic, psycopg 3, structlog, PostgreSQL 16. The current skeleton ships a
running FastAPI app with health endpoints, structured logging, async DB
plumbing, and a green test suite. Domain logic (script analysis, AI
integration, valuation models) lands in Phase 1B.

---

## 1. Local database (Docker)

PostgreSQL runs in Docker via the compose stack at
`infrastructure/docker/docker-compose.yml`. It also brings up Adminer (a
lightweight web UI) for visual inspection.

### One-time setup

```bash
# From the repo root, copy the env template and fill in a strong password.
cp infrastructure/docker/.env.example infrastructure/docker/.env
# Edit the file and set POSTGRES_PASSWORD — for example:
#   openssl rand -base64 24
```

### Start / stop

```bash
# Start (detached). First run pulls images and runs initdb/*.sql.
docker compose -f infrastructure/docker/docker-compose.yml up -d

# Status — postgres should report "healthy".
docker compose -f infrastructure/docker/docker-compose.yml ps

# Stop (data preserved in the named volume).
docker compose -f infrastructure/docker/docker-compose.yml down
```

After startup:

- Postgres listens on `localhost:5432`
- Adminer is at <http://localhost:8080> (system: PostgreSQL, server: `postgres`)

### Connect via psql

```bash
./scripts/db-connect.sh                 # interactive psql shell
./scripts/db-connect.sh -c '\dn'        # one-off command
```

### Reset (destroys all data)

```bash
./scripts/db-reset.sh
# Type RESET when prompted. Removes the named volume and re-runs initdb.
```

---

## 2. Python environment

A virtual environment lives inside `services/engine/.venv` and is the only
supported way to run engine tooling locally. Python `3.11.9` is pinned in
`.python-version` (managed by `pyenv`).

```bash
cd services/engine

# First time — or after deleting .venv:
python3.11 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e '.[dev]'

# Subsequent shells:
source .venv/bin/activate
```

Local config lives in `services/engine/.env` (gitignored). Copy from
`.env.example` and adjust:

```bash
cp .env.example .env
# Edit DATABASE_URL etc. — keep credentials in sync with infrastructure/docker/.env.
```

---

## 3. Running the service

```bash
# Dev server with auto-reload.
uvicorn stryvia_engine.main:app --reload --host 127.0.0.1 --port 8000

# Smoke-test the live and ready endpoints.
curl http://localhost:8000/health/live
curl http://localhost:8000/health/ready
```

---

## 4. Tests, lint, types

```bash
pytest                  # full suite
ruff check .            # lint
ruff format .           # format
mypy src                # type-check
```

---

## 5. Migrations (Alembic)

Migrations live in `services/engine/migrations/` and are configured in
`alembic.ini`. The database URL is **not** stored in `alembic.ini` — it's
constructed at runtime from `infrastructure/docker/.env` by
`migrations/env.py`. That keeps DB credentials in one place.

### Common commands

```bash
alembic current                    # show currently-applied head
alembic history                    # list every revision
alembic upgrade head               # apply all pending migrations
alembic downgrade -1               # roll back one migration
alembic revision -m "describe it"  # new empty migration
# autogenerate becomes useful once SQLAlchemy models exist:
# alembic revision --autogenerate -m "..."
```

---

## 6. Layout

```
services/engine/
├── pyproject.toml          # deps + tool config (ruff, mypy, pytest)
├── .python-version         # pyenv pin (3.11.9)
├── .env.example            # runtime env template
├── alembic.ini             # alembic config (URL set at runtime)
├── migrations/             # alembic revisions
├── src/stryvia_engine/
│   ├── main.py             # FastAPI app factory + lifespan
│   ├── config.py           # pydantic-settings env config
│   ├── logging_config.py   # structlog setup
│   ├── api/                # routers, dependencies, error handlers
│   ├── db/                 # async session factory, base model, health probe
│   ├── core/               # exceptions, version
│   └── domain/             # placeholder — engine logic lands in 1B
└── tests/                  # pytest suite
```
