from pathlib import Path
from typing import Any, Dict, List
import pandas as pd
import pandas_ta as ta
import json
from pathlib import Path
from ...schemas import IndicatorSetting
from ...indicators import *

class IndicatorLoader:
    def __init__(self, df: pd.DataFrame, indicators: List[IndicatorSetting]):
        self.df = df
        self.indicators = indicators
        self.timeframe = ""
        self.columns = []
        self.response = {}
        self.pickle_dir = Path.cwd() / "files" / "pickled_strategies"

    def save_pickle(self, file_name: str):
        file_path = self.pickle_dir / file_name

        self.df.to_pickle(file_path)
        print(f"DataFrame saved to {file_path}")


    def load_indicators(self):

        self.df.ta.log_return(cumulative=True, append=True)
        self.df.ta.percent_return(cumulative=True, append=True)


        if len(self.indicators) > 0:
            Strategy = ta.Strategy(
                name="indicators",
            ta=self.indicators
            )

            self.df.ta.strategy(Strategy)

        # Remove all the rows that contains NaN after the indicator generation
        self.df.dropna(inplace=True)

    def split_dataframe(self):
        """
        Create JSON strings to store dataframes of each indicator. column name and trading pair
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

    def connect_indicator_info(self, indicators_info:List[Any]) -> Dict:
        """
        Connect auto generated column names with a chart style, id and column name in the dataframe

        Indicators column names are generated based on their length, so indicators with same lenght will not be saved
        Example: { RSI_14 : { "indicator_info": line, "id": 1,"df_column:": RSI_14} ... }
        """
        matched_styles = {}

        for column in self.columns:
            base_column = column.split('_')[0].lower()
            for obj in indicators_info:
                if base_column == obj['kind'].lower():
                    matched_styles[column] = { "indicator_info": obj['indicator_info'], "id": obj['id']}
        matched_styles_dict = matched_styles

        self.response['indicator_info'] = json.dumps(matched_styles)
        return matched_styles_dict


    def get_data(self):
        return self.df
