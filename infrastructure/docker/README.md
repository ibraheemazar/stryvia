# Docker / local infrastructure

Holds the local development infrastructure definitions — primarily a `docker-compose.yml` that brings up STRYVIA's runtime dependencies (Postgres, Redis, the engine service, etc.) so contributors can `docker compose up` and have a working environment.

This is **local-dev infrastructure only**. Production infra (Terraform, Kubernetes manifests, CI definitions) lives elsewhere and is not part of this folder.

**Currently a placeholder** — the docker-compose stack is added in a later Phase 1A session. See `docs/architecture/` for the staged build plan.
