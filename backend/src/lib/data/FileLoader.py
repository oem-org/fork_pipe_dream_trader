import pandas as pd
from ...schemas import FileTypeEnum

class FileLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_type = self._file_type_check()
        self.df = pd.DataFrame()

    def _file_type_check(self) -> FileTypeEnum | None:
        """Checks the file type based on the extension"""
        if self.file_path.endswith(".csv"):
            return FileTypeEnum.CSV
        elif self.file_path.endswith(".json"):
            return FileTypeEnum.JSON
        else:
            print(self.file_path)
            return None

    def load_data(self) -> None:
        """
        Loads data into the DataFrame. This method can be called by subclasses
        for any file reading operation.
        """
        try:
            if self.file_type == FileTypeEnum.JSON:
                self.df = pd.read_json(self.file_path)
            elif self.file_type == FileTypeEnum.CSV:
                self.df = pd.read_csv(self.file_path)

            self.df.columns = self.df.columns.str.lower().str.strip()  
            column_mapping = {
                "unix": "time", "timestamp": "time",
                "o": "open", "h": "high", "l": "low", "c": "close"
            }
            self.df.rename(columns=lambda col: column_mapping.get(col, col), inplace=True)
            
            # Coerce inserts NaN or NaT if it gets bad row, instead of raising a exception, so we can idetify excatly which rows are bad
            self.df['volume'] = pd.to_numeric(self.df['volume'], errors='coerce')
            self.df['open'] = pd.to_numeric(self.df['open'], errors='coerce')
            self.df['close'] = pd.to_numeric(self.df['close'], errors='coerce')
            self.df['low'] = pd.to_numeric(self.df['low'], errors='coerce')
            self.df['high'] = pd.to_numeric(self.df['high'], errors='coerce')
            self.df['time'] = pd.to_datetime(self.df['time'], unit='ms', errors='coerce')

        except Exception as e:
            raise Exception(f"Error reading file: {e}")
    
    def get_data(self):
        return self.df
