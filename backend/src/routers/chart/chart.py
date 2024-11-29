
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

from src.services.TimescaleService import TimescaleService

from ...dependencies import user_dependency, timescale_dependency
from ...models import Users

from ...schemas import *

timescale_conn = TimescaleService()

router = APIRouter(prefix='/timeseries', tags=['chart'])

@router.post("/", status_code=status.HTTP_200_OK)
async def read_all(
        chart_request: ChartRequest,
        user: user_dependency = Depends(),
        timescale: timescale_dependency = Depends()):
        
        print(timescale, user, chart_request)

@router.get("/", status_code=status.HTTP_200_OK)
async def minmax(chart_request: ChartRequest, user: user_dependency = Depends()):

@router.post("/get-timeperiod", status_code=status.HTTP_200_OK)
async def get_timeperiod_endpoint(
# Include the router in the FastAPI app
app.include_router(router, prefix="/api")
