"""Cross-cutting primitives: version string and shared exception types."""

from stryvia_engine.core.exceptions import (
    ConfigurationError,
    DatabaseUnavailableError,
    StryviaEngineError,
)
from stryvia_engine.core.version import VERSION

__all__ = [
    "VERSION",
    "ConfigurationError",
    "DatabaseUnavailableError",
    "StryviaEngineError",
]
