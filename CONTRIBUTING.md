# Contributing to STRYVIA

This document covers the conventions every commit on this repo follows. Read
it once; the hooks will catch you when you forget.

## Branching strategy

- **`main` is always deployable.** It must build, type-check, lint, and pass
  tests at every commit. Direct commits to `main` are reserved for trivial
  edits (typos, docs); anything substantive goes through a feature branch.
- Every meaningful change happens on a short-lived branch off `main`.
- Branches are merged back into `main` via pull request once they're green.

### Branch naming

Use a `type/short-kebab-summary` shape:

| Prefix      | Use for                                            | Example                          |
| ----------- | -------------------------------------------------- | -------------------------------- |
| `feature/`  | New user-facing capability                         | `feature/producer-script-import` |
| `fix/`      | Bug fix                                            | `fix/auth-redirect-loop`         |
| `chore/`    | Tooling, deps, infra, non-user-facing housekeeping | `chore/upgrade-turbo`            |
| `docs/`     | Documentation only                                 | `docs/contributing-guide`        |
| `refactor/` | Behavior-preserving code reshape                   | `refactor/engine-pricing-module` |
| `test/`     | Test-only changes                                  | `test/engine-fixture-coverage`   |

Keep names short, lowercase, and kebab-cased. No issue numbers in the branch
name — link them in the PR description.

## Commit message format

Every commit follows
[Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional-scope>): <subject>

<optional body — what and why, not how>

<optional footer — BREAKING CHANGE: …, Closes #123, etc.>
```

### Allowed types

| Type       | Use for                                                 |
| ---------- | ------------------------------------------------------- |
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation-only change                               |
| `style`    | Formatting, whitespace, no logic change                 |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf`     | Performance improvement                                 |
| `test`     | Adding or fixing tests                                  |
| `build`    | Build system, package manager, dependencies             |
| `ci`       | CI configuration                                        |
| `chore`    | Routine maintenance that doesn't fit elsewhere          |
| `revert`   | Reverts a previous commit                               |

### Scope (optional but encouraged)

Use the package or app name: `producer`, `admin`, `brand`, `engine`, `types`,
`ui`, `api-client`, `i18n`, `config`, `docs`, `infra`.

### Examples

```
feat(producer): add script upload with PDF parsing
fix(engine): correct currency rounding in valuation totals
docs: document Phase 1A environment setup in README
refactor(types): collapse duplicate ScenePlacement variants
chore: bump turbo to 2.3.3
build(engine): pin ruff version in pyproject.toml
```

### Subject line rules

- Imperative mood: "add", not "added" or "adds".
- No trailing period.
- Lowercase first letter (PascalCase / UPPERCASE / Start Case are rejected).
- Hard limit 100 characters; aim for 72.

### Breaking changes

Either add `!` after the type/scope or include a `BREAKING CHANGE:` footer:

```
feat(api-client)!: rename ValuationResult.totalCents to totalMinorUnits

BREAKING CHANGE: callers must update field references.
```

## Pre-commit hooks

[Husky](https://typicode.github.io/husky) wires two hooks. They run locally
on every commit; they are not optional.

### `pre-commit`

Runs through [lint-staged](https://github.com/lint-staged/lint-staged) on the
files you actually staged:

- `*.{ts,tsx,js,jsx,mjs,cjs}` → `prettier --write` then `eslint --fix`
- `*.{json,md,mdx,yml,yaml,css,scss,html}` → `prettier --write`
- `services/engine/**/*.py` → `ruff check --fix` then `ruff format`

If any TypeScript/TSX files are staged, the hook then runs `npm run
typecheck` across the whole workspace. The commit is blocked if any step
fails.

### `commit-msg`

Runs [commitlint](https://commitlint.js.org/) against your message using the
`@commitlint/config-conventional` preset plus the rules in
`commitlint.config.cjs`. A bad message blocks the commit and prints a
diagnostic.

## Bypassing hooks

In a genuine emergency you can skip the hooks:

```bash
git commit --no-verify -m "fix: revert prod outage"
```

Use this **only** when the hooks themselves are broken or you're cleaning up
in flight. You own anything that lands behind a `--no-verify` — fix the
underlying problem in the next commit.

## Local setup

The hooks install themselves the first time you run `npm install`
(`prepare` script invokes `husky`). If hooks aren't firing, re-run `npm
install` from the repo root, then verify `.husky/pre-commit` and
`.husky/commit-msg` are executable.

## Pull requests

- Keep PRs focused. One logical change per PR; rebase noisy fixups before
  review.
- The PR description carries the "why" — link issues, screenshots, and
  testing notes.
- Squash-merge by default; the squash message must itself be a Conventional
  Commit because that's what shows up on `main`.
