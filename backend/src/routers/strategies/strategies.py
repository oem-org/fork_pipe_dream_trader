from fastapi import APIRouter, Depends, Path, HTTPException,Query
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from starlette import status

from ...dependencies import db_dependency, user_dependency
from ...exceptions import AuthenticationFailed, StrategyNotFound
from ...models import Strategies, StrategyIndicators

print(user_dependency)
router = APIRouter(prefix="/strategy", tags=['strategy'])


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class StrategyRequest(BaseModel):
    # model_config allows for assigning directly to the ORM model without type errors
    # model_config = ConfigDict(from_attributes=True)
    title: str = Field(min_length=1)
    description: str = Field(min_length=1, max_length=10000)

# @router.get("/", status_code=status.HTTP_200_OK)
# async def read_all(er_dependency, db: db_dependency):
#     # if user is None:
#     #     raise AutheticationFailed()
#     return db.query(Strategies).filter(Strategies.fk_user_id == user.get('id')).all()
#


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_strategy(
    user: user_dependency,
    db: db_dependency,
    strategy_request: StrategyRequest,
):
    print(strategy_request)
    try:
        # Create strategy model instance
        strategy_model = Strategies(
            **strategy_request.model_dump(), fk_user_id=user.get('id')
        )
        
        # Add to database
        db.add(strategy_model)
        db.commit()
        db.refresh(strategy_model)  # Refresh to include autogenerated fields like id
        
        return strategy_model

    except Exception as e:
        db.rollback()  # Rollback any changes on failure
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create strategy: {str(e)}",
        )



@router.get("", status_code=status.HTTP_200_OK)
async def read_all(user: user_dependency, db: db_dependency):
    # if user is None:
    #     raise AutheticationFailed()
    try:
        print(user)

        return db.query(Strategies).filter(Strategies.fk_user_id == user.get('id')).all()

    except Exception as e:
        db.rollback()  # Rollback any changes on failure
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create strategy: {str(e)}",
        )

@router.get("/{strategy_id}", status_code=status.HTTP_200_OK)
async def read_strategy(
    user: user_dependency, db: db_dependency, strategy_id: int = Path(gt=0)
):
    # if user is None:
    #     raise AutheticationFailed()

    strategy_model = (
        db.query(Strategies)
        .filter(Strategies.id == strategy_id)
        .filter(Strategies.fk_user_id == user.get('id'))
        .first()
    )
    if strategy_model is not None:
        return strategy_model
    # raise StrategyNotFound()
    raise StrategyNotFound()



@router.put("/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_strategy(
    user: user_dependency,
    db: db_dependency,
    strategy_request: StrategyRequest,
    strategy_id: int = Path(gt=0),
):
    # Query for the Strategy item to be updated
    strategy_model = (
        db.query(Strategies)
        .filter(Strategies.id == strategy_id)
        .filter(Strategies.fk_user_id == user.get('id'))
        .first()
    )
    if strategy_model is None:
        raise StrategyNotFound()

    # Serialize RequestModel into a dict
    data = strategy_request.model_dump()

    for key, value in data.items():
        setattr(strategy_model, key, value)

    db.commit()


class IndicatorRequest:
    settings: dict
    fk_strategy_id: int
    fk_indicator_id: int

@router.put("/{strategy_id}/indicator/{indicator_id}", status_code=status.HTTP_200_OK)
async def update_indicator(  
    data: IndicatorRequest,
    user: user_dependency,
    db: db_dependency,
    strategy_id: int = Query(...),
    indicator_id: int = Query(...),
):
    """ update a indicator from StrategyIndicators """
    # Step 1: Retrieve the indicator from the database
    
    indicator = db.query(StrategyIndicators).get(indicator_id)
    strategy = db.query(Strategies).get(strategy_id)
    
    if not strategy.fk_user_id == user['id']: 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Indicator belongs to wrong strategy")
    
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


@router.post("/{strategy_id}/indicator", status_code=status.HTTP_200_OK)
async def add_indicator(
    data: IndicatorRequest,
    user: user_dependency,
    db: db_dependency
):
    """ Post a indicator too StrategyIndicators """
    strategy = db.query(Strategies).get(data.fk_strategy_id)
    
    if not strategy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Strategy not found")
    if strategy.fk_user_id != user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Strategy id dont belong to user"
        )

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
#     strategy_model.title = strategy_request.title
#     strategy_model.description = strategy_request.description
#     strategy_model.priority = strategy_request.priority
#     strategy_model.complete = strategy_request.complete
#
#     db.add(strategy_model)
#     db.commit()


@router.delete("/{strategy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_strategy(
    user: user_dependency, db: db_dependency, strategy_id: int = Path(gt=0)
):
    # if user is None:
    #     raise AutheticationFailed()

    strategy_model = (
        db.query(Strategies)
        .filter(Strategies.id == strategy_id)
        .filter(Strategies.fk_user_id == user.get('id'))
        .first()
    )
    if strategy_model is None:
        raise StrategyNotFound()
    db.query(Strategies).filter(Strategies.id == strategy_id).filter(
        Strategies.fk_user_id == user.get('id')
    ).delete()

    db.commit()
