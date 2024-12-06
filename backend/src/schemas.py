from enum import Enum

from pydantic import BaseModel

from pydantic import BaseModel, Field
from typing import Optional, Any, Dict

class StrategySchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    fk_user_id: int
    indicators: Optional[Dict] = None  
    data_source: Optional[Dict] = None  
    model_config = {"from_attributes": True}

class StrategyResponseSchema(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    fk_user_id: int
    indicators: Optional[Any] = None  
    data_source: Optional[Any] = None
    model_config = {"from_attributes": True}

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
