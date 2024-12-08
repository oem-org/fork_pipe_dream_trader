import pandas as pd
from .FileValidation import FileValidationBase



class FileValidationCsv(FileValidationBase):
    def load_data(self) -> None:
        """
        Load to a dataframe with errors to generate a detail error response
        """
        try:
            self.data = pd.read_csv(self.file_path)

            self.data['volume'] = pd.to_numeric(self.data['volume'], errors='coerce')
            self.data['value'] = pd.to_numeric(self.data['value'], errors='coerce')

            self.data['time'] = pd.to_datetime(self.data['time'], errors='coerce')

        except Exception as e:
            raise Exception(f"Error reading CSV file: {e}")


