import pandas as pd
from ...schemas import FileTypeEnum
# https://docs.python.org/3/library/abc.html

class FileHandler():
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_type = self._file_type_check()
        self.df = pd.DataFrame()
        self.errors = {}

    def _file_type_check(self) -> FileTypeEnum | None:
        if self.file_path.endswith(".csv"):
            return FileTypeEnum.CSV
        elif self.file_path.endswith(".json"):
            return FileTypeEnum.JSON
        else:
            print(self.file_path)
            return None

    def _load_data(self) -> None:
        """
        Load to a dataframe with errors to generate a detailed error response
        in the validate method
        """
        try:
            print(self.file_type,"FILETYPE")
            if self.file_type == FileTypeEnum.JSON:
                print(self.file_type, "csv path")
                self.df = pd.read_json(self.file_path)

            else:
                self.df = pd.read_csv(self.file_path)

            # Lowercase and strip whitespace
            self.df.columns = self.df.columns.str.lower().str.strip()  
            print("Original columns:", self.df.columns)
           
            # Rename common column names
            column_mapping = {
                "unix": "time",
                "timestamp": "time",
                "o": "open",
                "h": "high",
                "l": "low",
                "c": "close",
            }

            #https://pandas.pydata.org/docs/reference/api/pandas.to_numeric.html
            self.df.rename(columns=lambda col: column_mapping.get(col, col), inplace=True)
            print("Mapped columns:", self.df.columns)
            print(self.df.columns)
            self.df['volume'] = pd.to_numeric(self.df['volume'], errors='coerce')
            self.df['open'] = pd.to_numeric(self.df['open'], errors='coerce')
            self.df['close'] = pd.to_numeric(self.df['close'], errors='coerce')
            self.df['low'] = pd.to_numeric(self.df['low'], errors='coerce')
            self.df['high'] = pd.to_numeric(self.df['high'], errors='coerce')
            self.df['time'] = pd.to_datetime(self.df['time'], unit='ms', errors='coerce')
            print(self.df.head())
            print(self.df.info())
        except Exception as e:
            raise Exception(f"Error reading CSV file: {e}")
