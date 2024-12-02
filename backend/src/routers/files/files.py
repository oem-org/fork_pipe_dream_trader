
from fastapi import UploadFile, APIRouter, Depends, HTTPException, File 
from starlette import status

from src.services.TimescaleService import TimescaleService

from ...dependencies import user_dependency, timescale_dependency, db_dependency
from ...models import Users, FilePath

import shutil
from pathlib import Path
from fastapi import HTTPException
from ...schemas import *
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pathlib import Path

timescale_conn = TimescaleService()

router = APIRouter(prefix='/files', tags=['files'])



class FleRequest(BaseModel):
    period:str
    pair:str


import csv
import json


# Save file route 

def save_file(file, username):
    folder_path = Path(__file__).parent.parent.parent.parent / "uploaded_files" / username
    folder_path.mkdir(parents=True, exist_ok=True)   
    file_path = folder_path / file.filename

    if file_path.exists():
        # send a "Conflict" status code
        raise HTTPException(status_code=409, detail=f"File '{file.filename}' already exists.")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
   
    

    return str(file_path)


@router.get("", status_code=status.HTTP_200_OK)
def get_files(user: user_dependency):
    folder_path = Path(__file__).parent.parent.parent.parent / "uploaded_files" / user['username']

    if not folder_path.exists() or not folder_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No files found for the user."
        )

    file_paths = [str(file) for file in folder_path.glob("**/*") if file.is_file()]
    return {"files": file_paths}

@router.post("/save", status_code=status.HTTP_201_CREATED)
async def save_uploaded_file(user: user_dependency, db: db_dependency, file: UploadFile):
    """
    Receives FormData and saves the file.
    The file input field is used to identify the file.
    FastAPI automatically reads the file and populates UploadFile.
    """
    try:
        print(user)
        saved_file_path = save_file(file, user['username'])
        filename = Path(saved_file_path).name
        saved_file = FilePath(path=saved_file_path, filename=filename)
        db.add(saved_file)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File not saved {e}")
    
    
    return {"file_saved": saved_file_path}
