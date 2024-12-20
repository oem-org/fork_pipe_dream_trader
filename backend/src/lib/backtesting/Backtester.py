from ast import Raise
import pandas as pd
from pathlib import Path
import numpy as np

# Source: Idea taken from old project
# https://github.com/JeppeOEM/CryptoPlatform/blob/main/main_app/trading_engine/Condition.py

class Backtester:
    def __init__(self, df):
        self.df = df

    def _build_expression(self, conds: list) -> str:
        expression = ""
        for condition in conds:
            if isinstance(condition, list):
                joined = " ".join(condition)
                expression += f"({joined})"
            if isinstance(condition, str):
                expression += f" {condition} "

        return expression

    def run(self) -> pd.DataFrame:
        """
        Calculate the max drawdown and profit net loss
        
        Signal specifies a trade 
        
        The signals are shifted 1 forward to not trigger false early signal
        Explanation:
        If a condition triggers a trade with daily candlesticks at 11-12/2023 
        then it would only be possible to react when the day ends as the candlestick
        does not exist before.
        """
        self.df['signal'] = self.df['buy'] + self.df['sell']
        
        signal = self.df[self.df['signal'] != 0].copy()
        signal['pnl'] = signal['close'].pct_change() * signal['signal'].shift(1)
        
        signal['cum_pnl'] = signal['pnl'].cumsum()
        
        signal['max_cum_pnl'] = signal['cum_pnl'].cummax()
        print(signal['pnl'].sum())
        
        signal['drawdown'] = signal['max_cum_pnl'] - signal["cum_pnl"]
        
        return signal['pnl'].sum(), signal['drawdown'].max()

    def build_conditions(self, side:str , conditions: list):
        """
        Buy and sell signals created with a string expression in pandas eval function 

        pandas.eval:
        https://pandas.pydata.org/docs/reference/api/pandas.eval.html

        """
        print("Running backtest...")
        expression = self._build_expression(conditions)
        print("Expression:", expression)

        df = self.df.copy()
        print(df)

        # 1 signals open a trade, -1 close a trade, 0 no signal

        try:
            if side == "buy":
                df[f'{side}'] = np.where(
                    pd.eval(expression), 1, 0
                )
            if side == "sell":
                df[f'{side}'] = np.where(
                    pd.eval(expression), -1, 0
                )
            new_column = df[f'{side}']
            if side == "buy":
                self.df['buy'] = new_column
            if side == "sell":
                self.df['sell'] = new_column

        except Exception as e:
            print(f"Error evaluating expression: {e}")
            raise Exception("Error creating condtion strings")



buy = {"buy": [["df.SMA_10 < 1"]]}
sell = {"sell": [["df.SMA_10 > 1.1"]]}

df = pd.read_pickle("pkl.pkl")
bt = Conditions(df)
dfresult = bt.build_conditions("buy", buy['buy'])
dfresult = bt.build_conditions("sell", sell['sell'])
pnl, drawdown = bt.get_conditions()

print(pnl, drawdown)


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
