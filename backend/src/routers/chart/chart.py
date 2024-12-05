
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.types import Float
from starlette import status

from ...dependencies import timescale_dependency, user_dependency
from ...models import Users
from ...schemas import *


class ChartRequest:
    time: str
    value: str
    volume: str

router = APIRouter(prefix='/timeseries', tags=['chart'])

@router.post("/", status_code=status.HTTP_200_OK)
async def read_all(chart_request: ChartRequest, user: user_dependency, timescale: timescale_dependency)
        
        print(timescale, user, chart_request)

