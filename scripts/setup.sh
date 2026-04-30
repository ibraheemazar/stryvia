#!/usr/bin/env bash
# scripts/setup.sh
# -----------------------------------------------------------------------------
# One-command bootstrap for a fresh STRYVIA clone.
#
# What it does (idempotently — safe to re-run):
#   1. Verifies prerequisites (Docker running, Node 20+, Python 3.11+, npm).
#   2. Installs root + workspace npm dependencies.
#   3. Copies *.env.example → *.env (or *.env.local) where the target is missing.
#   4. Generates strong random passwords for any *_PASSWORD field still set
#      to a placeholder.
#   5. Starts the local Postgres + Adminer stack (docker compose up -d).
#   6. Creates services/engine/.venv if missing, installs Python deps.
#   7. Builds the @stryvia/types package.
#   8. Runs Alembic migrations against the local DB.
#   9. Prints next-step instructions (most importantly: paste your
#      Anthropic API key).
#
# Re-running on an already-set-up tree should be a no-op aside from
# starting the containers and applying any new migrations.
# -----------------------------------------------------------------------------
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
if [[ -t 1 ]]; then
    BOLD=$(tput bold || true)
    DIM=$(tput dim || true)
    GREEN=$(tput setaf 2 || true)
    YELLOW=$(tput setaf 3 || true)
    RED=$(tput setaf 1 || true)
    RESET=$(tput sgr0 || true)
else
    BOLD=""; DIM=""; GREEN=""; YELLOW=""; RED=""; RESET=""
fi

step()  { printf "\n%s==>%s %s%s%s\n" "${GREEN}" "${RESET}" "${BOLD}" "$*" "${RESET}"; }
info()  { printf "    %s\n" "$*"; }
warn()  { printf "    %s%s%s\n" "${YELLOW}" "$*" "${RESET}"; }
fail()  { printf "%serror:%s %s\n" "${RED}" "${RESET}" "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# 1. Prerequisites
# ---------------------------------------------------------------------------
step "Checking prerequisites"

command -v docker >/dev/null 2>&1 || fail "Docker is not installed."
docker info >/dev/null 2>&1 || fail "Docker daemon is not running. Start Docker Desktop and try again."
info "Docker: running"

command -v node >/dev/null 2>&1 || fail "Node.js is not installed."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [[ "${NODE_MAJOR}" -lt 20 ]]; then
    fail "Node.js 20+ required, found $(node --version)."
fi
info "Node.js: $(node --version)"

command -v npm >/dev/null 2>&1 || fail "npm is not installed."
info "npm: $(npm --version)"

# Python 3.11 specifically — the engine pins to >=3.11,<3.12.
PYTHON_BIN=""
for candidate in python3.11 python3; do
    if command -v "${candidate}" >/dev/null 2>&1; then
        version="$("${candidate}" -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")')"
        if [[ "${version}" == "3.11" ]]; then
            PYTHON_BIN="${candidate}"
            break
        fi
    fi
done
[[ -n "${PYTHON_BIN}" ]] || fail "Python 3.11 is required (engine pyproject pins >=3.11,<3.12)."
info "Python: $(${PYTHON_BIN} --version) (${PYTHON_BIN})"

command -v openssl >/dev/null 2>&1 || fail "openssl is required to generate secrets."

# ---------------------------------------------------------------------------
# 2. npm install
# ---------------------------------------------------------------------------
step "Installing npm dependencies"
npm install --silent
info "npm dependencies installed"

# ---------------------------------------------------------------------------
# 3. Copy env templates → real env files (only if missing)
# ---------------------------------------------------------------------------
step "Setting up environment files"

# (template, target) pairs
ENV_PAIRS=(
    "infrastructure/docker/.env.example:infrastructure/docker/.env"
    "services/engine/.env.example:services/engine/.env"
    "apps/producer/.env.local.example:apps/producer/.env.local"
    "apps/admin/.env.local.example:apps/admin/.env.local"
)

for pair in "${ENV_PAIRS[@]}"; do
    template="${pair%%:*}"
    target="${pair##*:}"
    if [[ ! -f "${template}" ]]; then
        warn "missing template: ${template} (skipping)"
        continue
    fi
    if [[ -f "${target}" ]]; then
        info "exists, leaving alone: ${target}"
    else
        cp "${template}" "${target}"
        info "created: ${target}"
    fi
done

# ---------------------------------------------------------------------------
# 4. Generate random passwords for placeholder values
# ---------------------------------------------------------------------------
step "Generating passwords for placeholder values"

# A "placeholder" is any line of the form FOO_PASSWORD=... whose value
# starts with "replace-with-" (matching the convention used in our
# .env.example files). We never overwrite real-looking values.
ENV_TARGETS=(
    "infrastructure/docker/.env"
    "services/engine/.env"
    "apps/producer/.env.local"
    "apps/admin/.env.local"
)

for env_file in "${ENV_TARGETS[@]}"; do
    [[ -f "${env_file}" ]] || continue
    # All *_PASSWORD lines whose value starts with the placeholder marker.
    while IFS= read -r line; do
        var_name="${line%%=*}"
        new_pw="$(openssl rand -base64 24)"
        # Use python for a safe in-place edit — sed escaping varies by platform.
        "${PYTHON_BIN}" - "${env_file}" "${var_name}" "${new_pw}" <<'PY'
import sys, pathlib
path, var, value = sys.argv[1], sys.argv[2], sys.argv[3]
text = pathlib.Path(path).read_text()
out_lines = []
for line in text.splitlines():
    if line.startswith(f"{var}="):
        out_lines.append(f"{var}={value}")
    else:
        out_lines.append(line)
pathlib.Path(path).write_text("\n".join(out_lines) + ("\n" if text.endswith("\n") else ""))
PY
        info "generated ${var_name} in ${env_file}"
    done < <(grep -E '^[A-Z_]+_PASSWORD=replace-with-' "${env_file}" || true)
done

# ---------------------------------------------------------------------------
# 5. Start Docker stack
# ---------------------------------------------------------------------------
step "Starting Docker containers"
docker compose -f infrastructure/docker/docker-compose.yml up -d
info "Postgres + Adminer running"

# Brief wait for Postgres to accept connections (compose healthcheck makes
# this near-instant on re-runs but cold-start can take a few seconds).
info "Waiting for Postgres to accept connections..."
for i in {1..30}; do
    if docker exec stryvia-postgres pg_isready -U postgres >/dev/null 2>&1; then
        info "Postgres is ready"
        break
    fi
    sleep 1
    if [[ "${i}" -eq 30 ]]; then
        fail "Postgres did not become ready within 30 seconds."
    fi
done

# ---------------------------------------------------------------------------
# 6. Python venv + deps
# ---------------------------------------------------------------------------
step "Setting up Python venv for the engine"
ENGINE_DIR="${REPO_ROOT}/services/engine"
VENV_DIR="${ENGINE_DIR}/.venv"

if [[ ! -d "${VENV_DIR}" ]]; then
    "${PYTHON_BIN}" -m venv "${VENV_DIR}"
    info "created venv: ${VENV_DIR}"
else
    info "venv exists: ${VENV_DIR}"
fi

# shellcheck disable=SC1091
source "${VENV_DIR}/bin/activate"
pip install --quiet --upgrade pip
pip install --quiet -e "${ENGINE_DIR}[dev]"
info "Python dependencies installed"

# ---------------------------------------------------------------------------
# 7. Build @stryvia/types
# ---------------------------------------------------------------------------
step "Building @stryvia/types"
if npm run --workspace=@stryvia/types --if-present build >/dev/null 2>&1; then
    info "@stryvia/types built"
else
    warn "no build script for @stryvia/types (skipping)"
fi

# ---------------------------------------------------------------------------
# 8. Alembic migrations
# ---------------------------------------------------------------------------
step "Running database migrations"
(
    cd "${ENGINE_DIR}"
    alembic upgrade head
)
info "migrations applied"

# ---------------------------------------------------------------------------
# 9. Summary + next steps
# ---------------------------------------------------------------------------
step "Setup complete"

cat <<EOF

  ${GREEN}Everything is set up.${RESET} Next steps:

    1. ${BOLD}Paste your Anthropic API key${RESET} into ${BOLD}services/engine/.env${RESET}
       (replace the ANTHROPIC_API_KEY=sk-ant-replace-with-your-key line).
       Get a key at: ${DIM}https://console.anthropic.com/${RESET}

    2. Verify your environment is healthy:
         ${BOLD}./scripts/check-env.sh${RESET}

    3. Start the stack:
         ${BOLD}npm run dev:all${RESET}     # engine + producer + admin in parallel
       …or individually:
         ${BOLD}npm run dev:engine${RESET}   # FastAPI on :8000
         ${BOLD}npm run dev:producer${RESET} # Next.js on :3000
         ${BOLD}npm run dev:admin${RESET}    # Next.js on :3001

    4. Phase 1A does not yet make AI calls — the API key is only required
       starting Phase 1B. Skip step 1 if you are only working on Phase 1A.

EOF
