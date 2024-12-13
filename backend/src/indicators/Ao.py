from pydantic import BaseModel, Field
from typing import Dict, Any
import json
class Ao(BaseModel):
    """
     Args:
        high (pd.Series): Series of 'high's
        low (pd.Series): Series of 'low's
        fast (int): The short period. Default: 5
        slow (int): The long period. Default: 34
        offset (int): How many periods to offset the result. Default: 0
    """
    fast: int = Field(5)
    slow: int = Field(34)
    offset: int = Field(0)

    model_config = {
        'min_anystr_length': 1,
        'anystr_strip_whitespace': True
    }

ao_settings = Ao()


schema = ao_settings.model_json_schema()
serialized_schema = json.dumps(schema)

ao = {
    "kind": "ao",
    "default_settings": ao_settings.dict(),  
    "settings_schema": serialized_schema, 
    "chart_style": "histogram",
    "description": """Awesome Oscillator (AO)

    The Awesome Oscillator is an indicator used to measure a security's momentum.
    AO is generally used to affirm trends or to anticipate possible reversals.

    Sources:
        https://www.tradingview.com/wiki/Awesome_Oscillator_(AO)
        https://www.ifcm.co.uk/ntx-indicators/awesome-oscillator

    Calculation:
        Default Inputs:
            fast=5, slow=34
        SMA = Simple Moving Average
        median = (high + low) / 2
        AO = SMA(median, fast) - SMA(median, slow)

    Args:
        high (pd.Series): Series of 'high's
        low (pd.Series): Series of 'low's
        fast (int): The short period. Default: 5
        slow (int): The long period. Default: 34
        offset (int): How many periods to offset the result. Default: 0

    Kwargs:
        fillna (value, optional): pd.DataFrame.fillna(value)
        fill_method (value, optional): Type of fill method

    Returns:
        pd.Series: New feature generated.
    """,
}


