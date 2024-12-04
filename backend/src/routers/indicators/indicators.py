from fastapi import APIRouter, HTTPException, Path
from fastapi.params import Path
from starlette import status

from ...dependencies import db_dependency, user_dependency
from ...models import Indicators, Strategy, Users
from ...schemas import *

router = APIRouter(prefix="/indicators", tags=["indicators"])

from typing import List

from fastapi import APIRouter, HTTPException, status
from sqlalchemy.orm import Session

from ...schemas import *


@router.get("", status_code=status.HTTP_200_OK, response_model=List[IndicatorSchema])
def get_indicators(user: user_dependency, db: db_dependency):
    """Return a list of available indicators to add to a strategy"""
    try:
        indicators = db.query(Indicators).all()
        print(indicators)
        return indicators

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get indicators: {str(e)}",
        )


@router.get("/{indicator_id}", status_code=status.HTTP_200_OK)
async def read_indicator(user: user_dependency, db: db_dependency, indicator_id: int):

    indicator = db.query(Indicators).get(indicator_id)
    if not indicator:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return indicator
