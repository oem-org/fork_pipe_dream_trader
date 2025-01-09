import logging
from typing import Any, Dict, List, Optional
import json
import pandas as pd
from fastapi import APIRouter, HTTPException, Path
from ...lib.services.FileLoaderService import FileLoader
from .IndicatorLoader import IndicatorLoader
from ...lib.services.BacktesterService import Backtester
from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import load_only
from starlette import status
from sqlalchemy.orm import joinedload

from ...dependencies import db_dependency, user_dependency
from ...models import Strategies, StrategyIndicators
from ...schemas import IndicatorRequest
from ...utils.debugging.print_db_object import print_db_object
from ...utils.exceptions import handle_db_error, handle_not_found_error


router = APIRouter(prefix="/api/strategy", tags=["strategy"])
# TODO: response model
@router.get("/{strategy_id}/indicator", status_code=status.HTTP_200_OK)
async def read_all_strategy_indicators(user: user_dependency, db: db_dependency, strategy_id: int = Path(gt=0)):

    try:
        # Query the strategy with eager loading
        strategy = (
            db.query(Strategies)
            .filter(Strategies.id == strategy_id)
            .filter(Strategies.fk_user_id == user['id'])
            .options(joinedload(Strategies.strategy_indicators).joinedload(StrategyIndicators.indicator))
            .first()
        )

        if not strategy:
            print(f"Strategy with id={strategy_id} not found for user_id={user['id']}")
            handle_not_found_error("Strategy not found")


        indicators = [
            {
                "id": si.id,
                "settings": si.settings,
                "settings_schema": si.indicator.settings_schema,
                "fk_indicator_id": si.indicator.id,
                "name":si.indicator.name,
                "dataframe_column": si.dataframe_column,
            }
            for si in strategy.strategy_indicators
        ]

        return indicators

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")



@router.post("/{strategy_id}/indicator", status_code=200 )
def add_indicator_to_strategy(
    strategy_id: int,
    settings: IndicatorRequest,
    db: db_dependency,
    user: user_dependency,
):
    strategy = db.query(Strategies).filter(Strategies.id == strategy_id).first()
    print(strategy)
    if not strategy:
        raise HTTPException(status_code=404, detail="Strategy not found")
    if strategy.fk_user_id != user["id"]:
         raise HTTPException(
             status_code=status.HTTP_403_FORBIDDEN,
             detail="Strategy id dont belong to user"
         )
    strategy_indicator = StrategyIndicators(
        fk_strategy_id=strategy_id,
        fk_indicator_id=settings.fk_indicator_id,
        settings=settings.settings,
    )
    db.add(strategy_indicator)
    db.commit()
    db.refresh(strategy_indicator)
    return {"message":"success"}

@router.delete("/{strategy_id}/indicator/{indicator_id}")
def remove_indicator_from_strategy(
    strategy_id: int,
    indicator_id: int,
    db: db_dependency,
    user: user_dependency
):
    strategy_indicator = db.query(StrategyIndicators).filter(
        StrategyIndicators.fk_strategy_id == strategy_id,
        StrategyIndicators.id == indicator_id
    ).first()

    if strategy_indicator.strategy.fk_user_id != user["id"]:
         raise HTTPException(
             status_code=status.HTTP_403_FORBIDDEN,
             detail="Strategy id dont belong to user"
         )
    if not strategy_indicator:
        raise HTTPException(status_code=404, detail="Indicator not connected to strategy")

    db.delete(strategy_indicator)
    db.commit()
    return {"message": "Indicator successfully removed from strategy"}




@router.put("/{strategy_id}/indicator/{indicator_id}", status_code=status.HTTP_200_OK)
async def update_indicator_in_strategy(
    strategy_id: int,
    indicator_id: int,
    settings: Dict,
    db: db_dependency,
    user: user_dependency,
):
    """
    Update an indicator within a strategy.
    """
    try:
        strategy_indicator = db.query(StrategyIndicators).join(
            Strategies, StrategyIndicators.fk_strategy_id == Strategies.id
        ).filter(
            StrategyIndicators.fk_strategy_id == strategy_id,
            StrategyIndicators.id == indicator_id,
            Strategies.fk_user_id == user["id"]
        ).first()

        print(indicator_id, strategy_id, settings)

        print_db_object(strategy_indicator)

        if not strategy_indicator:
            raise HTTPException(status_code=404, detail="Indicator not connected to strategy")

        strategy_indicator.settings = settings

        db.commit()
        db.refresh(strategy_indicator)

        return {"message": "Indicator successfully updated", "indicator": strategy_indicator}

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update indicator",
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error occurred",
        )

