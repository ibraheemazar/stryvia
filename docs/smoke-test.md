# End-to-end smoke test

A short, durable check that the four pieces of the STRYVIA stack —
PostgreSQL, the FastAPI engine, the Producer Workspace, and the Admin
Console — start together and can talk to each other from the browser.

Run it after any significant change (dependency bumps, schema migrations,
engine config changes, framework upgrades). If every step passes, the
foundation is healthy.

## What "everything is healthy" means

1. **PostgreSQL** is reachable on `localhost:5432`.
2. **The engine** answers `/api/health/ready` with HTTP 200 and
   `database: ok` (proves it can both serve HTTP _and_ connect to the
   database).
3. **The Producer App** at `http://localhost:3001/en/system-status` and
   the **Admin Console** at `http://localhost:3002/en/system-status` both
   load and the three live-data cards on each page render real engine
   responses (no spinners, no red errors). This proves the Next.js apps
   compile, render, and successfully cross-origin fetch the engine.

If any of those is wrong, this document tells you which one and roughly
why.

## The four services

| Service       | Port | Started by                                |
| ------------- | ---- | ----------------------------------------- |
| PostgreSQL    | 5432 | `npm run dev:db` (Docker Compose, `-d`)   |
| Adminer       | 8080 | `npm run dev:db` (same Compose stack)     |
| Engine (API)  | 8000 | `npm run dev:engine` (`uvicorn --reload`) |
| Producer App  | 3001 | `npm run dev:producer` (Next.js dev)      |
| Admin Console | 3002 | `npm run dev:admin` (Next.js dev)         |

## Running it

### Option A — one command

```bash
npm run dev:all
```

This brings up Postgres in the background, then runs the engine, Producer,
and Admin in parallel under [`concurrently`](https://github.com/open-cli-tools/concurrently)
with colour-coded prefixes. Press `Ctrl-C` once to stop all three live
processes; the database keeps running until you stop it explicitly with
`docker compose -f infrastructure/docker/docker-compose.yml down`.

### Option B — four terminals (preferred when debugging)

Useful when one process is misbehaving and you want its logs unmixed.

```bash
# Terminal 1 — database (detached, returns immediately)
npm run dev:db

# Terminal 2 — engine
npm run dev:engine

# Terminal 3 — Producer Workspace
npm run dev:producer

# Terminal 4 — Admin Console
npm run dev:admin
```

## Verification

Once everything is up, run the four checks in any spare terminal:

```bash
# 1. Postgres TCP — port is open
nc -z localhost 5432 && echo OK

# 2. Engine readiness — must return database: ok
curl -sf http://localhost:8000/api/health/ready

# 3. Producer App — landing page renders
curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3001/en

# 4. Admin Console — landing page renders
curl -sf -o /dev/null -w '%{http_code}\n' http://localhost:3002/en
```

All four should succeed (`OK`, JSON with `"database":"ok"`, `200`, `200`).

Then open both system-status pages in a browser:

- **Producer:** <http://localhost:3001/en/system-status>
- **Admin:** <http://localhost:3002/en/system-status>

Each page shows three cards (`live`, `ready`, `version`), each with a
`Healthy` badge and a JSON payload pulled directly from the engine. The
two pages should display identical engine version + build timestamp,
since they hit the same backend.

## What success looks like

- Every card on both system-status pages shows a green `Healthy` badge.
- The `/api/health/ready` card includes `"database": "ok"`.
- The `/api/health/version` card shows the same `engine_version` and
  `build_timestamp` on both apps (they're hitting the same engine).
- Refreshing any card via the **Refresh** button briefly shows a
  loading state and resolves back to `Healthy` with fresh data.

## Common failure modes

| Symptom on the page                                          | Most likely cause                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cards stuck on `Loading…` indefinitely                       | Browser is blocking the fetch by CORS. Check `CORS_ALLOWED_ORIGINS` in `services/engine/.env` — must include both `http://localhost:3001` and `http://localhost:3002`. Re-start the engine after editing `.env`.                                                                                             |
| All cards show `Error` with "Network request failed"         | The engine isn't running, or it's running on a different port. Verify `curl http://localhost:8000/api/health/live` returns JSON.                                                                                                                                                                             |
| Producer page is fine but Admin shows errors (or vice-versa) | One of the two Next.js apps isn't running. Check the terminal you started `dev:admin` / `dev:producer` in.                                                                                                                                                                                                   |
| `/api/health/ready` shows `"database": "unavailable"`        | The engine started but can't reach Postgres. Run `nc -z localhost 5432` to confirm the port is open, then check the engine logs for the connection error. Common cause: container stopped, or `DATABASE_URL` in `services/engine/.env` doesn't match the role / password the container was initialised with. |
| Producer or Admin returns 500 in dev                         | Usually a typo in a recently-edited file — check the Next.js terminal for the stack trace. `npm run typecheck` from the repo root catches most of these before runtime.                                                                                                                                      |
| Both pages return 404 from the dev server                    | Make sure you visit the **`/en/`** path — the apps redirect un-prefixed URLs but that redirect can be confusing if a service worker is cached.                                                                                                                                                               |

## Regenerate after major changes

This document captures the smallest end-to-end loop that proves the
system works. Re-run it after any of:

- Bumping Next.js, FastAPI, SQLAlchemy, or pydantic-settings major versions.
- Adding a new shared package the apps depend on.
- Changing the engine's CORS allow-list, port, or API prefix.
- Changing the database schema, role, or password.
- Changing the dev port assignments in any `package.json`.

If the smoke test still passes after a change, the change is foundationally
sound. If it doesn't, fix it before moving on — every later session in
the project assumes this loop works.
