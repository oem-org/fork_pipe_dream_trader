from enum import Enum
from typing import Any, Dict, Optional, Union, List

from pydantic import BaseModel, Field

class StrategyBacktestResponse(BaseModel):
    id: int
    fk_strategy_id: int
    buy_string: str
    sell_string: str
    pnl: str
    max_drawdown: str
    created_at: str
class MatchedStyle(BaseModel):
    indicator_info: str  
    id: int              

class MatchedStyles(BaseModel):
    styles: Dict[str, MatchedStyle] 

class IndicatorSetting(BaseModel):
    kind: str
    length: int
    # Allowing all other fields to be dynamic
    extra: Dict[str, Any] = Field(default_factory=dict)
    # Allows additional fields outside the specified ones
    class Config:
        extra = "allow"  

class IndicatorInfo(BaseModel):
    indicator_info: str 
    kind: str
    id: int

class BacktestResponse(BaseModel):
    buy_string: str
    sell_string: str
    pnl: float
    drawdown: float

class IndicatorRequest(BaseModel):
    settings: dict
    # fk_strategy_id: int
    fk_indicator_id: int

class TimeFrameEnum(str, Enum):
        M1 = "1m"
        M5 = "5m"
        M15 = "15m"
        M30 = "30m"
        H1 = "1h"
        H4 = "4h"
        H12 = "12h"
        D1 = "1d"

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

class UpdateStrategyRequest(BaseModel):
    id: int
    name: str
    description: str
    fk_file_id: Optional[int]

class CreateStrategyRequest(BaseModel):
    name: str
    description: str
    fk_file_id: Optional[int]

class FileSchema(BaseModel):
    id: int
    path: str
    name: str
    pair: Optional[str]
    file_type: FileTypeEnum


class FileResponse(BaseModel):
    file: FileSchema
    data: str
    columns: List[str]

class FileRequest(BaseModel):
    period: str
    pair: str

class IndicatorSchema(BaseModel):
    id: int
    kind: str
    name: str
    default_settings: Dict
    indicator_info: str
    model_config = {"from_attributes": True}

class StrategySchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    fk_user_id: int
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

class CreateBacktestRequest(BaseModel):
    buy_string: str
    sell_string: str
