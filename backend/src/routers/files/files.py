import shutil
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.exc import SQLAlchemyError
from starlette import status

from ...dependencies import db_dependency, user_dependency
from ...exceptions import handle_db_error, handle_not_found_error
from ...models import Files, Users
from ...schemas import *

router = APIRouter(prefix="/files", tags=["files"])


class FileRequest(BaseModel):
    period: str
    pair: str


class FileSchema(BaseModel):

    filename: str
    file_type: str
    path: str


@router.get("", status_code=status.HTTP_200_OK, response_model=list[FileSchema])
def get_all_files(user: user_dependency, db: db_dependency):
    try:
        files = db.query(Files).all()
        if not files:
            handle_not_found_error("No files found.")

        return [FileSchema.model_validate(file) for file in files]

    except SQLAlchemyError as e:

        handle_db_error(e, "SQLAlchemy failed feching the file paths")

    except Exception as e:

        handle_db_error(e, "Unexpected error occurred while fetching the file paths")


@router.get("/{file_id}", status_code=status.HTTP_200_OK)
def get_files(user: user_dependency, db: db_dependency, file_id: int):
    try:
        indicator = db.query(Files).get(file_id)

        return indicator

    except SQLAlchemyError as e:

        handle_db_error(e, "SQLAlchemy failed feching the file path")

    except Exception as e:
        handle_db_error(e, "Unexpected error occurred while fetching the file path")


# Save file route
def save_file(file):
    folder_path = Path(__file__).parent.parent.parent.parent / "uploaded_files"
    folder_path.mkdir(parents=True, exist_ok=True)
    file_path = folder_path / file.filename

    if file_path.exists():
        # send a "Conflict" status code
        raise HTTPException(
            status_code=409, detail=f"File '{file.filename}' already exists."
        )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)


@router.post("/save", status_code=status.HTTP_201_CREATED)
async def save_uploaded_file(
    user: user_dependency, db: db_dependency, file: UploadFile = File(...)
):
    """
    Receives FormData and saves the file.
    The file input field is used to identify the file.
    FastAPI automatically reads the file and populates UploadFile.
    """
    try:

        file_path = save_file(file)
        file_type = None
        if file_path.endswith(".csv"):
            file_type = "csv"
        elif file_path.endswith(".json"):
            file_type = "json"

        if file_type != "json" or "csv":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=f"Wrong file extension"
            )

        filename = Path(file_path).name
        saved_file = Files(path=file_path, filename=filename, file_type=file_type)

        db.add(saved_file)
        db.commit()  # Commit the transaction to save the file info in the database

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File not saved: {e}")

    return {"file_saved": file_path}
