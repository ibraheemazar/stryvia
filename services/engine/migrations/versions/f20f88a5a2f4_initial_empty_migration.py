"""initial empty migration

Revision ID: f20f88a5a2f4
Revises:
Create Date: 2026-04-29 20:35:07.713361

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "f20f88a5a2f4"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
