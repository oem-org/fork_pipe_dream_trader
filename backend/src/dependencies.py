from typing import Annotated

from fastapi import Depends
# from fastapi.security import OAuth2PasswordBearer
# from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .database import SessionLocal
from .services.auth.auth_services import get_current_user

# bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# tokenUrl is relative to the url of the api, and makes it visible in OpenAPI documentation
# will look for Authorization header, check if the value is Bearer plus has token.
# oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

# SQLAlchemy uses "Connection Pooling"
# With using yield a single session is created per request
# If yield was ommited it woul
#https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/
def get_db():
    db = SessionLocal() 
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[Session, Depends(get_current_user)]

