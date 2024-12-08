import pandas as pd
from .FileValidationBase import FileValidationBase 


class FileValidationJson(FileValidationBase):
    def load_data(self) -> None:
        """
        Load to a dataframe with errors.
        """
        try:
            # Read the JSON file into a DataFrame
            self.data = pd.read_json(self.file_path)

            # Ensure the necessary columns are of the correct type
            self.data['volume'] = pd.to_numeric(self.data['volume'], errors='coerce')
            self.data['value'] = pd.to_numeric(self.data['value'], errors='coerce')
            self.data['time'] = pd.to_datetime(self.data['time'], errors='coerce')

        except Exception as e:
            raise Exception(f"Error reading JSON file: {e}")
