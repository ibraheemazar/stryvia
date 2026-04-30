"""Mapping from domain exceptions to HTTP responses.

Handlers stay decoupled from FastAPI's ``HTTPException``: they ``raise`` a
:class:`StryviaEngineError` (or a subclass), and the handler installed here
turns it into a JSON response with a stable error envelope.
"""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from stryvia_engine.core.exceptions import (
    ConfigurationError,
    DatabaseUnavailableError,
    StryviaEngineError,
)
from stryvia_engine.logging_config import get_logger

_logger = get_logger(__name__)


def _envelope(code: str, message: str, **extra: Any) -> dict[str, Any]:
    body: dict[str, Any] = {"error": {"code": code, "message": message}}
    if extra:
        body["error"].update(extra)
    return body


def install_exception_handlers(app: FastAPI) -> None:
    """Wire ``StryviaEngineError`` subclasses into the FastAPI app."""

    @app.exception_handler(DatabaseUnavailableError)
    async def _db_unavailable(request: Request, exc: DatabaseUnavailableError) -> JSONResponse:
        _logger.warning("database_unavailable", path=request.url.path, error=str(exc))
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=_envelope("database_unavailable", str(exc) or "database unavailable"),
        )

    @app.exception_handler(ConfigurationError)
    async def _config_error(request: Request, exc: ConfigurationError) -> JSONResponse:
        _logger.error("configuration_error", path=request.url.path, error=str(exc))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_envelope("configuration_error", "internal configuration error"),
        )

    @app.exception_handler(StryviaEngineError)
    async def _engine_error(request: Request, exc: StryviaEngineError) -> JSONResponse:
        _logger.error(
            "engine_error",
            path=request.url.path,
            error_type=type(exc).__name__,
            error=str(exc),
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_envelope("engine_error", "internal engine error"),
        )

    @app.exception_handler(RequestValidationError)
    async def _validation_error(request: Request, exc: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_envelope(
                "validation_error",
                "request validation failed",
                details=jsonable_encoder(exc.errors()),
            ),
        )


__all__ = ["install_exception_handlers"]
