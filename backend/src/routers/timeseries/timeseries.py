from fastapi import APIRouter, Query, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from ...dependencies import db_dependency, timescale_dependency, user_dependency
from ...models import Files  # Assuming you have a File model
from ...schemas import FileSchema  # Assuming you have a schema for the File
from ...utils.exceptions import handle_not_found_error


router = APIRouter(prefix='/timeseries', tags=['chart'])

@router.get("/", status_code=status.HTTP_200_OK)
async def read_all(
    user: user_dependency, 
    timescale: timescale_dependency,
    db: db_dependency,
    fileId: str = Query(None),  
    timeperiod: str = Query(None), 
    table: str = Query(None),
    pair: str = Query(None)  
):
    data = {
        "fileId": fileId,
        "timeperiod": timeperiod,
        "table": table,
        "pair": pair
    }

        
    if fileId:
        file_model = db.get(Files, fileId)  

        if not file_model:
            handle_not_found_error("File was not found") 
        
        print(file_model.path) 



    elif pair:
        print("")
    return data
