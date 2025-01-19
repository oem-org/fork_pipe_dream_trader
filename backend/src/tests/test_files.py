import pytest

from ..lib.services.FileValidatorService import FileValidator
from ..utils.get_test_file_path import get_test_file_path


@pytest.fixture
def valid_file():
    file_path = get_test_file_path("valid_file.csv")
    return file_path


@pytest.fixture
def invalid_timestamp_length():
    file_path = get_test_file_path("invalid_timestamp_lenght.csv")
    return file_path


@pytest.fixture
def duplicate_row():
    file_path = get_test_file_path("duplicate_row.csv")
    return file_path


@pytest.fixture
def timestamp_missing():
    file_path = get_test_file_path("timestamp_missing.csv")
    return file_path


@pytest.fixture
def invalid_open_zero():
    file_path = get_test_file_path("invalid_open_zero.csv")
    return file_path


@pytest.fixture
def missing_all_values():
    file_path = get_test_file_path("missing_values.csv")
    return file_path

@pytest.fixture
def invalid_type_string_open():
    file_path = get_test_file_path("invalid_type_string_open.csv")
    return file_path

@pytest.fixture
def invalid_volume_type_string():
    file_path = get_test_file_path("invalid_volume_string.csv")
    return file_path


@pytest.fixture
def invalid_volume_below_zero():
    file_path = get_test_file_path("invalid_volume_zero.csv")
    return file_path


def test_file_valid(valid_file):
    validator = FileValidator(valid_file)

    assert validator.validate() is True


def test_file_invalid_timestamp(invalid_timestamp_length):
    """Timestamp has invalid length or format"""
    with pytest.raises(Exception) as error:
        validator = FileValidator(invalid_timestamp_length)
        validator.validate()

    assert (
        str(error.value)
        == "Error reading file: Error determining time interval: Timeframe does not have unique intervals"
    )


def test_missing_timestamp(timestamp_missing):
    """Timestamp is missing or invalid"""
    with pytest.raises(Exception) as error:
        validator = FileValidator(timestamp_missing)
        validator.validate()

    assert (
        str(error.value)
        == "Error reading file: Error determining time interval: Timeframe does not have unique intervals"
    )


def test_file_validator_with_duplicate_index(duplicate_row):
    """Timestamp index duplicated"""
    with pytest.raises(Exception) as error:
        validator = FileValidator(duplicate_row)
        validator.validate()

    assert (
        str(error.value)
        == "Error reading file: Error determining time interval: Timeframe does not have unique intervals"
    )

def missing_values(missing_all_values):
    """Open contains value below zero"""
    validator = FileValidator(missing_all_values)

    assert validator.validate() is False

    assert any("Invalid open value" in error[1] for error in validator.errors)
    assert any("Invalid high value" in error[1] for error in validator.errors)
    assert any("Invalid close value" in error[1] for error in validator.errors)
    assert any("Invalid low value" in error[1] for error in validator.errors)
    assert any("Invalid volume value" in error[1] for error in validator.errors)


def test_open_below_zero(invalid_open_zero):
    """Open contains value below zero"""
    validator = FileValidator(invalid_open_zero)

    assert validator.validate() is False
    assert any("Invalid open value" in error[1] for error in validator.errors)


def test_open_type_string(invalid_type_string_open):
    """Open contains string value"""
    validator = FileValidator(invalid_type_string_open)

    assert validator.validate() is False
    assert any("Invalid open value" in error[1] for error in validator.errors)


def test_invalid_volume_string(invalid_volume_type_string):
    """Volume contains a string value"""
    validator = FileValidator(invalid_volume_type_string)

    assert validator.validate() is False
    assert any("Invalid volume" in error[1] for error in validator.errors)


def test_invalid_volume_zero(invalid_volume_below_zero):
    """Volume has value below zero"""
    validator = FileValidator(invalid_volume_below_zero)

    assert validator.validate() is False
    assert any("Invalid volume" in error[1] for error in validator.errors)
