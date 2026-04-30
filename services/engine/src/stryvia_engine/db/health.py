"""Database connectivity probe.

Used by the readiness endpoint and by future startup self-checks. Cheap
enough to call on every probe (single ``SELECT 1`` round-trip) and never
raises — failures are surfaced as ``False`` and a structured log line.
"""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from stryvia_engine.logging_config import get_logger

_logger = get_logger(__name__)


async def check_database(session: AsyncSession) -> bool:
    """Return ``True`` iff a trivial query succeeds against ``session``."""
    try:
        result = await session.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        _logger.warning("database_health_check_failed", error=str(exc))
        return False

    value = result.scalar()
    if value != 1:
        _logger.warning("database_health_check_unexpected_result", value=value)
        return False
    return True


__all__ = ["check_database"]
