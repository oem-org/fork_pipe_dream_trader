from Conditions import Conditions
import numpy as np
import pandas as pd
#
#https://github.com/JeppeOEM/CryptoPlatform/blob/main/main_app/trading_engine/Backtest.py
class Backtester:

    def run(self, df):
        
        contains_nan = df.isna().any().any()
        if contains_nan:
            raise Exception("dataframe contains a NaN")
        
        print("GG")
        print(df)
        buy_signals = df['buy'].values
        sell_signals = df['sell']
        # print(buy_signals[:,0])
        # print("111111111111111111111111111")
        # print(buy_signals[:,1])
        try:
            result_sell = buy_signals[:, 0] == buy_signals[:, 1]
            print(result_sell,"SELLL")
            print(result_sell)
            df['close_trade'] = result_sell
        except:
             df['close_trade'] = buy_signals
        
        print(df)
        # try:
        #     result_buy = df_signal_buy[:, 0] == df_signal_buy[:, 1]
        #     df['open_trade'] = result_buy
        # except:
        #     df['open_trade'] = df_signal_sell
        #
        # df = self.analyse(df)
        # test_cond1 = df.loc[:, 'cond1'].values
        # test_cond2 = df.loc[:, 'cond2'].values
        # test_groups = self.groups_from_conditions(test_cond1, test_cond2)
        # df['groups'] = test_groups
        #
        # # sums the PNL pr trade
        # dfgroup = df.groupby(["groups"], as_index=False)[
        #     "pnl"].sum()
        #
        # dfgroup['cum_pnl'] = dfgroup['pnl'].cumsum()
        # dfgroup["max_cum_pnl"] = dfgroup["cum_pnl"].cummax()
        # dfgroup["drawdown"] = dfgroup["max_cum_pnl"] - dfgroup["cum_pnl"]
        #
        # return dfgroup["pnl"].sum(), dfgroup["drawdown"].max()

    def filter_signals(self, df, column_prefix):
        selected_columns = [
            col for col in df.columns if col.startswith(column_prefix)]
        filtered_df = df[selected_columns]
        return filtered_df

    def analyse(self, df):
        # print(df.head(100))
        df.reset_index(drop=True, inplace=True)
        df.dropna(inplace=True)

        try:
            df['pnl'] = df.close.pct_change()
        except:
            print("EMPTY DATAFRAME ERROR")
            print("Possible uncorrect number of optimization conds")
            print(df.tail(110))
            exit()
        df['cond1'] = np.where(df['open_trade'] == 1, 1, 0)
        df['cond2'] = np.where(df['close_trade'] == 1, 1, 0)
        return df

    def groups_from_conditions(self, cond1, cond2):
        '''
        assign a unique non-NaN integer to each group as defined by the rules
        '''
        n = len(cond1)

        group_idx = -1
        groups = np.zeros(n)

        curr_state = 0  # 0 = not in a group, 1 = in a group
        for n in range(n):
            if curr_state == 0:
                # Currently not in a group
                if cond1[n] == 1:
                    # Detected start of a group. so:
                    # switch the state to 1 ie in a group
                    curr_state = 1
                    # get a new group_idx
                    group_idx = group_idx + 1
                    # assign it to the output for element n
                    groups[n] = group_idx
                else:
                    # no start of the group detected, we are not in a group so mark as NaN
                    groups[n] = np.NaN

            else:
                # current_state == 1 so we are in a group
                if cond2[n] == 1:
                    # detected end of group -- switch state to 0
                    curr_state = 0
                # as we are in a group assign current group_idx. Note that this happens for the element
                # for which cond2[n] == 1 as well, ie this element is included
                groups[n] = group_idx

        return groups



buy = {"buy": [["df.SMA_10 > 1","&","df.close",">","0.01"],"&","~",["df.SMA_10 > 100"]]}
sell = {"sell": [["df.SMA_10 < 0.3","&","df.close",">","0.01"],"|",["df.SMA_10 < 2"]]}

df = pd.read_pickle("pkl.pkl")
bt = Conditions(df)
dfresult = bt.build_conditions("buy", buy['buy'])
dfresult = bt.build_conditions("sell", sell['sell'])
dfconds = bt.get_conditions()
backtester = Backtester()
backtester.run(dfconds)

print(dfresult)

