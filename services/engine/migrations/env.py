"""Alembic environment for STRYVIA.

The database URL is built from infrastructure/docker/.env at runtime — never
from alembic.ini — so credentials live in exactly one place.

Multi-schema notes
------------------
STRYVIA uses six domain schemas (scripts, analysis, valuations, benchmarks,
accounts, learning). Two settings make Alembic schema-aware:

* ``version_table_schema='public'`` — pins the bookkeeping table
  ``alembic_version`` to ``public`` regardless of search_path, so it never
  drifts into a domain schema by accident.
* ``include_schemas=True`` — when autogenerate runs (later, once SQLAlchemy
  models exist), it inspects every non-system schema instead of only the
  default search_path schema.
"""

import os
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool

# ---------------------------------------------------------------------------
# Load credentials from infrastructure/docker/.env (the only source of truth).
# ---------------------------------------------------------------------------
ENGINE_DIR = Path(__file__).resolve().parent.parent
REPO_ROOT = ENGINE_DIR.parent.parent
DOTENV_PATH = REPO_ROOT / "infrastructure" / "docker" / ".env"

if not DOTENV_PATH.exists():
    raise RuntimeError(
        f"expected env file at {DOTENV_PATH} — copy "
        "infrastructure/docker/.env.example to .env and try again."
    )

load_dotenv(DOTENV_PATH)

PG_USER = os.environ["POSTGRES_USER"]
PG_PASSWORD = os.environ["POSTGRES_PASSWORD"]
PG_DB = os.environ["POSTGRES_DB"]
PG_HOST = os.environ.get("POSTGRES_HOST", "localhost")
PG_PORT = os.environ.get("POSTGRES_PORT", "5432")

DATABASE_URL = f"postgresql+psycopg://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DB}"

# ---------------------------------------------------------------------------
# Alembic boilerplate.
# ---------------------------------------------------------------------------
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# When SQLAlchemy models are added in a later session, point this at their
# Base.metadata. Until then, autogenerate has nothing to compare against.
target_metadata = None


def run_migrations_offline() -> None:
    """Emit SQL to stdout instead of executing it (for review / scripting)."""
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        version_table_schema="public",
        include_schemas=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Connect to the database and apply migrations."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            version_table_schema="public",
            include_schemas=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
