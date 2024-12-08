from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from .database.orm_connection import get_db
from .auth.auth_utils import get_current_user
from .database.TimescaleService import TimescaleService, get_timescale_service

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
timescale_dependency = Annotated[TimescaleService, Depends(get_timescale_service)]
