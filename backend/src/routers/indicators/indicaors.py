
from fastapi import  APIRouter, HTTPException, Path
from starlette import status

from src.services.TimescaleService import TimescaleService

from ...dependencies import user_dependency, db_dependency
from ...models import Users, Indicators

from fastapi import HTTPException
from ...schemas import *

from fastapi.params import Path

timescale_conn = TimescaleService()

router = APIRouter(prefix='/indicators', tags=['indicators'])



class FileRequest(BaseModel):
    period:str
    pair:str


@router.get("", status_code=status.HTTP_200_OK)
def get_indicators(user: user_dependency, db: db_dependency):
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


class IndicatorUpdateRequest:
    id: int
    settings: str
    fk_user_id: int
    fk_strategy_id: int


@router.patch("/{indicator_id}", status_code=status.HTTP_200_OK)
async def update_indicator(
    indicator_id: int,
    indicator_data: IndicatorUpdateRequest,
    user: user_dependency,
    db: db_dependency
):
    # Retrieve the indicator from the database
    indicator = db.query(Indicators).get(indicator_id)
    if not indicator:
        raise HTTPException(status_code=404, detail="Indicator not found")

    indicator.settings = indicator_data.settings
    if indicator_data.pair is not None:
        indicator.pair = indicator_data.pair
    # Add any other fields to update similarly

    try:
        db.commit()
        db.refresh(indicator)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update indicator: {str(e)}",
        )

    return indicator
