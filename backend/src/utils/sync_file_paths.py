from pathlib import Path

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models import Files
from ..schemas import FileTypeEnum


def delete_missing_files(db: Session, missing_files: dict):
    files_to_delete = []
    for filename in missing_files.keys():
        db_file_to_delete = db.query(Files).filter(Files.filename == filename).first()
        if db_file_to_delete:
            files_to_delete.append(db_file_to_delete)

    for file_to_delete in files_to_delete:
        db.delete(file_to_delete)

    db.commit()


def add_non_matching_files(db: Session, non_matching_files: dict):
    files_to_add = []
    for filename, file_info in non_matching_files.items():
        file_to_add = Files(
            filename=filename,
            path=file_info["folder_path"],
            file_type=FileTypeEnum.UNKNOWN,
        )
        files_to_add.append(file_to_add)

    for file_to_add in files_to_add:
        db.add(file_to_add)

    db.commit()


def sync_file_paths(db: Session):
    print("syncing")
    current_directory = Path(__file__).parent
    parent_parent_folder = current_directory.parent.parent
    folder_path = parent_parent_folder / "uploaded_files"

    folder_files = {file.name: file for file in folder_path.iterdir() if file.is_file()}
    print(folder_files)

    db_files = db.query(Files).all()
    db_file_map = {db_file.filename: Path(db_file.path) for db_file in db_files}

    matching_files = {}
    non_matching_files = {}
    missing_in_folder = {}

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

    delete_missing_files(db, missing_in_folder)
    add_non_matching_files(db, non_matching_files)

    return {
        "matching_files": matching_files,
        "non_matching_files": non_matching_files,
        "missing_in_folder": missing_in_folder,
    }
