from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, Path, status
from fastapi.params import Path
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, query
from starlette import status

from ...dependencies import db_dependency, user_dependency
from ...utils.exceptions import handle_db_error, handle_not_found_error
from ...models import Indicators, Strategies, Users
from ...schemas import *
from ...utils.print_values_db_object import print_db_object

router = APIRouter(prefix="/indicators", tags=["indicators"])


@router.get("", status_code=status.HTTP_200_OK, response_model=List[IndicatorSchema])
def get_indicators(db: db_dependency) -> Any:
    """Return a list of available indicators  to add to a strategy chart."""
    try:
        indicators = db.query(Indicators).all()
        if not indicators:
            handle_not_found_error("No indicators found.")

        # Convert SQLAlchemy objects to Pydantic models for validation
        return [IndicatorSchema.model_validate(indicator) for indicator in indicators]

    except SQLAlchemyError as e:
        handle_db_error(e, "SQLAlchemy Failed to query the database for indicators")

    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching indicators")


@router.get(
    "/{indicator_id}", status_code=status.HTTP_200_OK, response_model=IndicatorSchema
)
async def read_indicator(user: user_dependency, db: db_dependency, indicator_id: int):

    try:
        indicator = db.query(Indicators).get(indicator_id)

        return indicator

    except SQLAlchemyError as e:

        handle_db_error(e, "SQLAlchemy failed feching the indicator")

    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching indicator")
