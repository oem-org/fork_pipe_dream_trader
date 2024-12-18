
import json
from pydantic import BaseModel, Field
from typing import Dict, Any

class Sma(BaseModel):
    """
Help on function sma in module pandas_ta.overlap.sma:

sma(close: pandas.core.series.Series, length: Union[int, numpy.integer] = None, talib: bool = None, offset: Union[int, numpy.integer] = None, **kwargs: Optional[dict]) -> pandas.core.series.Series
    Simple Moving Average (SMA)
    
    The Simple Moving Average is the classic moving average that is the
    equally weighted average over its length.
    
    Sources:
        https://www.tradingtechnologies.com/help/x-study/technical-indicator-definitions/simple-moving-average-sma/
    
    Args:
        close (pd.Series): Series of 'close's
        length (int): It's period. Default: 10
        talib (bool): If TA Lib is installed and talib is True, Returns
            the TA Lib vesmaon. Default: True
        offset (int): How many periods to offset the result. Default: 0
    
    Kwargs:
        adjust (bool): Default: True
        presma (bool, optional): If True, uses SMA for initial value.
        fillna (value, optional): pd.DataFrame.fillna(value)
    
    Returns:
        pd.Series: New feature generated.

    """
    kind: str = Field("sma")
    length: int = Field(10)
    talib: bool = Field(False)
    offset: int = Field(0)

    model_config = {
        'min_anystr_length': 1,
        'anystr_strip_whitespace': True
    }

sma_settings = Sma()

schema = sma_settings.model_json_schema()
serialized_schema = json.dumps(schema)

sma = {
    "kind": "sma",
    "default_settings": sma_settings.dict(),
    "settings_schema": serialized_schema,
    "indicator_info": "line",
}
