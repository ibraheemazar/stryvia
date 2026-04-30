# Production secrets management

> **Status: intentionally blank.** Production secrets management will be
> implemented in the deployment phase. This document will cover AWS
> Secrets Manager integration, key rotation policies, and audit
> requirements at that time.
>
> **Do not implement production secret management for local dev.** Local
> development uses gitignored `.env` files (see
> [`../environment.md`](../environment.md)). Adding secret-manager
> plumbing now is out of scope and will be reverted.

## Why this placeholder exists

Naming the deployment-phase work prevents two failure modes:

1. Discovering at deploy time that no one thought about how secrets reach
   the running services.
2. Building production-grade secret plumbing prematurely against a
   developer laptop, which adds friction with no security gain.

## Secrets that will need to be managed in production

The list below is what the system will produce or consume by the time the
deployment phase begins. It is intentionally a superset of what the code
reads today — most of these have not been wired up yet.

### Already in use (Phase 1)

- `DATABASE_URL` — full connection string including password.
- `POSTGRES_PASSWORD` — superuser password (only used by the local
  Docker-Compose stack today; production will use a managed Postgres
  service with its own credentials).
- `ANTHROPIC_API_KEY` — Claude API access.

### Expected in later phases

- `JWT_SECRET` — session token signing key.
- `ENCRYPTION_KEY` — symmetric key for at-rest field encryption.
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — IAM credentials (or, more
  likely, IRSA / instance profiles instead).
- `S3_BUCKET` configuration values (bucket name is not a secret; access
  credentials are).
- `SENTRY_DSN` — error reporting.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` — billing.
- `RESEND_API_KEY` (or equivalent transactional email provider).
- `REDIS_URL` (with auth token).
- TLS certificates / private keys for any service exposing HTTPS directly.

## What will land here when the deployment phase begins

- Choice of secret store (AWS Secrets Manager vs Parameter Store vs
  HashiCorp Vault) and the reasoning.
- How secrets are injected into running containers (init container,
  sidecar, environment from secrets, mounted file).
- Rotation policy per secret (cadence, ownership, automation).
- Break-glass procedure: who can read production secrets, how the access
  is audited, how to rotate after exposure.
- Per-environment isolation (dev / staging / production accounts and
  KMS keys).
- Disaster recovery: restoring secrets after account compromise or
  region failure.

Until then: **stop here.** Local dev only.
