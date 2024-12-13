from logging import exception
from fastapi import APIRouter, Query, HTTPException
from ...lib.data.FileLoader import FileLoader

from ...lib.data.IndicatorLoader import IndicatorLoader
from sqlalchemy.orm import Session
from starlette import status

from ...dependencies import db_dependency, timescale_dependency, user_dependency
from ...models import Files  # Assuming you have a File model
from ...schemas import FileSchema  # Assuming you have a schema for the File
from ...utils.exceptions import handle_db_error, handle_not_found_error

dummy = [
    {
        "kind": "ao",
        "default_settings": {
            "fast": {"type": "int", "value": 5},
            "slow": {"type": "int", "value": 34},
            "offset": {"type": "int", "value": 0},
        },
    },
    {
        "kind": "rsi",
        "default_settings": {
            "length": {"type": "int", "value": 14},
            "scalar": {"type": "float", "value": 100},
            "talib": {"type": "bool", "value": False},
            "drift": {"type": "int", "value": 1},
            "offset": {"type": "int", "value": 0},
        },
    },
]

router = APIRouter(prefix='/timeseries', tags=['chart'])

@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(
    user: user_dependency, 
    timescale: timescale_dependency,
    db: db_dependency,
    file: str = Query(None),  
    timeperiod: str = Query(None), 
    table: str = Query(None),
    pair: str = Query(None)  
):
    data = {
        "fileId": file,
        "timeperiod": timeperiod,
        "table": table,
        "pair": pair
    }

    print(data, "query data")
    try:
        fileModel = db.query(Files).get(file)
        # print(file)
        if file:
            path = fileModel.path
            fileLoader = FileLoader(path)
            fileLoader.load_or_reload()
            # print(fileLoader.df)
            indicatorLoader = IndicatorLoader(fileLoader.df, dummy)
            indicatorLoader.load_indicators()
            print(indicatorLoader.df.head())
            print('that json')
            print('that json')
            print('that json')
            print('that json')
            print('that json')
            print('that json')
            print('that json')
            json = indicatorLoader.df.to_json(orient="index")
            print('that json')
            print(json)
            return json
    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching the file data")


