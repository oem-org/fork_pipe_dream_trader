import json
from typing import List

import pandas as pd
from fastapi import APIRouter, HTTPException
from starlette import status

from ...dependencies import db_dependency, user_dependency
from ...lib.services.BacktesterService import Backtester
from ...lib.services.FileLoaderService import FileLoader
from ...lib.services.IndicatorLoaderService import IndicatorLoaderService
from ...models import Strategies, StrategyBacktests
from ...schemas import CreateBacktestRequest, StrategyBacktestResponse
from ...utils.exceptions import handle_db_error

router = APIRouter(prefix="/api/strategy", tags=["strategy"])


@router.post(
    "/{strategy_id}/backtest",
    response_model=StrategyBacktestResponse,
    status_code=status.HTTP_200_OK,
)
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

            indicator_loader = IndicatorLoaderService(
                file_loader.df, all_indicator_settings
            )
            indicator_loader.load_indicators()

        buy_conditions = json.loads(backtest_request.buy_string)
        sell_conditions = json.loads(backtest_request.sell_string)

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

        # Return the backtest as a StrategyBacktestResponse
        return StrategyBacktestResponse(
            id=strategy_backtest.id,
            fk_strategy_id=strategy_backtest.fk_strategy_id,
            buy_string=strategy_backtest.buy_string,
            sell_string=strategy_backtest.sell_string,
            pnl=str(strategy_backtest.pnl),
            max_drawdown=str(strategy_backtest.max_drawdown),
            created_at=str(strategy_backtest.created_at),
        )

    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while processing the backtest")


@router.get(
    "/{strategy_id}/backtest",
    response_model=List[StrategyBacktestResponse],
    status_code=status.HTTP_200_OK,
)
async def get_backtests_by_strategy(
    strategy_id: int, user: user_dependency, db: db_dependency
):
    try:
        # Query backtests for the specific strategy_id from the database
        backtests = (
            db.query(StrategyBacktests)
            .filter(StrategyBacktests.fk_strategy_id == strategy_id)
            .all()
        )

        if not backtests:
            raise HTTPException(
                status_code=404,
                detail=f"No backtests found for strategy_id {strategy_id}",
            )

        # Transform to response schema if needed
        return [
            StrategyBacktestResponse(
                id=backtest.id,
                fk_strategy_id=backtest.fk_strategy_id,
                buy_string=backtest.buy_string,
                sell_string=backtest.sell_string,
                pnl=str(backtest.pnl),
                max_drawdown=str(backtest.max_drawdown),
                create_at=str(backtest.created_at),
            )
            for backtest in backtests
        ]
    except Exception as e:
        handle_db_error(
            e,
            f"Unexpected error occurred while retrieving backtests for strategy_id {strategy_id}",
        )


@router.get(
    "/{strategy_id}/backtest/latest",
    response_model=StrategyBacktestResponse,
    status_code=status.HTTP_200_OK,
)
async def get_latest_backtest(
    strategy_id: int, user: user_dependency, db: db_dependency
):
    try:
        latest_backtest = (
            db.query(StrategyBacktests)
            .filter(StrategyBacktests.fk_strategy_id == strategy_id)
            .order_by(StrategyBacktests.created_at.desc())
            .first()
        )

        if not latest_backtest:
            raise HTTPException(
                status_code=404,
                detail=f"No backtests found for strategy_id {strategy_id}",
            )

        return StrategyBacktestResponse(
            id=latest_backtest.id,
            fk_strategy_id=latest_backtest.fk_strategy_id,
            buy_string=latest_backtest.buy_string,
            sell_string=latest_backtest.sell_string,
            pnl=str(latest_backtest.pnl),
            max_drawdown=str(latest_backtest.max_drawdown),
            created_at=str(latest_backtest.created_at),
        )

    except Exception as e:
        handle_db_error(
            e,
            f"Unexpected error occurred while retrieving the latest backtest for strategy_id {strategy_id}",
        )
