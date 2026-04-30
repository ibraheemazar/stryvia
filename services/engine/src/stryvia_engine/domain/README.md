# Domain layer

This directory is intentionally empty in Phase 1A. It exists so the import
graph (`stryvia_engine.domain`) is stable from day one, and so that early
engine tests can pin the package layout.

## What lands here in Phase 1B

- **Script analysis**: parsing screenplays / shooting scripts into scenes,
  characters, settings, props, and beats.
- **Valuation models**: quantitative scoring of brand-integration
  opportunities (placement type, scene weight, on-screen time, audience
  reach, sentiment).
- **AI integrations**: LLM-driven enrichment and reasoning steps that feed
  into the valuation pipeline.

## Conventions for new code

- One subpackage per bounded context (e.g. `domain/scripts/`,
  `domain/valuations/`, `domain/benchmarks/`).
- Pure-Python modelling lives here. SQLAlchemy ORM models go under
  `stryvia_engine.db` (or a `domain/<context>/models.py` re-exported there).
- HTTP wiring stays in `stryvia_engine.api`; this layer must not import
  FastAPI.
