import json

import pandas as pd
from fastapi import APIRouter, HTTPException
from starlette import status

from ...dependencies import db_dependency, user_dependency
from ...lib.backtesting.Backtester import Backtester
from ...models import Strategies, StrategyBacktests
from ...schemas import CreateBacktestRequest

from ...utils.exceptions import handle_db_error
from ..files.FileLoader import FileLoader
from .IndicatorLoader import IndicatorLoader

router = APIRouter(prefix="/strategy", tags=["strategy"])


@router.post("/{strategy_id}/backtest", status_code=status.HTTP_200_OK)
async def backtest(
    strategy_id: int,
    db: db_dependency,
    user: user_dependency,
    backtest_request: CreateBacktestRequest,
):
    try:
        strategyModel = (
            db.query(Strategies).filter(Strategies.id == strategy_id).first()
        )

        if not strategyModel:
            raise HTTPException(status_code=404, detail="Strategy not found")

        if strategyModel.file:
            path = strategyModel.file.path
            file_loader = FileLoader(path)
            file_loader.load_data()

            all_indicator_settings = [
                ind.settings
                for ind in strategyModel.strategy_indicators
                if ind.settings is not None
            ]

            indicator_loader = IndicatorLoader(file_loader.df, all_indicator_settings)
            indicator_loader.load_indicators()

        buy_conditions = json.loads(backtest_request.buy_conditions)
        sell_conditions = json.loads(backtest_request.sell_conditions)

        backtest = Backtester(indicator_loader.df)
        buy_eval_string = backtest.build_conditions("buy", buy_conditions)
        sell_eval_string = backtest.build_conditions("sell", sell_conditions)
        pnl, drawdown = backtest.run()
        
        
        strategy_backtest = StrategyBacktests(
            fk_strategy_id=strategy_id,
            buy_string=buy_eval_string,
            sell_string=sell_eval_string,
            pnl=str(pnl),  
            max_drawdown=str(drawdown),
        )

        db.add(strategy_backtest)
        db.commit()

        return {
            "buy_string": buy_eval_string,
            "sell_string": sell_eval_string,
            "pnl": pnl,
            "drawdown": drawdown,
        }

    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while processing the backtest")
