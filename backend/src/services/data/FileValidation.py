import pandas as pd
import os

from utils.exceptions import handle_not_validated_file_error
from ...schemas import FileTypeEnum


class FileValidationBase():
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_type = self._file_type_check()
        self.data = pd.DataFrame()
        self.errors = {}

    def _file_type_check(self) -> FileTypeEnum | None:
        if self.file_path.endswith(".csv"):
            return FileTypeEnum.CSV
        elif self.file_path.endswith(".json"):
            return FileTypeEnum.JSON
        else:
            return None

    def validate_or_delete(self) -> bool | None:
        self._load_data()
        result = self._validate_data()
        if result == False:
            print(self.errors)
            os.remove(self.file_path)
            handle_not_validated_file_error("File contains validation errors, see result in details", self.errors)
        else:
            return True

    def _load_data(self) -> None:
        """
        Load to a dataframe with errors to generate a detail error response
        """
        try:
            if self.file_type == FileTypeEnum.JSON:
                self.data = pd.read_csv(self.file_path)
            
            else:
                self.data = pd.read_json(self.file_path)

            self.data['volume'] = pd.to_numeric(self.data['volume'], errors='coerce')
            self.data['open'] = pd.to_numeric(self.data['open'], errors='coerce')
            self.data['close'] = pd.to_numeric(self.data['close'], errors='coerce')
            self.data['low'] = pd.to_numeric(self.data['low'], errors='coerce')
            self.data['high'] = pd.to_numeric(self.data['high'], errors='coerce')
            self.data['time'] = pd.to_datetime(self.data['time'], errors='coerce')

        except Exception as e:
            raise Exception(f"Error reading CSV file: {e}")    
             

    def _validate_data(self) -> bool:
        """
        Validate the DataFrame with vectorized operators for speed
        """
        errors = []

        missing_fields = self.data[['time', 'volume', 'value']].isna().any(axis=1)
        invalid_volume = self.data['volume'] < 0
        invalid_value = ~self.data['value'].apply(lambda x: isinstance(x, (int, float)))
        #bitwise OR operator
        # false | false | true = true
        invalid_rows = missing_fields | invalid_volume | invalid_value

        for index in self.data[invalid_rows].index:
            row = self.data.loc[index]
            error_message = []

            # isna().any(axis=1) returns a DataFrame of same shape where each value is True/False 
            # depending on if the original DataFrame is NaN
            if pd.isna(row['time']) or pd.isna(row['volume']) or pd.isna(row['value']):
                error_message.append("Missing or invalid fields")
            if row['volume'] < 0:
                error_message.append("Invalid volume")
            if not isinstance(row['value'], (int, float)):
                error_message.append("Invalid value")
            
            errors.append((index, ", ".join(error_message)))
            if len(errors) == 0:
                return True

        return False

    def get_date_range(self):
        """
        Get the min and max date from the 'time' column in the DataFrame.
        """
        if self.data.empty:
            return None, None
        times = self.data['time']
        return times.min(), times.max()
