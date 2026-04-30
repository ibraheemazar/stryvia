"""Tests for the /api/health/* endpoints."""

from __future__ import annotations

from fastapi.testclient import TestClient

from stryvia_engine.api.health import METHODOLOGY_VERSION
from stryvia_engine.core.version import VERSION


def test_live_returns_ok(client: TestClient) -> None:
    response = client.get("/api/health/live")
    assert response.status_code == 200

    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "stryvia-engine"
    assert body["version"] == VERSION
    assert body["environment"] == "test"


def test_live_does_not_require_database(client: TestClient) -> None:
    """The liveness probe must pass even when the DB is misconfigured.

    No ``healthy_db`` / ``unhealthy_db`` fixture is requested here, so the
    real ``get_db_session`` would normally fail at app.state lookup. The
    endpoint must not depend on it.
    """
    response = client.get("/api/health/live")
    assert response.status_code == 200


def test_ready_returns_ok_when_database_healthy(client: TestClient, healthy_db: object) -> None:
    response = client.get("/api/health/ready")
    assert response.status_code == 200

    body = response.json()
    assert body["status"] == "ok"
    assert body["database"] == "ok"
    assert body["service"] == "stryvia-engine"
    assert body["version"] == VERSION


def test_ready_returns_503_when_database_unhealthy(
    client: TestClient, unhealthy_db: object
) -> None:
    response = client.get("/api/health/ready")
    assert response.status_code == 503

    body = response.json()
    assert body["status"] == "degraded"
    assert body["database"] == "unavailable"


def test_version_returns_build_metadata(client: TestClient) -> None:
    response = client.get("/api/health/version")
    assert response.status_code == 200

    body = response.json()
    assert body["engine_version"] == VERSION
    assert body["methodology_version"] == METHODOLOGY_VERSION
    # build_timestamp is generated once at app construction. Just sanity-check
    # the shape — a parseable ISO-8601 string with a timezone offset.
    assert isinstance(body["build_timestamp"], str)
    assert "T" in body["build_timestamp"]


def test_version_timestamp_is_stable_across_requests(client: TestClient) -> None:
    """Two calls must return the *same* timestamp — it's set at startup, not per-request."""
    first = client.get("/api/health/version").json()["build_timestamp"]
    second = client.get("/api/health/version").json()["build_timestamp"]
    assert first == second


def test_openapi_schema_includes_health_routes(client: TestClient) -> None:
    response = client.get("/openapi.json")
    assert response.status_code == 200

    paths = response.json()["paths"]
    assert "/api/health/live" in paths
    assert "/api/health/ready" in paths
    assert "/api/health/version" in paths
