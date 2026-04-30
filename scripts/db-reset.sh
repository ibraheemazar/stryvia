#!/usr/bin/env bash
# scripts/db-reset.sh
# -----------------------------------------------------------------------------
# Destroy the local STRYVIA Postgres data volume and bring up a fresh container.
#
# This is irreversible — every row, every schema, every migration history
# entry is wiped. Use it when:
#   - initdb scripts have changed (they only re-run on a fresh volume)
#   - a migration has corrupted local state
#   - you want a clean slate for testing
#
# Requires interactive confirmation (typing the literal word RESET).
# -----------------------------------------------------------------------------
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
COMPOSE_FILE="${REPO_ROOT}/infrastructure/docker/docker-compose.yml"

if [[ ! -f "${COMPOSE_FILE}" ]]; then
    echo "error: ${COMPOSE_FILE} not found." >&2
    exit 1
fi

cat <<'WARN'
============================================================
  STRYVIA local database — DESTRUCTIVE RESET
============================================================
This will:
  1. Stop the stryvia-postgres container
  2. Delete the stryvia_postgres_data volume (ALL data lost)
  3. Restart Postgres on a fresh, re-initialized volume

WARN

read -r -p "Type RESET to confirm (anything else cancels): " CONFIRM
if [[ "${CONFIRM}" != "RESET" ]]; then
    echo "cancelled."
    exit 0
fi

echo
echo "→ stopping containers and removing data volume..."
docker compose -f "${COMPOSE_FILE}" down -v

echo
echo "→ starting fresh container..."
docker compose -f "${COMPOSE_FILE}" up -d

echo
echo "→ waiting for Postgres to report healthy..."
# Poll the health check rather than sleeping a fixed duration.
ATTEMPTS=0
until [[ "$(docker inspect -f '{{.State.Health.Status}}' stryvia-postgres 2>/dev/null || echo starting)" == "healthy" ]]; do
    ATTEMPTS=$((ATTEMPTS + 1))
    if (( ATTEMPTS > 60 )); then
        echo "error: postgres did not become healthy within ~60s" >&2
        exit 1
    fi
    sleep 1
done

echo
echo "✓ database reset complete. Postgres is healthy on localhost:5432."
