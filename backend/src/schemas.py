from enum import Enum
from typing import Any, Dict, Optional, Union, List

from pydantic import BaseModel


class FileTypeEnum(Enum):
    CSV = "csv"
    JSON = "json"


class DataSourceEnum(Enum):
    FILE = "file"
    DATABASE = "database"


class FileSourceRequest(BaseModel):
    fk_file_id: int
    timeperiod: Optional[str]


class DatabaseSourceRequest(BaseModel):
    table: str
    pair: str
    timeperiod: Optional[str]


class StrategyRequest(BaseModel):
    name: str
    description: str
    data_source: Union[FileSourceRequest, DatabaseSourceRequest]


class FileSchema(BaseModel):
    id: int
    path: str
    name: str
    file_type: FileTypeEnum


class StrategySchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    fk_user_id: int
    data_source: Optional[Dict] = None
    model_config = {"from_attributes": True}


class StrategyIndicatorSchema(BaseModel):
    id: int
    name: str
    fk_strategy_id: int
    fk_indicator_id: int
    settings: Dict

class StrategyResponseSchema(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    fk_user_id: int
    indicators: Optional[Any] = None
    data_source: Optional[Any] = None
    model_config = {"from_attributes": True}


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
