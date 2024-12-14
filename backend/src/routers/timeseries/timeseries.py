from logging import exception
from fastapi import APIRouter, Query, HTTPException
from ...lib.data.FileLoader import FileLoader

from ...lib.data.IndicatorLoader import IndicatorLoader
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
    data = {
        "strategy": strategy,
        "timeperiod": timeperiod,
        "table": table,
        "pair": pair
    }


    print(data, "query data")
    try:
        print(strategy)
        strategyModel = db.query(Strategies).filter(Strategies.id == strategy).first()
        

        if strategyModel:
            print(strategyModel.file)

        strategy = (
            db.query(Strategies)
            .filter(Strategies.id == strategy)
            .filter(Strategies.fk_user_id == user['id'])  
            .options(joinedload(Strategies.strategy_indicators).joinedload(StrategyIndicators.indicator))
            .first()
        )
        
        if strategyModel.file:
            path = strategyModel.file.path
            fileLoader = FileLoader(path)
            fileLoader.load_or_reload()
            # print(fileLoader.df)
            all_indicator_settings = [
                ind.settings
                for ind in strategyModel.strategy_indicators
                if ind.settings is not None
            ]
            print(all_indicator_settings)
            indicatorLoader = IndicatorLoader(fileLoader.df, all_indicator_settings)
            
            time_volume = indicatorLoader.df.to_json(orient="index")
            
            indicatorLoader.load_indicators()
            # print(split)
            # Json stucture {timestamp:{data}}
            # indicatorLoader.df = indicatorLoader.df.applymap(str)
            # 
            # json = indicatorLoader.df.to_json(orient="index")
            # split["timeseries"] = json
            json = indicatorLoader.split_dataframe()
            
            json['time_volume'] = time_volume
            return json
    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching the file data")


