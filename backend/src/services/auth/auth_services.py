# JWT Structure
# Possible to extend both headers and payload
# Header{
#  "alg": "HS256",
#  "typ": "JWT"
# }
# {
# {
#  "sub": "1234567890",
#  "name": "John Doe",
#  "role": "Admin"    # make up what ever roles you want
#  "iat": 1516239022
# }
# And a Signature that verifies the token authenticity
# HMACSHA256(
#  base64UrlEncode(header) + "." + base64UrlEncode(payload),
#  "mysecret"
# )


from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer 
from jose import JWTError, jwt
from passlib.context import CryptContext
from starlette import status

from ...config import Config
from ...models import Users
# the client/user must send a username and password fields as form data.
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')


async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    # Decode and validate JWT token
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
        username = payload.get('sub')
        user_id = payload.get('id')
        if not isinstance(username, str) or not isinstance(user_id, int):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Could not validate user.',
            )
        return {'username': username, 'id': user_id}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user.'
        )


def authenticate_user(username: str, password: str, db):
    # Authenticate user credentials
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(
    username: str, user_id: int, expires_delta: timedelta
):
    # Create JWT access token
    encode = {
        'sub': username,
        'id': user_id,
        'iat': datetime.now(timezone.utc),
        'exp': datetime.now(timezone.utc) + expires_delta,
    }
    return jwt.encode(encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt_context.verify(plain_password, hashed_password)


def hash_password(plain_password: str) -> str:
    return bcrypt_context.hash(plain_password)
