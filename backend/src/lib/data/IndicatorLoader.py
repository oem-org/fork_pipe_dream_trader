from pathlib import Path
from typing import Dict, List
import pandas as pd
import pandas_ta as ta
import json
from ...indicators import *

test = Ao(fast=5, slow=34, offset=0)


class IndicatorLoader:
    def __init__(self, df: pd.DataFrame, indicators: List[Dict]):
        self.df = df
        self.indicators = indicators
        # self.columns = []

    # def _column_names(self):
    #
    #     head = self.df.head(100)
    #
    #     ao_settings = Ao()
    #     MyStrategy = ta.Strategy(
    #         name="DCSMA10",
    #         ta=[ao_settings.dict()],
    #     ) 
    #
    #     test = head.ta.strategy(MyStrategy)
    #
    #
    #     new_columns = test.columns.tolist()
    #
    #     print("Columns Before:", self.columns)
    #     print("New Columns :", new_columns)
    #
    #     common_columns = list(set(self.columns) & set(new_columns))
    #
    #     # Print or return the common columns
    #     print("Common Columns:", common_columns)
    #     # Debug: Print the columns before and after
    #     print("Columns Before:", self.columns)
    #     print("New Columns :", test)
    #
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
        # self._column_names()

        self.df.ta.log_return(cumulative=True, append=True)
        self.df.ta.percent_return(cumulative=True, append=True)

        self.df.columns
       
        MyStrategy = ta.Strategy(
            name="indicators",
        ta=self.indicators
        )
        
        self.df.set_index(pd.DatetimeIndex(self.df["time"]), inplace=True)
        # (2) Run the Strategy
        self.df.ta.strategy(MyStrategy)
        # print(test.head(1))
        
        self.columns = self.df.columns.tolist()


    def split_dataframe(self):
        """
        Create dataframes with the same index for each indicator to be loaded by the frontend separately.
        Store them in a dictionary, with the column name as the key, as JSON.
        Also create a combined JSON for specific columns: 'time', 'open', 'high', 'low', 'close'.
        """
        json_dfs = {}

        # Ensure columns exist for the combined OHLC JSON
        required_columns = {"time", "open", "high", "low", "close"}
        if required_columns.issubset(set(self.df.columns)):
            # Create a DataFrame with the required columns
            ohlc_df = self.df[list(required_columns)]
            
            # Convert the combined DataFrame to JSON
            json_dfs["ohlc"] = ohlc_df.to_json(orient="index")

        for col in self.df.columns:
            if col in {"time", "tradecount", "symbol"}:
                continue  # Skip these columns

            # Include the 'time' column and the specific column
            thecol = self.df[["time", col]]

            # Convert the DataFrame to JSON
            col_json = thecol.to_json(orient="index")
            
            # Add the JSON to the dictionary with the column name as the key
            json_dfs[col] = col_json

        # Print all key names in the dictionary
        print("Column Names (Keys):")
        for key in json_dfs.keys():
            print(key)

        return json_dfs

    def get_data(self):
        return self.df
