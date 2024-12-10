from pathlib import Path
from typing import Dict, List

import pandas as pd
import pandas_ta

from ...schemas import FileTypeEnum

dummy = [
    {
        "kind": "ao",
        "default_settings": {
            "fast": {"type": "int", "value": 5},
            "slow": {"type": "int", "value": 34},
            "offset": {"type": "int", "value": 0},
        },
    },
    {
        "kind": "rsi",
        "default_settings": {
            "length": {"type": "int", "value": 14},
            "scalar": {"type": "float", "value": 100},
            "talib": {"type": "bool", "value": False},
            "drift": {"type": "int", "value": 1},
            "offset": {"type": "int", "value": 0},
        },
    },
]


class IndicatorLoader:
    def __init__(self, df: pd.DataFrame, indicators: List[Dict]):
        self.df = df
        self.indicators = indicators

    def get_data(self):
        return self.df
