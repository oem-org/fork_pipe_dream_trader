import pandas as pd
from pathlib import Path
import numpy as np


 
testdf = pd.read_pickle("pkl.pkl")

expression = "'close' > 'open'"


class Backtester:
    def __init__(self, df):
        self.df = df
        pass

    def run(self, side, signal_name, expression):
        print("Running backtest...")
        
        self.df[f'{side}_{signal_name}'] = np.where(
            pd.eval(expression, target=self.df), 1, -1
        )
        print(self.df)
        
  # Print the updated DataFrame
bt = Backtester(testdf)
bt.run("sell","RSI_14",expression)




