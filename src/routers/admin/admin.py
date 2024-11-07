from typing import Annotated
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Path
from starlette import status
from ...models import Strategies
from ...database import SessionLocal
from ...services.auth import AuthenticationService 
from ...exceptions import AuthenticationFailed, StrategyNotFound


auth_service = AuthenticationService.AuthService()

router = APIRouter(
    prefix='/admin',
    tags=['admin']
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(auth_service.get_current_user)]


@router.get("/strategy", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    if user is None or user.get('user_role') != 'admin':
        raise AutheticationFailed()
    return db.query(Strategies).all()


@router.delete("/strategy/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_strategy(user: user_dependency, db: db_dependency, strategy_id: int = Path(gt=0)):
    if user is None or user.get('user_role') != 'admin':
        raise AutheticationFailed()
    strategy_model = db.query(Strategies).filter(Strategies.id == strategy_id).first()
    if strategy_model is None:
        raise StrategyNotFound()
    db.query(Strategies).filter(Strategies.id == strategy_id).delete()
    db.commit()







