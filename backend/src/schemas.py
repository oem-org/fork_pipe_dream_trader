from enum import Enum
from typing import Any, Dict, Optional, Union

from pydantic import BaseModel


class FileTypeEnum(Enum):
    CSV = "csv"
    JSON = "json"


class DataSourceEnum(Enum):
    FILE = "file"
    DATABASE = "database"


class FileDataSourceRequest(BaseModel):
    id: int


class DatabaseDataSourceRequest(BaseModel):
    table: str


class StrategyRequest(BaseModel):
    name: str
    description: str
    data_source_type: DataSourceEnum
    data_source: Union[FileDataSourceRequest, DatabaseDataSourceRequest]
    indicators: Optional[Dict[str, Any]] = None


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
    indicators: Optional[Dict] = None
    data_source_type: str
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
