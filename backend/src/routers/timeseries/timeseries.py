from logging import exception

from fastapi import APIRouter, Query, HTTPException
from ..files.FileLoader import FileLoader

from ...lib.data.IndicatorLoader import IndicatorLoader
from starlette import status

from sqlalchemy.orm import joinedload
from ...dependencies import db_dependency, timescale_dependency, user_dependency
from ...models import Files, Strategies, StrategyIndicators  # Assuming you have a File model
from ...schemas import FileSchema  # Assuming you have a schema for the File
from ...utils.exceptions import handle_db_error, handle_not_found_error


router = APIRouter(prefix='/timeseries', tags=['chart'])


# @router.get("/backtest", status_code=status.HTTP_200_OK)
# async def read_all(
#     user: user_dependency,
#     timescale: timescale_dependency,
#     db: db_dependency,
#     timeperiod: str = Query(None),
#     table: str = Query(None),
#     strategy_query: str = Query(None),
#     pair: str = Query(None)
# ):
#     try:
#         strategyModel = db.query(Strategies).filter(Strategies.id == strategy_query).first()
#
#         if strategyModel:
#             print(strategyModel.file)
#
#         if strategyModel.file:
#             path = strategyModel.file.path
#             fileLoader = FileLoader(path)
#             fileLoader.load_or_reload()
#
#             indicators_info = [{
#                 "indicator_info": si.indicator.indicator_info,
#                 "kind": si.indicator.kind,
#                 "id": si.id} for si in strategyModel.strategy_indicators if si.indicator
#             ]
#
#             all_indicator_settings = [
#                 ind.settings
#                 for ind in strategyModel.strategy_indicators
#                 if ind.settings is not None
#             ]
#
#             indicatorLoader = IndicatorLoader(fileLoader.df, all_indicator_settings)
#             indicatorLoader.load_indicators()
#             indicatorLoader.split_dataframe()
#             indicatorLoader.connect_indicator_info(indicators_info)
#
#             return indicatorLoader.response
#     except Exception as e:
#         handle_db_error(e, "Unexpected error occurred while fetching the file data")
#
#

@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(
    user: user_dependency,
    timescale: timescale_dependency,
    db: db_dependency,
    timeperiod: str = Query(None),
    table: str = Query(None),
    strategy: str = Query(None),
    pair: str = Query(None)
):
    # strategy refers to the id taken from the query string
    try :
        strategyModel = db.query(Strategies).filter(Strategies.id == strategy).first()


        if strategyModel:
            print(strategyModel.file)

        if strategyModel.file:
            path = strategyModel.file.path
            fileLoader = FileLoader(path)
            fileLoader.load_data()
            # print(fileLoader.df)

            indicators_info = [{"indicator_info": si.indicator.indicator_info,
                                "kind": si.indicator.kind,
                                "id": si.id}
                                for si in strategyModel.strategy_indicators if si.indicator]

            all_indicator_settings = [ind.settings
                                    for ind in strategyModel.strategy_indicators
                                    if ind.settings is not None]

            indicatorLoader = IndicatorLoader(fileLoader.df, all_indicator_settings)
            indicatorLoader.load_indicators()
            indicatorLoader.split_dataframe()
            # Connects dataframe column with StrategyIndicator id
            info = indicatorLoader.connect_indicator_info(indicators_info)

            # Key is the name of the database column
            for key, value in info.items():
                print(key)
                print(value['id'])

                strategy_indicator = db.query(StrategyIndicators).filter(StrategyIndicators.id == value['id']).first()
                print(strategy_indicator, "test")
                if strategy_indicator:
                    strategy_indicator.dataframe_column = key
                    db.commit()
                else:
                    print(f"StrategyIndicator with ID {value[id]} not found")

            # indicatorLoader.response['timeframe'] = fileLoader.timeframe

            return indicatorLoader.response
    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching the file data")


