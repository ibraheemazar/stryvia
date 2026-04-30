"""Top-level API router.

Sub-routers register themselves here so that ``main.create_app`` only has to
include a single router object. The whole tree is mounted under
``Settings.api_prefix`` (``/api`` by default), so health endpoints live at
``/api/health/*``; versioned domain endpoints will land under
``/api/v1`` in later sessions.
"""

from __future__ import annotations

from fastapi import APIRouter

from stryvia_engine.api import health

api_router = APIRouter()
api_router.include_router(health.router)


__all__ = ["api_router"]
