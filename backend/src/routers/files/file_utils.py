from pathlib import Path
from ...utils.exceptions import handle_not_validated_file_error
from starlette import status
from fastapi import HTTPException, UploadFile
import shutil
import os

def get_file_path(file: UploadFile) -> str:
    folder_path = Path.cwd() / "uploaded_files"
    folder_path.mkdir(parents=True, exist_ok=True)
    file_path = folder_path / file.filename

    if file_path.exists():
        # send a "Conflict" status code
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"File '{file.filename}' already exists.",
        )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)


def validate_or_delete(result, file_path) -> bool:
    if not result.validated:
        print(result.errors)
        os.remove(file_path)
        handle_not_validated_file_error(
            "File contains validation errors, see result in details", result.errors
        )
    return True
