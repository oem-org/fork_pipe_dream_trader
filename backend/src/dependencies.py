from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from .database import SessionLocal
from .models import Users
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from .database import SessionLocal
from fastapi import Depends
from typing import Annotated
from .config import Config
from .services.auth.auth_services import get_current_user

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[Session, Depends(get_current_user)]
