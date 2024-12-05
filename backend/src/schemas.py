from enum import Enum

from pydantic import BaseModel


class FileTypeEnum(Enum):
    CSV = "csv"
    JSON = "json"


class ChartDataRequest(BaseModel):
    period: str
    pair: str


class ChartDataResponse(BaseModel):
    period: str
    pair: str


class LoginSchema(BaseModel):
    id: int
    username: str
    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    id: int
    username: str


class CreateUserRequest(BaseModel):
    username: str
    email: str
    password: str


class CreateUserResponse(BaseModel):
    id: int
    email: str
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str
