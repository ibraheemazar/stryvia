"""Application configuration backed by environment variables.

Loaded once per process via :func:`get_settings`. The ``Settings`` class is
the only place env vars are read — every other module accepts a ``Settings``
instance (or a more specific value derived from it) so configuration stays
testable.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

from stryvia_engine.core.version import VERSION

Environment = Literal["development", "test", "production"]
LogFormat = Literal["console", "json"]


class Settings(BaseSettings):
    """Strongly-typed view of the runtime environment.

    Field names map to upper-case env vars (e.g. ``database_url`` ↔
    ``DATABASE_URL``). Values are read from ``services/engine/.env`` if
    present, then overridden by the real process environment.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Runtime ----------------------------------------------------------------
    environment: Environment = "development"
    log_level: str = "INFO"
    log_format: LogFormat = "console"

    host: str = "127.0.0.1"
    port: int = 8000

    service_name: str = "stryvia-engine"
    service_version: str = VERSION
    api_prefix: str = "/api"

    # CORS -------------------------------------------------------------------
    # Browser origins allowed to call the engine. Supplied in env as a
    # comma-separated string (e.g. ``http://localhost:3001,http://localhost:3002``).
    # Server-to-server callers don't need to be listed — CORS is a browser-only
    # mechanism.
    cors_allowed_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: ["http://localhost:3001", "http://localhost:3002"],
    )

    # Database ---------------------------------------------------------------
    # Async psycopg 3 URL, e.g.
    #   postgresql+psycopg://stryvia:<password>@localhost:5432/stryvia_dev
    database_url: str = Field(
        default="postgresql+psycopg://stryvia:stryvia@localhost:5432/stryvia_dev",
    )
    db_echo: bool = False
    db_pool_size: int = 5
    db_max_overflow: int = 10

    # AI providers -----------------------------------------------------------
    # Anthropic API key. Optional in development/test (Phase 1A makes no
    # outbound AI calls); required in production starting Phase 1B. The
    # central client lives in ``stryvia_engine.core.anthropic_client``.
    anthropic_api_key: str | None = None

    @field_validator("log_level")
    @classmethod
    def _normalise_log_level(cls, value: str) -> str:
        normalised = value.strip().upper()
        allowed = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        if normalised not in allowed:
            raise ValueError(f"LOG_LEVEL must be one of {sorted(allowed)}, got {value!r}")
        return normalised

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def _split_cors_origins(cls, value: object) -> object:
        # pydantic-settings treats unannotated env strings as JSON for list
        # fields. Accept the more ergonomic comma-separated form too.
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @model_validator(mode="after")
    def _require_anthropic_key_in_production(self) -> Settings:
        if self.environment == "production" and not self.anthropic_api_key:
            raise ValueError(
                "ANTHROPIC_API_KEY must be set when ENVIRONMENT=production",
            )
        return self

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def is_test(self) -> bool:
        return self.environment == "test"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide settings, instantiated lazily and cached.

    Tests that need a fresh load can call ``get_settings.cache_clear()``.
    """
    return Settings()


__all__ = ["Environment", "LogFormat", "Settings", "get_settings"]
