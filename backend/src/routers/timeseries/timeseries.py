from fastapi import APIRouter, Query
from sqlalchemy.orm import joinedload
from starlette import status

from ...dependencies import db_dependency, timescale_dependency, user_dependency
from ...lib.services.FileLoaderService import FileLoader
from ...lib.services.IndicatorLoaderService import IndicatorLoaderService
from ...models import Files, Strategies, StrategyIndicators
from ...schemas import FileSchema
from ...utils.exceptions import handle_db_error, handle_not_found_error

router = APIRouter(prefix='/api/timeseries', tags=['chart'])


@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(
    user: user_dependency,
    db: db_dependency,
    timeperiod: str = Query(None),
    strategy: str = Query(None),
    pair: str = Query(None),
):
    # strategy refers to the id taken from the query string
    try:
        strategyModel = db.query(Strategies).filter(Strategies.id == strategy).first()

        if strategyModel:
            print(strategyModel.file)

        if strategyModel.file:
            path = strategyModel.file.path
            file_loader = FileLoader(path)
            file_loader.load_data()

            # Example of indicator info dict
            # [{'indicator_info': 'line_add_pane', 'kind': 'rsi', 'id': 1}]
            indicators_info = [
                {
                    "indicator_info": si.indicator.indicator_info,
                    "kind": si.indicator.kind,
                    "id": si.id,
                }
                for si in strategyModel.strategy_indicators
                if si.indicator
            ]

            # Example of settings dict
            # [{'kind': 'rsi', 'length': 14, 'scalar': 100, 'talib': False, 'drift': 1, 'offset': 0}]
            all_indicator_settings = [
                ind.settings
                for ind in strategyModel.strategy_indicators
                if ind.settings is not None
            ]

            indicator_loader = IndicatorLoaderService(
                file_loader.df, all_indicator_settings
            )
            indicator_loader.load_indicators()
            indicator_loader.split_dataframe()

            # Connects dataframe column with StrategyIndicator id
            info = indicator_loader.connect_indicator_info(indicators_info)

            # Key is the name of the database column
            for key, value in info.items():
                print(key)
                print(value['id'])
                strategy_indicator = (
                    db.query(StrategyIndicators)
                    .filter(StrategyIndicators.id == value['id'])
                    .first()
                )
                if strategy_indicator:
                    strategy_indicator.dataframe_column = key
                    db.commit()
                else:
                    print(f"StrategyIndicator with ID {value[id]} not found")
            indicator_loader.response['timeframe'] = f'{file_loader.timeframe}'
            # Example of of final Response with RSI_14 indicator
            # {
            #     "ohlc": "{\"1692\":{\"time\":1692144000.0,\"open\":0.3029,\"close\":0.2761,\"low\":0.2738,\"high\":0.3034}}",
            #     "pair": "\"POLSBUSD\"",
            #     "columns": "[\"time\",  \"volume\", \"RSI_14\"]",
            #     "volume": "{\"1692\":{\"time\":1692144000.0,\"volume\":44955.08228},\"1692\":{\"time\":1692057600.0,\"volume\":72406.52901}}",
            #     "RSI_14": "{\"1692\":{\"time\":1692144000.0,\"RSI_14\":100.0}}",
            #     "indicator_info": "{\"RSI_14\": {\"indicator_info\": \"line_add_pane\", \"id\": 1}}",
            #     "timeframe": "daily"
            # }
            return indicator_loader.response
    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching the file data")
