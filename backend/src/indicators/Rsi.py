import json
from pydantic import BaseModel, Field
from typing import Dict, Any


class Rsi(BaseModel):
    """Relative Strength Index (RSI)

        The Relative Strength Index is popular momentum oscillator used to measure the
        velocity as well as the magnitude of directional price movements.

        Sources:
            https://www.tradingview.com/wiki/Relative_Strength_Index_(RSI)

        Calculation:
            Default Inputs:
                length=14, scalar=100, drift=1
            ABS = Absolute Value
            RMA = Rolling Moving Average

            diff = close.diff(drift)
            positive = diff if diff > 0 else 0
            negative = diff if diff < 0 else 0

            pos_avg = RMA(positive, length)
            neg_avg = ABS(RMA(negative, length))

            RSI = scalar * pos_avg / (pos_avg + neg_avg)

        Args:
            close (pd.Series): Series of 'close's
            length (int): It's period. Default: 14
            scalar (float): How much to magnify. Default: 100
            talib (bool): If TA Lib is installed and talib is True, Returns the TA Lib
                version. Default: True
            drift (int): The difference period. Default: 1
            offset (int): How many periods to offset the result. Default: 0

        Kwargs:
            fillna (value, optional): pd.DataFrame.fillna(value)
            fill_method (value, optional): Type of fill method

        Returns:
            pd.Series: New feature generated.
        """
    kind: str = Field("rsi")
    length: int = Field(14)
    scalar: float = Field(100)
    talib: bool = Field(False)
    drift: int = Field(1)
    offset: int = Field(0)

    model_config = {
        'min_anystr_length': 1,
        'anystr_strip_whitespace': True
    }

rsi_settings = Rsi()

schema = rsi_settings.model_json_schema()
serialized_schema = json.dumps(schema)

rsi = {
    "kind": "rsi",
    "default_settings": rsi_settings.dict(),
    "settings_schema": serialized_schema,
    "indicator_info": "line_add_pane",
}

