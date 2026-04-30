"""Health-check endpoints.

Three probes, deliberately separated:

* ``/health/live`` — liveness. Returns 200 as long as the process can serve
  HTTP. **Must not** depend on external resources, otherwise an outage in a
  downstream service will cause the orchestrator to restart the pod in a
  loop instead of routing traffic away from it.
* ``/health/ready`` — readiness. Returns 200 only when the engine is willing
  to accept traffic — including a live database connection.
* ``/health/version`` — build metadata. Engine version, methodology version,
  and the process's startup timestamp (captured once, not per-request).

The router is mounted under ``Settings.api_prefix``, so the live paths are
``/api/health/{live,ready,version}``.
"""

from __future__ import annotations

from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from stryvia_engine.api.dependencies import get_db_session, get_settings_from_request
from stryvia_engine.config import Settings
from stryvia_engine.core.version import VERSION
from stryvia_engine.db.health import check_database

METHODOLOGY_VERSION = "v0.0.0"

router = APIRouter(prefix="/health", tags=["health"])

SettingsDep = Annotated[Settings, Depends(get_settings_from_request)]
SessionDep = Annotated[AsyncSession, Depends(get_db_session)]


class LiveResponse(BaseModel):
    status: Literal["ok"]
    service: str
    version: str
    environment: str


class ReadyResponse(BaseModel):
    status: Literal["ok", "degraded"]
    service: str
    version: str
    environment: str
    database: Literal["ok", "unavailable"]


class VersionResponse(BaseModel):
    engine_version: str
    methodology_version: str
    build_timestamp: str


@router.get("/live", response_model=LiveResponse, summary="Liveness probe")
async def live(settings: SettingsDep) -> LiveResponse:
    return LiveResponse(
        status="ok",
        service=settings.service_name,
        version=settings.service_version,
        environment=settings.environment,
    )


@router.get(
    "/ready",
    response_model=ReadyResponse,
    summary="Readiness probe",
    responses={503: {"model": ReadyResponse, "description": "Engine not ready"}},
)
async def ready(
    settings: SettingsDep,
    session: SessionDep,
) -> JSONResponse:
    db_ok = await check_database(session)
    body = ReadyResponse(
        status="ok" if db_ok else "degraded",
        service=settings.service_name,
        version=settings.service_version,
        environment=settings.environment,
        database="ok" if db_ok else "unavailable",
    )
    return JSONResponse(
        status_code=status.HTTP_200_OK if db_ok else status.HTTP_503_SERVICE_UNAVAILABLE,
        content=body.model_dump(),
    )


@router.get("/version", response_model=VersionResponse, summary="Build metadata")
async def version(request: Request) -> VersionResponse:
    """Return engine version, methodology version, and process build timestamp.

    ``build_timestamp`` is captured once when the application is constructed
    so callers can correlate behavior with a specific running process; it
    does **not** reflect the current wall clock.
    """
    build_timestamp: str = request.app.state.build_timestamp
    return VersionResponse(
        engine_version=VERSION,
        methodology_version=METHODOLOGY_VERSION,
        build_timestamp=build_timestamp,
    )


__all__ = [
    "METHODOLOGY_VERSION",
    "LiveResponse",
    "ReadyResponse",
    "VersionResponse",
    "router",
]
