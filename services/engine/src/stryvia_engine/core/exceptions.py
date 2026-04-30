"""Domain-level exceptions raised by engine code.

The HTTP layer (``stryvia_engine.api.errors``) maps these to status codes so
that route handlers can ``raise`` business-meaningful errors without coupling
to FastAPI's ``HTTPException``.
"""


class StryviaEngineError(Exception):
    """Base class for every error raised by engine application code."""


class ConfigurationError(StryviaEngineError):
    """Raised when configuration is missing or internally inconsistent."""


class DatabaseUnavailableError(StryviaEngineError):
    """Raised when the database cannot be reached or returns an unhealthy probe."""


__all__ = [
    "ConfigurationError",
    "DatabaseUnavailableError",
    "StryviaEngineError",
]
