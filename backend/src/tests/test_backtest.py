import numpy as np
import pandas as pd
import pytest

from ..lib.services.BacktesterService import Backtester


@pytest.fixture
def test_data():
    return pd.DataFrame(
        {
            'close': [100, 105, 110, 102, 108, 112],
            'SMA_10': [101, 104, 109, 103, 107, 111],
        }
    )


def test_build_conditions_buy_and(test_data):
    bt = Backtester(test_data)

    buy_conditions = [["SMA_10 < 110"], "&", ["close == 102"]]
    expression = bt.build_conditions("buy", buy_conditions)

    assert expression == "(SMA_10 < 110) & (close == 102)"

    expected_buy = [0, 0, 0, 1, 0, 0]
    assert bt.df['buy'].tolist() == expected_buy


def test_build_conditions_buy(test_data):
    bt = Backtester(test_data)
    buy_conditions = [["SMA_10 < 110"]]
    expression = bt.build_conditions("buy", buy_conditions)

    assert expression == "(SMA_10 < 110)"

    expected_buy = [1, 1, 1, 1, 1, 0]

    assert bt.df['buy'].tolist() == expected_buy


def test_build_conditions_sell(test_data):
    bt = Backtester(test_data)
    sell_conditions = [["SMA_10 > 110"]]
    expression = bt.build_conditions("buy", sell_conditions)

    assert expression == "(SMA_10 > 110)"

    expected_sell = [0, 0, 0, 0, 0, 1]

    assert bt.df['buy'].tolist() == expected_sell


@pytest.fixture
def drawdown_test_data():
    """
    Create a minimal DataFrame for testing max drawdown calculations.
    """
    return pd.DataFrame(
        {
            'close': [100, 120, 90, 110, 95],
            'SMA_10': [95, 110, 100, 105, 98],
        }
    )


# def test_backtest_max_drawdown(drawdown_test_data):
#     """
#     Test the calculation of PnL and max drawdown.
#     """
#     # Buy on index 0 and 2
#     drawdown_test_data['buy'] = [1, 0, 1, 0, 0]
#     # Sell on index 1 and 3
#     drawdown_test_data['sell'] = [0, -1, 0, -1, 0]
#
#     bt = Backtester(drawdown_test_data)
#     pnl, drawdown = bt.run()
#
#     # Trade 1: Buy at 100, Sell at 120 -> (120 / 100 - 1) = 0.20 (20%)
#     # Trade 2: Buy at 90, Sell at 110 -> (110 / 90 - 1) = 0.2222 (22.22%)
#     drawdown_test_data['close_pct_change'] = drawdown_test_data['close'].pct_change()
#     pd.set_option('display.max_rows', None)  # Show all rows
#     pd.set_option('display.max_columns', None)  # Show all columns
#
#     # Now print the entire DataFrame
#     print(drawdown_test_data)
#
#     pd.reset_option('display.max_rows')
#     pd.reset_option('display.max_columns')
#     # Cumulative PnL at each signal point:
#     # Row 1: 0.20 (trade 1 realized)
#     # Row 3: 0.20 + 0.2222 = 0.4222 (trade 2 realized)
#
#     # Drawdown:
#     # - After row 1, price drops from 120 to 90.
#     # - Drawdown = Max Cumulative PnL - Current Cumulative PnL
#     # - Max Cumulative PnL = 0.20 (after trade 1)
#     # - Drawdown at row 2 = 0.20 - ((90 / 100) - 1) = 0.20 - (-0.10) = 0.30 (30%)
#     expected_drawdown = 0.30
#     expected_pnl = 0.4222
#     # Use approx because of Floating point calculations
#     assert pytest.approx(pnl, 0.0001) == expected_pnl
#     assert pytest.approx(drawdown, 0.0001) == expected_drawdown
