from sqlalchemy.orm import Session
from .services.auth import AuthenticationService
from .database import SessionLocal
from fastapi import Depends
from typing import Annotated, Dict 
from passlib.context import CryptContext

auth_service = AuthenticationService.AuthService()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[Dict, Depends(auth_service.get_current_user)]


def password_verification(password, hashed_password):
    if not bcrypt_context.verify(user_verification.password, user_model.hashed_password):
        raise HTTPException(status_code=401, detail='Error on password change')



def password_hashing()

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
