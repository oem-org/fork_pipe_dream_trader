# from Conditions import Conditions
# import numpy as np
# import pandas as pd
# #
# #https://github.com/JeppeOEM/CryptoPlatform/blob/main/main_app/trading_engine/Backtest.py
# class Backtester:
#
#     def run(self, df):
#
#         # contains_nan = df.isna().any().any()
#         # if contains_nan:
#         #     raise Exception("dataframe contains a NaN")
#
#         print("GG")
#         print(df)
#         # buy_signals = df['buy'].values
#         # sell_signals = df['sell']
#         # df['open_trade'] = (df['buy'] == 1) & (df['buy'].shift(1) != 1)
#         # df['close_trade'] = (df['buy'] == -1) & (df['buy'].shift(1) != -1)
#         #
#         # df.to_csv('output.tsv', sep='\t', index=False) 
#         #
#         # # print(buy_signals[:,0])
#         # # print("111111111111111111111111111")
#         # # print(buy_signals[:,1])
#         # try:
#         #     result_sell = buy_signals[:, 0] == buy_signals[:, 1]
#         #     print(result_sell,"SELLL")
#         #     print(result_sell)
#         #     df['close_trade'] = result_sell
#         # except:
#         #      df['close_trade'] = buy_signals
#         #
#         # print(df)
#         # try:
#         #     result_buy = df_signal_buy[:, 0] == df_signal_buy[:, 1]
#         #     df['open_trade'] = result_buy
#         # except:
#         #     df['open_trade'] = df_signal_sell
#         #
#         # df = self.analyse(df)
#         # test_cond1 = df.loc[:, 'cond1'].values
#         # test_cond2 = df.loc[:, 'cond2'].values
#         # test_groups = self.groups_from_conditions(test_cond1, test_cond2)
#         # df['groups'] = test_groups
#         #
#         # # sums the PNL pr trade
#         # dfgroup = df.groupby(["groups"], as_index=False)[
#         #     "pnl"].sum()
#         #
#         # dfgroup['cum_pnl'] = dfgroup['pnl'].cumsum()
#         # dfgroup["max_cum_pnl"] = dfgroup["cum_pnl"].cummax()
#         # dfgroup["drawdown"] = dfgroup["max_cum_pnl"] - dfgroup["cum_pnl"]
#         #
#         # return dfgroup["pnl"].sum(), dfgroup["drawdown"].max()
#
#     def filter_signals(self, df, column_prefix):
#         selected_columns = [
#             col for col in df.columns if col.startswith(column_prefix)]
#         filtered_df = df[selected_columns]
#         return filtered_df
#
#
#     def optimize_backtest(self, params, conditions):
#
#         opti_b, opti_s = create_opti_params(params)
#         update(conditions['conds_buy'], opti_b)
#         update(conditions['conds_sell'], opti_s)
#         df = process_conds(df, conditions['conds_buy'], conditions['conds_sell'])
#
#         backtest = Backtest()
#         pnl, drawdown = backtest.run(df)
#         return pnl, drawdown
#
#
#
#
