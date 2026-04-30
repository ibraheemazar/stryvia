"""Structured logging configuration.

We route everything — engine code, FastAPI, Uvicorn, SQLAlchemy — through
``structlog``'s :class:`structlog.stdlib.ProcessorFormatter`, so application
loggers and library loggers emit the same record shape.

Two render modes are supported:

* ``console`` — coloured key/value output for local development.
* ``json`` — one JSON object per line, suitable for log aggregators.
"""

from __future__ import annotations

import logging
import sys
from typing import Any

import structlog

from stryvia_engine.config import Settings


def configure_logging(settings: Settings) -> None:
    """Configure structlog and the stdlib root logger.

    Idempotent — safe to call again from tests after monkeypatching settings.
    """
    log_level = getattr(logging, settings.log_level, logging.INFO)

    shared_processors: list[Any] = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="iso", utc=True),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    structlog.configure(
        processors=[
            *shared_processors,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    if settings.log_format == "json":
        renderer: Any = structlog.processors.JSONRenderer()
    else:
        renderer = structlog.dev.ConsoleRenderer(colors=sys.stdout.isatty())

    formatter = structlog.stdlib.ProcessorFormatter(
        foreign_pre_chain=shared_processors,
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            renderer,
        ],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(log_level)

    # Quiet down libraries that are chatty at INFO.
    logging.getLogger("uvicorn.access").handlers = [handler]
    logging.getLogger("uvicorn.access").propagate = False
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.db_echo else logging.WARNING
    )


def get_logger(name: str | None = None) -> structlog.stdlib.BoundLogger:
    """Return a bound structlog logger."""
    return structlog.stdlib.get_logger(name)


__all__ = ["configure_logging", "get_logger"]
