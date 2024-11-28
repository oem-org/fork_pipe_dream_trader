from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status

from src.services.TimescaleService import TimescaleService

from ...dependencies import user_dependency
from ...models import Users

from ...schemas import *
TimescaleService


router = APIRouter(prefix='/chart', tags=['chart'])


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency):
    return db.query(Strategies).filter(Strategies.fk_user_id == user.get('id')).all()

