# Changelog

All notable changes to STRYVIA will be documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) once
public releases begin.

## [Unreleased]

### Added

- Phase 1A: Complete development environment foundation
- Turborepo monorepo with `apps/`, `packages/`, `services/`, and shared config
- PostgreSQL with six domain schemas and least-privilege runtime role
- Python valuation engine skeleton (FastAPI, SQLAlchemy, Alembic, Ruff, mypy)
- Producer Workspace (Next.js 15, App Router)
- Admin Console (Next.js 15, App Router)
- Shared `@stryvia/types` package generated from the database schema
- Shared `@stryvia/ui` design system and `@stryvia/i18n` runtime
- Shared `@stryvia/api-client` and `@stryvia/config/*` packages
- Code quality baseline: ESLint 9, Prettier 3, TypeScript 5.7, EditorConfig
- Environment + secrets management with per-app `.env.example` templates and
  `scripts/check-env.sh` validation
- Local developer scripts: `setup.sh`, `db-connect.sh`, `db-reset.sh`
- Git version control with Husky-managed hooks (pre-commit, commit-msg) and
  lint-staged + commitlint for Conventional Commits enforcement
