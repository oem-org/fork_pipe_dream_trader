from pathlib import Path


def get_test_file_path(filename: str) -> str:
    """
    Get the full path of a test file located in the test_files folder.

    Args:
        filename (str): The name of the file in the test_files folder.

    Returns:
        str: The full file path.
    """

    dir_path = Path.cwd() / "src" / "tests" / "test_files"
    file_path = dir_path / filename

    if not file_path.exists():
        raise FileNotFoundError(f"Test file {filename} does not exist in {dir_path}")

    return str(file_path)
