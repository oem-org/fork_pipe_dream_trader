from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import SQLAlchemyError
from starlette import status

from ...dependencies import db_dependency
from ...models import Users
from ...schemas import *
from .auth_utils import authenticate_user, create_access_token, hash_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    try:

        model = Users(
            email=create_user_request.email,
            username=create_user_request.username,
            hashed_password=hash_password(create_user_request.password),
        )

        db.add(model)
        db.commit()
        db.refresh(model)

        return {
            "message": "User created successfully",
            "user": {
                "id": model.id,
                "username": model.username,
                "email": model.email,
            },
        }

    except SQLAlchemyError as db_error:
        print(db_error)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving the user to the database.",
        )
    except ValueError as value_error:
        print(value_error)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(value_error),
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later.",
        )


@router.post("/token", response_model=TokenResponse)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):

    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user."
        )

    user = LoginSchema.model_validate(user)

    token = create_access_token(user.username, user.id, timedelta(minutes=140))

    return {
        "access_token": token,
        "token_type": "bearer",
        "id": user.id,
        "username": user.username,
    }
