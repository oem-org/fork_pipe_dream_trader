from ast import Raise
import pandas as pd
from pathlib import Path
import numpy as np

# Source: Idea taken from old project
# https://github.com/JeppeOEM/CryptoPlatform/blob/main/main_app/trading_engine/Condition.py

class Conditions:
    """
    Buy and sell signals created with a string expression
    The signals are shifted 1 row forward to not trigger false early signal

    pandas.eval:

    https://pandas.pydata.org/docs/reference/api/pandas.eval.html
    """
    def __init__(self, df):
        self.df = df
        self.buy_df_column = None
        self.sell_df_column = None


    def _build_expression(self, conds: list) -> str:
        expression = ""
        for condition in conds:
            if isinstance(condition, list):
                joined = " ".join(condition)
                expression += f"({joined})"
            if isinstance(condition, str):
                expression += f" {condition} "

        return expression


    # def combine_signals(self, np_array, side):
    #     # open/close
    #     row_all_same = (np_array == np_array[:, 0][:, None]).all(axis=1)
    #     # row_all_same = (np_array == self.df.iloc[:, 0]).all(axis=1)
    #     self.df[f'{side}_signal_combined'] = np.where(row_all_same, -1, 1)
    #     return self.df

    def get_conditions(self) -> pd.DataFrame:
        df = pd.DataFrame()
        df["sell"] = self.sell_df_column
        df['buy'] = self.buy_df_column
        
        return df

    def build_conditions(self, side:str , conditions: list):
        print("Running backtest...")
        expression = self._build_expression(conditions)
        # Print the first row for debugging purposes
        print(self.df.head(1))
        print("Expression:", expression)

        # Make a copy so both sell and buy can shift 1 forward later
        df = self.df.copy()
        print(df)
        try:
            df[f'{side}'] = np.where(
                pd.eval(expression), 1, -1
            )
            print("DDDDDDDDDD",df)
            # Move the rows 1 step forward to not give a false early signal
            # This will trigger a buy or sell on the open of the next price bar
            new_column = df[f'{side}'].shift(1)
            print("new column", new_column)
            new_column = new_column.dropna()
            print(df)
            print(side)
            if side == "buy":
                self.buy_df_column = new_column
            if side == "sell":
                self.sell_df_column = new_column

        except Exception as e:
            print(f"Error evaluating expression: {e}")
            raise Exception("Error creating condtion strings")

# buy = {"buy": [["df.SMA_10 > 1","&","df.close",">","0.01"],"&","~",["df.SMA_10 > 100"]]}
# sell = {"sell": [["df.SMA_10 < 0.3","&","df.close",">","0.01"],"|",["df.SMA_10 < 2"]]}

# df = pd.read_pickle("pkl.pkl")
# bt = Conditions(df)
# dfresult = bt.build_conditions("buy", buy)
# dfresult = bt.build_conditions("sell", sell)
# print(dfresult)
# expressionsell = "df.SMA_10 > 1"
# dfresult = bt.run("sell", "SMA_14", expressionsell)
# print(dfresult)
# Running the backtest

# print(df.dtypes)
#
# #
#
#
#
# dftest = {
#     'A': [1.0, 2.0, 3.0, 4.0],
#     'B': [0.9, 1.9, 2.9, 3.9],
#     'C': [0.8, 1.8, 1.8, 2.8],
#     'D': [0.7, 1.7, 1.7, 1.7],
#     'E': [100.5, 106.0, 102.5, 111.5],
#     'HIGH':[9994.5, 9996.0, 9992.5, 9991.5],
#     'Z':[0, 0, 0, 0],
# }
#
#
# # Create DataFrame
# tdf = pd.DataFrame(dftest)
# # Print the DataFrame
# # print(df)
#
#
# expression = '(tdf.A > tdf.B & tdf.C > tdf.D) & tdf.B < 2' # True
#                                                     # fail
# expression2 = '(tdf.A > tdf.B & tdf.C > tdf.D) & ~(tdf.B == 1.9)' # False
#
# expression3 = '(tdf.A > tdf.B & tdf.C > tdf.D) & ~(tdf.B == 0.9 | tdf.C == 1.8)' # False
#
# expression4 = '(tdf.A > tdf.B & tdf.C > tdf.D) & tdf.B > 0.1' # True
#                                                     # fail
# expression5 = '(tdf.A > tdf.B & tdf.C < tdf.D) & ~(tdf.B < 0.1)' # False
#
# tdf[f'test_test'] = np.where(
#                 pd.eval(expression, ), 1, -1
#             )
#
# tdf[f'test_test2'] = np.where(
#                 pd.eval(expression2, ), 1, -1
#             )
# tdf[f'test_test3'] = np.where(
#                 pd.eval(expression3, ), 1, -1
#             )
# tdf[f'test_test4'] = np.where(
#                 pd.eval(expression4, ), 1, -1
#             )
# tdf[f'test_test5'] = np.where(
#                 pd.eval(expression5, ), 1, -1
#             )
