from pathlib import Path

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models import Files


def sync_file_paths(db: Session):
    """
    Checks if the files in the specified folder match the files stored in the database.
    """
    print("syncing")
    current_directory = Path(__file__).parent
    parent_parent_folder = current_directory.parent.parent
    folder_path = parent_parent_folder / "uploaded_files"

    # List all files in the folder
    folder_files = {file.name: file for file in folder_path.iterdir() if file.is_file()}

    print(folder_files)

    db_files = db.query(Files).all()
    # Convert string to a pathlib path
    db_file_map = {db_file.filename: Path(db_file.path) for db_file in db_files}

    matching_files = {}
    non_matching_files = {}

    for filename, file_path in folder_files.items():
        if filename in db_file_map:
            if file_path.resolve() == db_file_map[filename].resolve():
                matching_files[filename] = str(file_path)
            else:
                non_matching_files[filename] = {
                    "folder_path": str(file_path),
                    "db_path": str(db_file_map[filename]),
                }
        else:
            non_matching_files[filename] = {
                "folder_path": str(file_path),
                "db_path": None,
            }

    missing_in_folder = {
        db_file.filename: str(db_file_map[db_file.filename])
        for db_file in db_files
        if db_file.filename not in folder_files
    }

    return {
        "matching_files": matching_files,
        "non_matching_files": non_matching_files,
        "missing_in_folder": missing_in_folder,
    }
