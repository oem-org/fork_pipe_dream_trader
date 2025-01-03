import logging
from typing import Any, Dict, List, Optional
import json
import pandas as pd
from fastapi import APIRouter, HTTPException, Path
from ..files.FileLoader import FileLoader
from .IndicatorLoader import IndicatorLoader
from ...lib.backtesting.Backtester import Backtester
from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import load_only
from starlette import status
from sqlalchemy.orm import joinedload

from ...dependencies import db_dependency, user_dependency
from ...models import Strategies, StrategyIndicators, StrategyConditions
from ...schemas import CreateBacktestRequest, UpdateStrategyRequest, CreateStrategyRequest, StrategySchema
from ...utils.debugging.print_db_object import print_db_object
from ...utils.exceptions import handle_db_error, handle_not_found_error

 # TODO: make it impossible to get same name of indicator bug
# Configure logging
logging.basicConfig(
    level=logging.ERROR, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/strategy", tags=["strategy"])




class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("", status_code=status.HTTP_201_CREATED, response_model=StrategySchema)
async def create_strategy(
    user: user_dependency,
    db: db_dependency,
    strategy_request: CreateStrategyRequest,
):
    try:
        # Create strategy model instance
        strategy_model = Strategies(
            **strategy_request.model_dump(), fk_user_id=user.get("id")
        )

        db.add(strategy_model)
        db.commit()
        db.refresh(strategy_model)

        return strategy_model

    except SQLAlchemyError as e:
        db.rollback()
        handle_db_error(e, "SQLAlchemy Failed to post the strategy")

    except Exception as e:
        db.rollback()
        handle_db_error(e, "Unexpected error occurred while posting stategies")


@router.get("", status_code=status.HTTP_200_OK, response_model=List[StrategySchema])
async def read_all(user: user_dependency, db: db_dependency):
    try:

        return (
            db.query(Strategies).filter(Strategies.fk_user_id == user.get("id")).all()
        )

    except SQLAlchemyError as e:
        db.rollback()
        handle_db_error(e, "SQLAlchemy Failed to get the strategies list")

    except Exception as e:
        db.rollback()
        handle_db_error(e, "Unexpected error occurred fetching stategies")


class StrategyResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    indicators: Optional[dict] = None

    model_config = {"from_attributes": True}


@router.get("/{strategy_id}", status_code=status.HTTP_200_OK)
async def read_strategy(
    user: user_dependency, db: db_dependency, strategy_id: int = Path(gt=0)
):
    try:
        strategy_model = (
            db.query(Strategies)
            .filter(Strategies.id == strategy_id)
            .filter(Strategies.fk_user_id == user.get("id"))
            .options(
                joinedload(Strategies.file),
                joinedload(Strategies.strategy_conditions),
                joinedload(Strategies.strategy_indicators),
                joinedload(Strategies.backtests),
            )
            .first()
        )

        if not strategy_model:
            raise HTTPException(
                status_code=404,
                detail=f"No strategy found with id {strategy_id} for user {user.get('id')}",
            )

        return strategy_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{strategy_id}", status_code=status.HTTP_200_OK)
async def update_strategy(
    user: user_dependency,
    db: db_dependency,
    strategy_request: UpdateStrategyRequest,
    strategy_id: int = Path(gt=0),
):
    try:
        strategy_model = (
            db.query(Strategies)
            .filter(Strategies.id == strategy_id)
            .filter(Strategies.fk_user_id == user.get("id"))
            .first()
        )
        if strategy_model is None:
            handle_not_found_error("No strategy found")

        data = strategy_request.model_dump()

        for key, value in data.items():
            setattr(strategy_model, key, value)

        db.commit()
        print("updated strategy", data)
        return data

    except SQLAlchemyError as e:
        db.rollback()
        handle_db_error(e, "SQLAlchemy Failed to get the strategy")

    except Exception as e:
        db.rollback()
        handle_db_error(e, "Unexpected error occurred fetching stategy")


@router.delete("/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_strategy(
    user: user_dependency, db: db_dependency, strategy_id: int = Path(gt=0)
):
    try:
        strategy_model = (
            db.query(Strategies)
            .filter(Strategies.id == strategy_id)
            .filter(Strategies.fk_user_id == user.get("id"))
            .first()
        )
        if strategy_model is None:
            handle_not_found_error("Strategy not found")
        db.query(Strategies).filter(Strategies.id == strategy_id).filter(
            Strategies.fk_user_id == user.get("id")
        ).delete()
        db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        handle_db_error(e, "SQLAlchemy Failed to get the strategy")

    except Exception as e:
        db.rollback()
        handle_db_error(e, "Unexpected error occurred fetching stategy")

