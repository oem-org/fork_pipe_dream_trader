
from fastapi import APIRouter, Query
from sqlalchemy.types import Float
from starlette import status

from ...dependencies import db_dependency, timescale_dependency, user_dependency
from ...models import Users
from ...schemas import *

class ChartRequest:
    time: str
    value: str
    volume: str

router = APIRouter(prefix='/timeseries', tags=['chart'])


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(
    user: user_dependency, 
    timescale: timescale_dependency,
    db: db_dependency,
    file: str = Query(None), 
    timeperiod: str = Query(None), 
    table: str = Query(None),
    pair: str = Query(None)
):
    data = {
        "file": file,
        "timeperiod": timeperiod,
        "table": table,
        "pair": pair
    }

    if file:
        pass

    if pair:
        pass
    
    return data  
