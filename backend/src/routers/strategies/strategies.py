from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.exc import SQLAlchemyError
from starlette import status

from ...dependencies import db_dependency, user_dependency
from ...models import Strategies
from ...schemas import DataSourceEnum, StrategyRequest, StrategySchema
from ...utils.exceptions import handle_db_error, handle_not_found_error

print(user_dependency)
router = APIRouter(prefix="/strategy", tags=["strategy"])


class IndicatorRequest:
    settings: dict
    fk_strategy_id: int
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
    print(strategy_request)
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


async def read_strategy(
    user: user_dependency, db: db_dependency, strategy_id: int = Path(gt=0)
):
    try:
        # Query strategy with JSON conditions
        strategy_model = (
            db.query(Strategies)
            .filter(Strategies.id == strategy_id)
            .filter(Strategies.fk_user_id == user.get("id"))
            .first()
        )

        if not strategy_model:
            raise Exception(
                f"No strategy found with id {strategy_id} for user {user.get('id')} with valid data_source"
            )

        # Check JSON content and act accordingly
        if strategy_model.data_source_type.get("table"):
            print("Returning strategy based on table")
            model = StrategySchema.model_validate(strategy_model)
            return model
        elif strategy_model.data_source.get("fileid"):
            print("Returning strategy based on fileid")
            model = StrategySchema.model_validate(strategy_model)
            return model
        else:
            print("No valid table or fileid found in data_source")
            model = StrategySchema.model_validate(strategy_model)
            return model

    except SQLAlchemyError as e:
        db.rollback()
        handle_db_error(e, f"SQLAlchemy Failed to get the strategy: {e}")

    except Exception as e:
        db.rollback()
        handle_db_error(e, f"Unexpected error occurred fetching strategy: {e}")


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


# @router.put("/{strategy_id}/indicator/{indicator_id}", status_code=status.HTTP_200_OK)
# async def update_indicator(
#     data: IndicatorRequest,
#     user: user_dependency,
#     db: db_dependency,
#     strategy_id: int = Query(...),
#     indicator_id: int = Query(...),
# ):
#     """ update a indicator from StrategyIndicators """
#     # Step 1: Retrieve the indicator from the database
#
#     indicator = db.query(StrategyIndicators).get(indicator_id)
#     strategy = db.query(Strategies).get(strategy_id)
#
#     if not strategy.fk_user_id == user['id']:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Indicator belongs to wrong strategy")
#
#     indicator.settings = data.settings
#
#     try:
#         db.commit()
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to update indicator: {str(e)}",
#         )
#
#     return indicator


# @router.post("/{strategy_id}/indicator", status_code=status.HTTP_200_OK)
# async def add_indicator(
#     data: IndicatorRequest,
#     user: user_dependency,
#     db: db_dependency
# ):
#     """ Post a indicator too StrategyIndicators """
#     strategy = db.query(Strategies).get(data.fk_strategy_id)
#
#     if not strategy:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
#     if strategy.fk_user_id != user["id"]:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Strategy id dont belong to user"
#         )
#
#     indicator = StrategyIndicators(fk_strategy_id=data.fk_strategy_id,fk_indicator_id=data.fk_indicator_id,settings=data.settings)
#     db.add(indicator)
#     try:
#         db.commit()
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Failed to update indicator: {str(e)}",
#         )
#
#     return indicator

# @routertput("/strategy/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def update_strategy(user: user_dependency, db: db_dependency,
#                       strategy_request: StrategyRequest,
#                       strategy_id: int = Path(gt=0)):
#     # if user is None:
#     #     raise AutheticationFailed()
#
#     strategy_model = db.query(Strategies).filter(Strategies.id == strategy_id)\
#         .filter(Strategies.fk_user_id == user.get('id')).first()
#     if strategy_model is None:
#         raise StrategyNotFound()
#
#     strategy_model.name = strategy_request.name
#     strategy_model.description = strategy_request.description
#     strategy_model.priority = strategy_request.priority
#     strategy_model.complete = strategy_request.complete
#
#     db.add(strategy_model)
#     db.commit()
