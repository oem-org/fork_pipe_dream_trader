from pathlib import Path
from typing import Dict, List
import pandas as pd
import pandas_ta as ta

from ...indicators import *

test = Ao(fast=5, slow=34, offset=0)


class IndicatorLoader:
    def __init__(self, df: pd.DataFrame, indicators: List[Dict]):
        self.df = df
        self.indicators = indicators
    


    def load_indicators(self):

        # Indicators = ta.Study(
        #     name="DCSMA10",
        #     ta=[
        #         {"kind": "ohlc4"},
        #         {"kind": "sma", "length": 10},
        #         {"kind": "donchian", "lower_length": 10, "upper_length": 15},
        #         {"kind": "ema", "close": "OHLC4", "length": 10, "suffix": "OHLC4"},
        #     ]
        # )
        # self.df = self.df.ta.study(Indicators)
        self.df.set_index(pd.DatetimeIndex(self.df["time"]), inplace=True)

# Calculate Returns and append to the df DataFrame
        self.df.ta.log_return(cumulative=True, append=True)
        self.df.ta.percent_return(cumulative=True, append=True)

        # New Columns with results
        self.df.columns

        # Take a peek
        self.df.tail()
       
         

        ao_settings = Ao()
        MyStrategy = ta.Strategy(
            name="DCSMA10",
        ta=[
                ao_settings.dict(),
            ]
        )

        # (2) Run the Strategy
        test = self.df.ta.strategy(MyStrategy)
        print(test)
        print(self.df.tail(3))
        print(self.df.columns.tolist())

    def get_data(self):
        return self.df
