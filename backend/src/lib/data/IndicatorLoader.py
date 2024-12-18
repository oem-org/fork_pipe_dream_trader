from logging import raiseExceptions
from pathlib import Path
from typing import Dict, List
import pandas as pd
import pandas_ta as ta
import json
from ...indicators import *

import contextlib


file_name = "help_output.txt"

with open(file_name, "w") as file:
    with contextlib.redirect_stdout(file):
        help(ta.ema)
        help(ta.bbands)
        help(ta.kc)

print(f"Help output saved to {file_name}")

class IndicatorLoader:
    def __init__(self, df: pd.DataFrame, indicators: List[Dict]):
        self.df = df
        self.indicators = indicators
        self.columns = []
        self.response = {}

    def load_indicators(self):

        self.df.ta.log_return(cumulative=True, append=True)
        self.df.ta.percent_return(cumulative=True, append=True)

        if len(self.indicators) > 0:
            Strategy = ta.Strategy(
                name="indicators",
            ta=self.indicators
            )

            # self.df.set_index(pd.DatetimeIndex(self.df["time"]), inplace=True)

            self.df.ta.strategy(Strategy)

            # Remove all the empty rows from the start of each column
            self.df.dropna(inplace=True)

    def split_dataframe(self):
        """
        Create JSON strings to store dataframes of each indicator. column name and trading par
        Also creates a combined JSON string for specific columns: 'time', 'open', 'high', 'low', 'close'.
        """
        json_dfs = {}

        required_columns = {"time", "open", "high", "low", "close"}

        if required_columns.issubset(set(self.df.columns)):

            # Grab columns specified in list
            ohlc_df = self.df[list(required_columns)]

            json_dfs["ohlc"] = ohlc_df.to_json(orient="index")

            # Get the curreny pair
            json_dfs["pair"] = json.dumps(self.df['symbol'].iloc[0])

            columns_to_drop = ['high', 'low', 'close', 'open','tradecount','symbol','date','CUMPCTRET_1','CUMLOGRET_1']
            columns_to_drop = [col for col in columns_to_drop if col in self.df.columns]
            self.df = self.df.drop(columns=columns_to_drop)

            json_dfs["columns"] = json.dumps(self.df.columns.tolist())

            self.columns = self.df.columns.tolist()
        for col in self.df.columns:
            if col in {"time"}:
                continue

            # Include the 'time' column and the specific column to store
            thecol = self.df[["time", col]]

            col_json = thecol.to_json(orient="index")

            # Add the JSON to the dictionary with the column name as the key
            json_dfs[col] = col_json

            self.response = json_dfs



    def connect_indicator_info(self, indicators_info):
        """
        Connect auto generated column names with a chart style
        """
        matched_styles = {}

        for column in self.columns:
            base_column = column.split('_')[0].lower()
            for obj in indicators_info:
                if base_column == obj['kind'].lower():
                    matched_styles[column] = { "indicator_info": obj['indicator_info'], "id": obj['id'] }

        self.response['indicator_info'] = json.dumps(matched_styles)



    def get_data(self):
        return self.df
