"""Shared pytest fixtures.

The fixtures here build a fresh FastAPI app per test with a fully overridden
DB session dependency. We never touch a real Postgres — integration tests
that require it will live in a separate suite (Phase 1B+) gated on a
``--db`` CLI flag.
"""

from __future__ import annotations

from collections.abc import AsyncIterator, Iterator
from typing import Any
from unittest.mock import AsyncMock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from stryvia_engine.api.dependencies import get_db_session
from stryvia_engine.config import Settings, get_settings
from stryvia_engine.main import create_app


@pytest.fixture
def settings() -> Settings:
    """Test-mode settings that don't depend on a real database."""
    return Settings(
        environment="test",
        log_level="WARNING",
        log_format="console",
        database_url="postgresql+psycopg://test:test@localhost:5432/test",
        db_echo=False,
    )


@pytest.fixture
def app(settings: Settings) -> FastAPI:
    """Build a fresh FastAPI app for each test."""
    # Reset the cached settings so create_app() doesn't pick up a stale instance
    # from a previous test's environment.
    get_settings.cache_clear()
    return create_app(settings=settings)


@pytest.fixture
def db_session_mock() -> AsyncMock:
    """A stand-in :class:`AsyncSession` whose methods are awaitable mocks."""
    return AsyncMock()


@pytest.fixture
def healthy_db(app: FastAPI, db_session_mock: AsyncMock) -> AsyncMock:
    """Override ``get_db_session`` so ``check_database`` returns ``True``."""
    result = AsyncMock()
    result.scalar = lambda: 1
    db_session_mock.execute.return_value = result

    async def _override() -> AsyncIterator[Any]:
        yield db_session_mock

    app.dependency_overrides[get_db_session] = _override
    return db_session_mock


@pytest.fixture
def unhealthy_db(app: FastAPI, db_session_mock: AsyncMock) -> AsyncMock:
    """Override ``get_db_session`` so ``check_database`` returns ``False``."""
    from sqlalchemy.exc import OperationalError

    db_session_mock.execute.side_effect = OperationalError(
        "SELECT 1", params=None, orig=Exception("connection refused")
    )

    async def _override() -> AsyncIterator[Any]:
        yield db_session_mock

    app.dependency_overrides[get_db_session] = _override
    return db_session_mock


@pytest.fixture
def client(app: FastAPI) -> Iterator[TestClient]:
    """Synchronous TestClient that does **not** trigger the lifespan.

    Skipping the lifespan keeps tests hermetic — no real engine is created,
    so we don't need a Postgres instance running just to exercise route
    wiring. Tests that need DB-state semantics use the ``healthy_db`` /
    ``unhealthy_db`` fixtures to inject a mocked session.
    """
    with TestClient(app, raise_server_exceptions=True) as c:
        # ``with`` would normally trigger startup/shutdown; FastAPI's TestClient
        # only does so on entry/exit. We *do* want it for proper teardown of
        # request scopes. The dependency overrides above bypass the engine
        # creation that lifespan would otherwise perform.
        yield c
