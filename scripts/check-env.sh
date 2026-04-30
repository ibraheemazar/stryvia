#!/usr/bin/env bash
# scripts/check-env.sh
# -----------------------------------------------------------------------------
# Verify the local STRYVIA development environment is healthy.
#
# Checks:
#   1. Every required .env file exists.
#   2. No env file still contains a placeholder value (e.g. "replace-with-…").
#   3. Docker containers are running.
#   4. The engine can connect to the database (HTTP /api/health/ready
#      reports database: ok). Skipped if the engine is not running.
#
# Exits 0 if everything required is healthy (warnings are tolerated), or
# 1 if any required check fails.
# -----------------------------------------------------------------------------
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
if [[ -t 1 ]]; then
    BOLD=$(tput bold || true)
    GREEN=$(tput setaf 2 || true)
    YELLOW=$(tput setaf 3 || true)
    RED=$(tput setaf 1 || true)
    RESET=$(tput sgr0 || true)
else
    BOLD=""; GREEN=""; YELLOW=""; RED=""; RESET=""
fi

PASSES=()
WARNS=()
FAILS=()

ok()    { PASSES+=("$1"); printf "  %s✓%s %s\n" "${GREEN}" "${RESET}" "$1"; }
warn()  { WARNS+=("$1");  printf "  %s!%s %s\n" "${YELLOW}" "${RESET}" "$1"; }
fail()  { FAILS+=("$1");  printf "  %s✗%s %s\n" "${RED}" "${RESET}" "$1"; }

section() { printf "\n%s%s%s\n" "${BOLD}" "$1" "${RESET}"; }

# ---------------------------------------------------------------------------
# 1. Required env files
# ---------------------------------------------------------------------------
section "Env files"

REQUIRED_FILES=(
    "infrastructure/docker/.env"
    "services/engine/.env"
    "apps/producer/.env.local"
    "apps/admin/.env.local"
)

for f in "${REQUIRED_FILES[@]}"; do
    if [[ -f "${f}" ]]; then
        ok "${f}"
    else
        fail "${f} (missing — run ./scripts/setup.sh)"
    fi
done

# ---------------------------------------------------------------------------
# 2. Placeholder detection
# ---------------------------------------------------------------------------
section "Placeholder values"

# A "placeholder" is any value of the form `replace-with-…` (matching the
# convention in our .env.example files). ANTHROPIC_API_KEY's placeholder
# is a soft warning (only needed from Phase 1B onward); every other
# placeholder is a hard failure.
for f in "${REQUIRED_FILES[@]}"; do
    [[ -f "${f}" ]] || continue
    matched_any=0
    while IFS= read -r line; do
        [[ "${line}" =~ ^[[:space:]]*# ]] && continue
        [[ -z "${line}" ]] && continue

        # Hard placeholder marker — anything =replace-with-...
        if [[ "${line}" =~ =replace-with- ]]; then
            var_name="${line%%=*}"
            fail "${f}: ${var_name} still has placeholder value"
            matched_any=1
        fi

        # Anthropic-specific soft check.
        if [[ "${line}" == "ANTHROPIC_API_KEY=sk-ant-replace-with-your-key" ]]; then
            warn "${f}: ANTHROPIC_API_KEY is a placeholder (OK for Phase 1A; required Phase 1B+)"
            matched_any=1
        fi
    done < "${f}"
    if [[ "${matched_any}" -eq 0 ]]; then
        ok "${f}: no placeholders"
    fi
done

# Empty required fields detection — values that are present but blank.
for f in "${REQUIRED_FILES[@]}"; do
    [[ -f "${f}" ]] || continue
    while IFS= read -r line; do
        [[ "${line}" =~ ^[[:space:]]*# ]] && continue
        [[ -z "${line}" ]] && continue
        if [[ "${line}" =~ ^[A-Z_]+=$ ]]; then
            var_name="${line%%=*}"
            fail "${f}: ${var_name} is empty"
        fi
    done < "${f}"
done

# ---------------------------------------------------------------------------
# 3. Docker containers
# ---------------------------------------------------------------------------
section "Docker"

if ! command -v docker >/dev/null 2>&1; then
    fail "docker is not installed"
elif ! docker info >/dev/null 2>&1; then
    fail "Docker daemon is not running"
else
    ok "Docker daemon is running"
    if docker ps --format '{{.Names}}' | grep -qx "stryvia-postgres"; then
        ok "stryvia-postgres container is running"
    else
        fail "stryvia-postgres is not running (run: npm run dev:db)"
    fi
fi

# ---------------------------------------------------------------------------
# 4. Engine reachability (best effort)
# ---------------------------------------------------------------------------
section "Engine health"

# We don't know which port the engine is on — try the configured PORT and
# the conventional 8000.
ENGINE_PORTS=(8000)
if grep -qE '^PORT=' services/engine/.env 2>/dev/null; then
    custom_port="$(grep -E '^PORT=' services/engine/.env | head -1 | cut -d= -f2 | tr -d '[:space:]')"
    if [[ -n "${custom_port}" && "${custom_port}" != "8000" ]]; then
        ENGINE_PORTS+=("${custom_port}")
    fi
fi

found_engine=0
for port in "${ENGINE_PORTS[@]}"; do
    url="http://localhost:${port}/api/health/ready"
    if response="$(curl -fsS --max-time 2 "${url}" 2>/dev/null)"; then
        found_engine=1
        if echo "${response}" | grep -q '"database"[[:space:]]*:[[:space:]]*"ok"'; then
            ok "engine on :${port} reports database: ok"
        else
            warn "engine on :${port} responded but database is not ok: ${response}"
        fi
        break
    fi
done

if [[ "${found_engine}" -eq 0 ]]; then
    warn "engine is not running (start with: npm run dev:engine)"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
section "Summary"
printf "  %s%d passed%s, %s%d warnings%s, %s%d failures%s\n\n" \
    "${GREEN}" "${#PASSES[@]}" "${RESET}" \
    "${YELLOW}" "${#WARNS[@]}" "${RESET}" \
    "${RED}" "${#FAILS[@]}" "${RESET}"

if [[ "${#FAILS[@]}" -gt 0 ]]; then
    printf "%sFix the failures above and re-run.%s\n\n" "${RED}" "${RESET}"
    exit 1
fi

if [[ "${#WARNS[@]}" -gt 0 ]]; then
    printf "%sEverything required is healthy; review warnings above.%s\n\n" \
        "${YELLOW}" "${RESET}"
else
    printf "%sEverything looks good.%s\n\n" "${GREEN}" "${RESET}"
fi
exit 0
