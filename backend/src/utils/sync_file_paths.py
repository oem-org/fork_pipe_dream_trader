from inspect import _void
from pathlib import Path

from sqlalchemy.orm import Session

# import .logger

from ..models import Files
from .file_type_check import file_type_check


def delete_missing_files(db: Session, missing_files: dict):
    files_to_delete = []
    for name in missing_files.keys():
        db_file_to_delete = db.query(Files).filter(Files.name == name).first()
        if db_file_to_delete:
            files_to_delete.append(db_file_to_delete)

    for file_to_delete in files_to_delete:
        print(file_to_delete)
        db.delete(file_to_delete)

    db.commit()


def add_non_matching_files(db: Session, non_matching_files: dict):
    files_to_add = []
    for name, file_info in non_matching_files.items():
        file_type = file_type_check(name)
        file_to_add = Files(
            name=name,
            path=file_info["folder_path"],
            file_type=file_type,
        )
        files_to_add.append(file_to_add)
        print(file_to_add)
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
    db_file_map = {db_file.name: Path(db_file.path) for db_file in db_files}

    matching_files = {}
    non_matching_files = {}
    missing_in_folder = {}

    for name, file_path in folder_files.items():
        if name in db_file_map:
            if file_path.resolve() == db_file_map[name].resolve():
                matching_files[name] = str(file_path)
            else:
                non_matching_files[name] = {
                    "folder_path": str(file_path),
                    "db_path": str(db_file_map[name]),
                }
        else:
            non_matching_files[name] = {
                "folder_path": str(file_path),
                "db_path": None,
            }

    missing_in_folder = {
        db_file.name: str(db_file_map[db_file.name])
        for db_file in db_files
        if db_file.name not in folder_files
    }

    # logger.info("Matching Files: %s", matching_files)
    # logger.info("Non-Matching Files: %s", non_matching_files)
    # logger.info("Missing Files in Folder: %s", missing_in_folder)
    #

    delete_missing_files(db, missing_in_folder)
    add_non_matching_files(db, non_matching_files)

