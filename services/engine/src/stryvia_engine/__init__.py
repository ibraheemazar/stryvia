"""STRYVIA valuation engine.

Top-level package for the FastAPI service that computes brand-integration
valuations. See ``stryvia_engine.main`` for the application factory.
"""

from stryvia_engine.core.version import VERSION

__all__ = ["VERSION"]
