from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status

from ...dependencies import db_dependency
from ...models import Users
from ...schemas import *
from ...services.auth.auth_services import (authenticate_user,
                                            create_access_token, hash_password)

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):

    create_user_model = Users(
        email=create_user_request.email,
        username=create_user_request.username,
        hashed_password=hash_password(create_user_request.password),
        is_active=True,
    )

    db.add(create_user_model)
    db.commit()
    # get autegenrated id
    db.refresh(create_user_model)

    return {
        "id": create_user_model.id,
        "hashed_password": "hashed",
        "email": create_user_model.email,
        "username": create_user_model.username,
        "is_active": create_user_model.is_active,
    }

# response_model vailidates
@router.post("/token", response_model=Token)
# Dependency Injection of the OAuth2PasswordRequestForm
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):

    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user.'
        )
    user = user.dump_model()
    token = create_access_token(
        user.username, user.id, timedelta(minutes=20)
    )

    return {'access_token': token, 'token_type': 'bearer'}
