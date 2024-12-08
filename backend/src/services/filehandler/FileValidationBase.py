import pandas as pd

class FileValidationBase():
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.data = pd.DataFrame()

    def load_data(self) -> None:
        raise NotImplementedError("Subclasses should implement the load_data method.")

    def validate_data(self) -> dict:
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
                return {"validated": True}

        return {"validated": False, "errors": errors}

    def get_date_range(self):
        """
        Get the min and max date from the 'time' column in the DataFrame.
        """
        if self.data.empty:
            return None, None
        times = self.data['time']
        return times.min(), times.max()
