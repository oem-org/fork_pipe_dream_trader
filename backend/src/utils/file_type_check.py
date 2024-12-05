from ..schemas import FileTypeEnum


def file_type_check(file_path: str) -> FileTypeEnum | None:
    if file_path.endswith(".csv"):
        return FileTypeEnum.CSV
    elif file_path.endswith(".json"):
        return FileTypeEnum.JSON
    else:
        return None
