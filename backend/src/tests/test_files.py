import os
from pathlib import Path

import pandas as pd
import pytest
from ..utils.get_test_file_path import get_test_file_path

from ..lib.services.FileValidatorService import FileValidator


@pytest.fixture
def valid_file():
    file_path = get_test_file_path("valid_file.csv")
    return file_path


@pytest.fixture
def invalid_timestamp_file():
    file_path = get_test_file_path("invalid_timestamp_lenght.csv")
    return file_path

@pytest.fixture
def invalid_type_string_open():
    file_path = get_test_file_path("invalid_type_string_open.csv")
    return file_path

def test_file_valid(valid_file):
    validator = FileValidator(valid_file)

    assert validator.validate() is True  


def test_open_type_string(invalid_type_string_open):
    validator = FileValidator(invalid_type_string_open)

    assert validator.validate() is True  

def test_file_invalid_timestamp(invalid_timestamp_file):
    with pytest.raises(Exception) as error:
        validator = FileValidator(invalid_timestamp_file)
        validator.validate()
    
    assert str(error.value) == "Error reading file: Error determining time interval: Timeframe does not have unique intervals"


# Test the FileValidator with invalid vovume data
# def test_file_validator_with_invalid_volume(invalid_volume_file):
#     validator = FileValidator(invalid_volume_file)
#     validator.load_data()  # This would load data from the real file
#
#     assert validator.validate() is False  # Validation should fail because of invalid volume
#
#
# # Test the FileValidator with non-numeric "open" values
# def test_file_validator_with_invalid_open(invalid_open_file):
#     validator = FileValidator(invalid_open_file)
#     validator.load_data()  # This would load data from the real file
#
#     assert validator.validate() is False  # Validation should fail because of invalid "open" value
#
#
# # Test the FileValidator with duplicate indices
# def test_file_validator_with_duplicate_index(duplicate_index_file):
#     validator = FileValidator(duplicate_index_file)
#     validator.load_data()  # This would load data from the real file
#
#     assert validator.validate() is False  # Validation should fail because of duplicate indices
#
#
# # Test if the error messages are populated correctly with invalid data
# def test_file_validator_error_messages(invalid_volume_file):
#     validator = FileValidator(invalid_volume_file)
#     validator.load_data()  # This would load data from the real file
#
#     validator.validate()  # Run the validation
#     assert len(validator.errors) > 0  # Errors should be populated
#     assert "Invalid volume" in validator.errors[0][1]  # Check if "Invalid volume" is in the error message
#
#
# # Test if the date range works correctly with real data
# def test_file_validator_get_date_range(valid_file):
#     validator = FileValidator(valid_file)
#     validator.load_data()  # This would load data from the real file
#
#     min_date, max_date = validator.get_date_range()
#     assert min_date == pd.to_datetime(1615281600000, unit='ms')  # Expected minimum date
#     assert max_date == pd.to_datetime(1615281660000, unit='ms')  # Expected maximum date
