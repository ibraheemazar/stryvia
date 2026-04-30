"""SQLAlchemy declarative base for ORM models.

Domain models defined in subsequent sessions inherit from :class:`Base` so
that Alembic autogenerate can discover them via ``Base.metadata``.
"""

from __future__ import annotations

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Project-wide declarative base.

    Subclassing :class:`sqlalchemy.orm.DeclarativeBase` (the SQLAlchemy 2.x
    typed declarative API) gives every model a typed ``Mapped[...]`` API and
    a shared :attr:`metadata` registry.
    """


__all__ = ["Base"]
