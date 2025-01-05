from logging import exception

from fastapi import APIRouter, Query, HTTPException
from ..files.FileLoaderService import FileLoader

from ..strategies.IndicatorLoader import IndicatorLoader
from starlette import status

from sqlalchemy.orm import joinedload
from ...dependencies import db_dependency, timescale_dependency, user_dependency
from ...models import Files, Strategies, StrategyIndicators  # Assuming you have a File model
from ...schemas import FileSchema  # Assuming you have a schema for the File
from ...utils.exceptions import handle_db_error, handle_not_found_error


router = APIRouter(prefix='/timeseries', tags=['chart'])



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
            file_loader = FileLoader(path)
            file_loader.load_data()
            # print(file_loader.df)

            indicators_info = [{"indicator_info": si.indicator.indicator_info,
                                "kind": si.indicator.kind,
                                "id": si.id}
                                for si in strategyModel.strategy_indicators if si.indicator]

            all_indicator_settings = [ind.settings
                                    for ind in strategyModel.strategy_indicators
                                    if ind.settings is not None]

            indicator_loader = IndicatorLoader(file_loader.df, all_indicator_settings)
            indicator_loader.load_indicators()
            indicator_loader.split_dataframe()
            # Connects dataframe column with StrategyIndicator id
            info = indicator_loader.connect_indicator_info(indicators_info)

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
            indicator_loader.response['timeframe'] = f'{file_loader.timeframe}'

            return indicator_loader.response
    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching the file data")


