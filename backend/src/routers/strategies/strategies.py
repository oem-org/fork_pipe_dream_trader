import logging
from typing import Any, Dict, List, Optional
import json
import pandas as pd
from fastapi import APIRouter, HTTPException, Path
from ...routers.files.FileLoader import FileLoader
from ..strategies.IndicatorLoader import IndicatorLoader
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


class IndicatorRequest(BaseModel):
    settings: dict
    # fk_strategy_id: int
    fk_indicator_id: int


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
    data_source: Optional[Dict[str, Any]] = None

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
            # .options(
            #     load_only(
            #         Strategies.id,
            #         Strategies.name,
            #         Strategies.description,
            #         Strategies.data_source,
            #         Strategies.updated_at,
            #         Strategies.created_at,
            #     )
            # )
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
        logger.error(f"SQLAlchemy error while updating indicator: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update indicator",
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error while updating indicator: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error occurred",
        )


@router.post("/{strategy_id}/condition", status_code=status.HTTP_201_CREATED)
async def add_strategy_condition(
    strategy_id: int,
    condition_data: dict,
    db: db_dependency,
    user: user_dependency,
):
    try:
        print(f"Request received to add strategy condition for strategy_id={strategy_id}")
        print(f"Condition data: {condition_data}")

        fk_strategy_indicator_id_1 = condition_data.get("fk_strategy_indicator_id_1")
        fk_strategy_indicator_id_2 = condition_data.get("fk_strategy_indicator_id_2")
        settings = condition_data.get("settings", {})
        side = condition_data.get("side")  

        print(f"Extracted values: fk_strategy_indicator_id_1={fk_strategy_indicator_id_1}, "
              f"fk_strategy_indicator_id_2={fk_strategy_indicator_id_2}, settings={settings}, side={side}")

        strategy = (
            db.query(Strategies)
            .filter(Strategies.id == strategy_id)
            .filter(Strategies.fk_user_id == user["id"])
            .first()
        )
        print(f"Queried strategy: {strategy}")

        if not strategy:
            print(f"Strategy with id={strategy_id} not found or does not belong to user id={user['id']}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Strategy not found or does not belong to user",
            )

        if side not in ["buy", "sell"]:
            print(f"Invalid 'side' value: {side}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid value for 'side'. Must be 'buy' or 'sell'.",
            )

        strategy_condition = StrategyConditions(
            fk_strategy_id=strategy_id,
            fk_strategy_indicator_id_1=fk_strategy_indicator_id_1,
            fk_strategy_indicator_id_2=fk_strategy_indicator_id_2,
            settings=settings,
            side=side,
        )
        print(f"Created StrategyCondition object: {strategy_condition}")

        db.add(strategy_condition)
        db.commit()
        db.refresh(strategy_condition)
        print(f"StrategyCondition successfully added with id={strategy_condition.id}")

        return {
            "message": "StrategyCondition successfully added",
            "strategy_condition": {
                "id": strategy_condition.id,
                "fk_strategy_id": strategy_condition.fk_strategy_id,
                "fk_strategy_indicator_id_1": strategy_condition.fk_strategy_indicator_id_1,
                "fk_strategy_indicator_id_2": strategy_condition.fk_strategy_indicator_id_2,
                "settings": strategy_condition.settings,
                "side": strategy_condition.side,
            },
        }

    except SQLAlchemyError as e:
        db.rollback()
        print(f"SQLAlchemy error while adding strategy condition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )

    except Exception as e:
        db.rollback()
        print(f"Unexpected error while adding strategy condition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}",
        )



@router.put("/{strategy_id}/condition/{condition_id}", status_code=status.HTTP_200_OK)
async def update_strategy_condition(
    strategy_id: int,
    condition_id: int,
    condition_data: dict,
    db: db_dependency,
    user: user_dependency,
):
    """
    Update a strategy condition by condition_id.
    """
    try:
        print(f"Updating strategy condition with id={condition_id} for strategy_id={strategy_id}")
        print(f"Condition data: {condition_data}")

        # Fetch the strategy condition
        strategy_condition = (
            db.query(StrategyConditions)
            .join(Strategies, StrategyConditions.fk_strategy_id == Strategies.id)
            .filter(
                StrategyConditions.id == condition_id,
                StrategyConditions.fk_strategy_id == strategy_id,
                Strategies.fk_user_id == user["id"],
            )
            .first()
        )
        if not strategy_condition:
            print(f"StrategyCondition with id={condition_id} not found for strategy_id={strategy_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Strategy condition not found or does not belong to user",
            )
        
        for key, value in condition_data.items():
            print(key,value,"updating")
            # setattr(strategy_condition, key, value)

        db.commit()
        db.refresh(strategy_condition)
        print(f"Updated StrategyCondition: {strategy_condition}")

        return {
            "message": "StrategyCondition successfully updated",
            "strategy_condition": {
                "id": strategy_condition.id,
                "fk_strategy_id": strategy_condition.fk_strategy_id,
                "fk_strategy_indicator_id_1": strategy_condition.fk_strategy_indicator_id_1,
                "fk_strategy_indicator_id_2": strategy_condition.fk_strategy_indicator_id_2,
                "settings": strategy_condition.settings,
                "side": strategy_condition.side,
            },
        }

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"SQLAlchemy error while updating strategy condition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update strategy condition",
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error while updating strategy condition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error occurred",
        )




@router.delete("/{strategy_id}/condition/{condition_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_strategy_condition(
    strategy_id: int,
    condition_id: int,
    db: db_dependency,
    user: user_dependency,
):
    """
    Delete a strategy condition by condition_id.
    """
    try:
        print(f"Deleting strategy condition with id={condition_id} for strategy_id={strategy_id}")

        # Fetch and validate the strategy condition
        strategy_condition = (
            db.query(StrategyConditions)
            .join(Strategies, StrategyConditions.fk_strategy_id == Strategies.id)
            .filter(
                StrategyConditions.id == condition_id,
                StrategyConditions.fk_strategy_id == strategy_id,
                Strategies.fk_user_id == user["id"],
            )
            .first()
        )
        if not strategy_condition:
            print(f"StrategyCondition with id={condition_id} not found for strategy_id={strategy_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Strategy condition not found or does not belong to user",
            )

        db.delete(strategy_condition)
        db.commit()
        print(f"Deleted StrategyCondition with id={condition_id}")

        return {"message": "StrategyCondition successfully deleted"}

    except SQLAlchemyError as e:
        db.rollback()
        logger.error(f"SQLAlchemy error while deleting strategy condition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete strategy condition",
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Unexpected error while deleting strategy condition: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error occurred",
        )


#TODO: fix errors codes

@router.get("/{strategy_id}/condition", status_code=status.HTTP_200_OK)
async def get_all_strategy_conditions(
    strategy_id: int,
    db: db_dependency,
    user: user_dependency,
):
    """
    Retrieve all strategy conditions for a given strategy_id.
    """
    try:
        print(f"Fetching all strategy conditions for strategy_id={strategy_id}")

        strategy = (
            db.query(Strategies)
            .filter(Strategies.id == strategy_id, Strategies.fk_user_id == user["id"])
            .first()
        )
        if not strategy:
            print(f"Strategy with id={strategy_id} not found or does not belong to user")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Strategy not found or does not belong to user",
            )

        strategy_conditions = (
            db.query(StrategyConditions)
            .filter(StrategyConditions.fk_strategy_id == strategy_id)
            .all()
        )
        print(f"Fetched {len(strategy_conditions)} StrategyConditions")

        return [
            {
                "id": sc.id,
                "fk_strategy_id": sc.fk_strategy_id,
                "fk_strategy_indicator_id_1": sc.fk_strategy_indicator_id_1,
                "fk_strategy_indicator_id_2": sc.fk_strategy_indicator_id_2,
                "settings": sc.settings,
                "side": sc.side,
            }
            for sc in strategy_conditions
        ]

    except SQLAlchemyError as e:
        logger.error(f"SQLAlchemy error while fetching strategy conditions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch strategy conditions",
        )

    except Exception as e:
        logger.error(f"Unexpected error while fetching strategy conditions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error occurred",
        )




@router.post("/{strategy_id}/backtest", status_code=status.HTTP_200_OK)
async def get_all_strategy_conditions(
    strategy_id: int,
    db: db_dependency,
    user: user_dependency,
    backtest_request: CreateBacktestRequest
):
    try:
        # Fetch the strategy model
        strategyModel = db.query(Strategies).filter(Strategies.id == strategy_id).first()

        if not strategyModel:
            raise HTTPException(status_code=404, detail="Strategy not found")

        if strategyModel.file:
            # Process the file data
            path = strategyModel.file.path
            file_loader = FileLoader(path)
            file_loader.load_data()

            all_indicator_settings = [
                ind.settings
                for ind in strategyModel.strategy_indicators
                if ind.settings is not None
            ]

            indicator_loader = IndicatorLoader(file_loader.df, all_indicator_settings)
            indicator_loader.load_indicators()

        # Parse the stringified arrays
        buy_conditions = json.loads(backtest_request.buy_conditions)
        sell_conditions = json.loads(backtest_request.sell_conditions)
        print(buy_conditions)
        print(sell_conditions)

        
        # buy = {"buy": [["df.SMA_10 < 1"]]}
        # sell = {"sell": [["df.SMA_10 > 1.1"]]}

        buy = {"buy": [["SMA_10 < 1"]]}
        sell = {"sell": [["SMA_10 > 1.1"]]}
        
        # Loop over buy and sell conditions
        buy_results = [f"Processed buy condition: {cond}" for cond in buy_conditions]
        sell_results = [f"Processed sell condition: {cond}" for cond in sell_conditions]

        # Run the backtest
        backtest = Backtester(indicator_loader.df)
        buy_eval_string = backtest.build_conditions("buy", buy_conditions)
        sell_eval_string = backtest.build_conditions("sell", sell_conditions)

        # buy_eval_string = backtest.build_conditions("buy", buy['buy'])
        # sell_eval_string = backtest.build_conditions("sell", sell['sell'])
        result = backtest.run()
        print(result)

        return {
            "buy_results": buy_results,
            "sell_results": sell_results,
            "strategy_id": strategy_id,
            "user": user,
            "backtest_result": result
        }

    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while processing the backtest")





