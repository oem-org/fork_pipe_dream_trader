"""text

Revision ID: 69b19af7f216
Revises:
Create Date: 2024-11-11 16:57:13.326642

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69b19af7f216'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('strategies', sa.Column('indicators2', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('strategies', 'indicators2')
