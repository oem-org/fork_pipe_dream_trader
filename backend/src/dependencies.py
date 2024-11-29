from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from src.services.TimescaleService import TimescaleService, get_timescale_service
from .orm_connection import get_db
from .services.auth.auth_services import get_current_user




db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[Session, Depends(get_current_user)]
timescale_dependency = Annotated[TimescaleService, Depends(get_timescale_service)]
