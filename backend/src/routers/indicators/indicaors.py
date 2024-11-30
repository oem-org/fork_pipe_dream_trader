
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



class FleRequest(BaseModel):
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
    user: user_dependency, db: db_dependency, indicator_id: int = Path(gt=0)
):

    indicator_model = db.query(Indicators).get(indicator_id)
    if not indicator_model:
        raise HTTPException(status_code=404, detail="Indicator not found")
    return indicator_model
