import logging
from typing import Any, Dict, List, Optional


from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import load_only
from starlette import status
from sqlalchemy.orm import joinedload  

from ...dependencies import db_dependency, user_dependency
from ...models import Strategies, StrategyIndicators
from ...schemas import  StrategyRequest, StrategySchema
from ...utils.debugging.print_db_object import print_db_object
from ...utils.exceptions import handle_db_error, handle_not_found_error

# Configure logging
logging.basicConfig(
    level=logging.ERROR, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
print(user_dependency)
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
    strategy_request: StrategyRequest,
):
    print(strategy_request.model_dump(),"STRATEGYREQUEST!!!!!!!!!!!!!")
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
        print(user)

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
            .options(
                load_only(
                    Strategies.id,
                    Strategies.name,
                    Strategies.description,
                    Strategies.data_source,
                )
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


@router.put("/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_strategy(
    user: user_dependency,
    db: db_dependency,
    strategy_request: StrategyRequest,
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

        print(f"Strategy found: {strategy}")

        print(f"Strategy indicators: {strategy.strategy_indicators}")

        indicators = [
            {
                "id": si.id,
                "settings": si.settings,
                "settings_schema": si.indicator.settings_schema,
                "fk_indicator_id": si.indicator.id,
            }
            for si in strategy.strategy_indicators
        ]

        # Debug: Print final response

        return indicators

    except Exception as e:
        # Debug: Log the exception details
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
    return {"message":"nenen"}

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
        # Fetch the existing strategy-indicator relationship
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


