"""FastAPI application factory and ASGI entrypoint.

Run locally with::

    uvicorn stryvia_engine.main:app --reload

The module-level ``app`` object exists so ``uvicorn`` and gunicorn-style
process managers can import it directly. Tests that need a fresh app build
should call :func:`create_app` instead, which produces an isolated instance
with its own dependency overrides.
"""

from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from stryvia_engine.api.errors import install_exception_handlers
from stryvia_engine.api.router import api_router
from stryvia_engine.config import Settings, get_settings
from stryvia_engine.db.session import make_engine, make_session_factory
from stryvia_engine.logging_config import configure_logging, get_logger

_logger = get_logger(__name__)


def create_app(settings: Settings | None = None) -> FastAPI:
    """Build and return a fully-wired FastAPI application.

    Passing ``settings`` explicitly is intended for tests; production code
    should pass ``None`` and let :func:`get_settings` resolve the value from
    the environment.
    """
    resolved = settings or get_settings()
    configure_logging(resolved)
    build_timestamp = datetime.now(UTC).isoformat()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        _logger.info(
            "engine_startup",
            service=resolved.service_name,
            version=resolved.service_version,
            environment=resolved.environment,
        )
        engine = make_engine(resolved)
        app.state.settings = resolved
        app.state.engine = engine
        app.state.session_factory = make_session_factory(engine)
        try:
            yield
        finally:
            await engine.dispose()
            _logger.info("engine_shutdown")

    app = FastAPI(
        title=resolved.service_name,
        version=resolved.service_version,
        description="STRYVIA valuation engine — brand-integration valuation API.",
        lifespan=lifespan,
    )

    # State that the dependencies layer reads from is also set here so that
    # request handling works even when the lifespan hasn't run (e.g. tests
    # that instantiate ``TestClient(app)`` without entering it as a context
    # manager). Lifespan will overwrite these with live engine objects.
    app.state.settings = resolved
    app.state.engine = None
    app.state.session_factory = None
    app.state.build_timestamp = build_timestamp

    if resolved.cors_allowed_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=resolved.cors_allowed_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
            expose_headers=["X-Trace-Id"],
        )

    install_exception_handlers(app)
    app.include_router(api_router, prefix=resolved.api_prefix)
    return app


app = create_app()


__all__ = ["app", "create_app"]
