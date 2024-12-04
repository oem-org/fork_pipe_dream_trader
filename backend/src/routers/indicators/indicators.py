
from fastapi import  APIRouter, HTTPException, Path
from starlette import status

from src.services.TimescaleService import TimescaleService

from ...dependencies import user_dependency, db_dependency
from ...models import Users, Indicators, Strategies

from fastapi import HTTPException
from ...schemas import *

from fastapi.params import Path

timescale_conn = TimescaleService()

router = APIRouter(prefix='/indicators', tags=['indicators'])

@router.get("", status_code=status.HTTP_200_OK)
def get_indicators(user: user_dependency, db: db_dependency):
    """ return a list of available indicator to add to a strategy """
    try:
        return db.query(Indicators).all()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get indicators: {str(e)}",
        )

@router.get("/{indicator_id}", status_code=status.HTTP_200_OK)
async def read_indicator(
        user: user_dependency, db: db_dependency, indicator_id: int):

    indicator = db.query(Indicators).get(indicator_id)
    if not indicator:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return indicator


