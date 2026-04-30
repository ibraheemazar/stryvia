#!/usr/bin/env bash
# scripts/db-connect.sh
# -----------------------------------------------------------------------------
# Open a psql shell against the local STRYVIA Postgres container.
#
# Reads credentials from infrastructure/docker/.env and execs `psql` *inside*
# the running stryvia-postgres container — so it works whether or not psql is
# installed on the host machine.
#
# Usage:
#   ./scripts/db-connect.sh                # interactive shell
#   ./scripts/db-connect.sh -c "\dn"       # one-off command, then exit
# -----------------------------------------------------------------------------
set -euo pipefail

# Resolve repo root from this script's location, regardless of cwd.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${REPO_ROOT}/infrastructure/docker/.env"
CONTAINER="stryvia-postgres"

if [[ ! -f "${ENV_FILE}" ]]; then
    echo "error: ${ENV_FILE} not found." >&2
    echo "       copy infrastructure/docker/.env.example to .env and try again." >&2
    exit 1
fi

# shellcheck disable=SC1090
set -a; source "${ENV_FILE}"; set +a

if ! docker ps --format '{{.Names}}' | grep -qx "${CONTAINER}"; then
    echo "error: container '${CONTAINER}' is not running." >&2
    echo "       start it with: docker compose -f infrastructure/docker/docker-compose.yml up -d" >&2
    exit 1
fi

# -it gives an interactive TTY; PGPASSWORD is consumed by psql so we don't
# echo the password on the command line.
exec docker exec -it \
    -e PGPASSWORD="${POSTGRES_PASSWORD}" \
    "${CONTAINER}" \
    psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" "$@"
