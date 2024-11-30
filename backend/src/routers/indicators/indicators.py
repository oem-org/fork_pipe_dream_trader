
from fastapi import  APIRouter, HTTPException, Path
from starlette import status

from src.services.TimescaleService import TimescaleService

from ...dependencies import user_dependency, db_dependency
from ...models import Users, Indicators, Strategies, StrategyIndicators

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


class IndicatorRequest:
    settings: dict
    fk_strategy_id: int
    fk_indicator_id: int

@router.patch("/{indicator_id}", status_code=status.HTTP_200_OK)
async def update_indicator(
    indicator_id: int,
    data: IndicatorRequest,
    user: user_dependency,
    db: db_dependency
):
    """ update a indicator from StrategyIndicators """
    # Step 1: Retrieve the indicator from the database
    indicator = db.query(StrategyIndicators).get(indicator_id)
    if not indicator:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Indicator not found")
    
    if not indicator.fk_user_id == user['id']: 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Trying to change other profiles indicator")
    indicator.settings = data.settings
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update indicator: {str(e)}",
        )

    return indicator


async def add_indicator(
    data: IndicatorRequest,
    user: user_dependency,
    db: db_dependency
):
    """ Post a indicator too StrategyIndicators """
    # Validate that the strategy belongs to the user
    strategy = db.query(Strategies).get(data.fk_strategy_id)
    if not strategy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    if strategy.fk_user_id != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to modify this strategy"
        )
    # Unpact the data 
    indicator = StrategyIndicators(fk_strategy_id=data.fk_strategy_id,fk_indicator_id=data.fk_indicator_id,settings=data.settings)
    db.add(indicator)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update indicator: {str(e)}",
        )

    return indicator

