from typing import Annotated, Dict

from fastapi import APIRouter, Depends, HTTPException, Path
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from starlette import status

from ...lib.dependencies import db_dependency, user_dependency
from ...models import Users
from ...lib.auth.auth_utils import hash_password, verify_password

router = APIRouter(prefix='/user', tags=['user'])

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length=6)

@router.get('/', status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise AutheticationFailed()
    return db.query(Users).filter(Users.id == user.get('id')).first()

@router.put("/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    user: user_dependency, db: db_dependency, user_verification: UserVerification
):
    if user is None:
        raise AutheticationFailed()
    user_model = db.query(Users).filter(Users.id == user.get('id')).first()

    if not verify_password(user_verification.password, user_model.hashed_password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND1, detail='Error on password change')
    user_model.hashed_password = hash_password(user_verification.new_password)

    db.add(user_model)
    db.commit()
