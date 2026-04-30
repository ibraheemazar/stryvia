"""FastAPI dependency-injection helpers.

The application factory stashes shared resources (settings, async session
factory) on ``app.state`` during startup. These dependencies pull them off
the request so handlers and tests can both override them via
``app.dependency_overrides``.
"""

from __future__ import annotations

from collections.abc import AsyncIterator

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from stryvia_engine.config import Settings


def get_settings_from_request(request: Request) -> Settings:
    """Return the :class:`Settings` attached to the running application."""
    settings: Settings = request.app.state.settings
    return settings


def get_session_factory(request: Request) -> async_sessionmaker[AsyncSession]:
    """Return the process-wide async session factory."""
    factory: async_sessionmaker[AsyncSession] = request.app.state.session_factory
    return factory


async def get_db_session(request: Request) -> AsyncIterator[AsyncSession]:
    """Yield a request-scoped :class:`AsyncSession`, rolled back on exception.

    The session is committed implicitly only when handlers do so themselves;
    on any exception the session is rolled back before being closed, so a
    failed request never leaks half-applied state into the next one.
    """
    factory = get_session_factory(request)
    async with factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


__all__ = [
    "get_db_session",
    "get_session_factory",
    "get_settings_from_request",
]
