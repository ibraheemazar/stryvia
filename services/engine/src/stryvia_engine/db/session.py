"""Async SQLAlchemy engine and session factory.

The engine is created once at application startup (see
``stryvia_engine.main.lifespan``) and stashed on ``app.state``. Per-request
sessions are produced by :class:`sqlalchemy.ext.asyncio.async_sessionmaker`
and yielded through the FastAPI dependency in
``stryvia_engine.api.dependencies.get_db_session``.
"""

from __future__ import annotations

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from stryvia_engine.config import Settings


def make_engine(settings: Settings) -> AsyncEngine:
    """Build an async SQLAlchemy engine from the given settings."""
    return create_async_engine(
        settings.database_url,
        echo=settings.db_echo,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
        pool_pre_ping=True,
        future=True,
    )


def make_session_factory(engine: AsyncEngine) -> async_sessionmaker[AsyncSession]:
    """Build an async session factory bound to ``engine``.

    ``expire_on_commit=False`` keeps ORM-loaded attributes accessible after
    commit, which is the saner default for request-scoped sessions.
    """
    return async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )


__all__ = ["make_engine", "make_session_factory"]
