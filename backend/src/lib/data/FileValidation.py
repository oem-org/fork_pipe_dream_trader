from .FileHandler import FileHandler
import pandas as pd
from ...schemas import FileTypeEnum

class FileValidation():
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


    def validate(self) -> bool:
        """
        Validate the DataFrame with vectorized operators for speed
        """
        self._load_data()
        
        errors = []

        # timestamp_lengths = self.df['time'].apply(lambda x: len(str(int(x))) if pd.notna(x) else None)
        
        # print(f"Timestamp Lengths: {timestamp_lengths.unique()}") 

        # Missing or invalid fields
        missing_fields = self.df[['time', 'volume', 'open']].isna().any(axis=1)
        
        invalid_volume = self.df['volume'] < 0
        
        # Create a dataframe of same size with booleans
        # Bitwise NOT: ~ will flip the boolean values
        invalid_open = ~self.df['open'].apply(lambda x: isinstance(x, (int, float)))
        invalid_close = ~self.df['close'].apply(lambda x: isinstance(x, (int, float)))
        invalid_low = ~self.df['low'].apply(lambda x: isinstance(x, (int, float)))
        invalid_high = ~self.df['high'].apply(lambda x: isinstance(x, (int, float)))

        # Check for timestamps that don't have the same number of digits
        invalid_timestamp_length = ~self.df['time'].apply(lambda x: len(str(int(x))) in [10, 13])

        # Combine all invalid conditions into one condition with bitwise OR
        invalid_rows = missing_fields | invalid_volume | invalid_open | invalid_close | invalid_low | invalid_high | invalid_timestamp_length

        for index in self.df[invalid_rows].index:
            row = self.df.loc[index]
            error_message = []

            if pd.isna(row['time']):
                error_message.append("Missing or invalid timestamp")
            elif not (len(str(int(row['time']))) in [10, 13]):
                error_message.append(f"Timestamp length is invalid (actual length: {len(str(int(row['time'])))} digits)")

            if pd.isna(row['volume']) or row['volume'] < 0:
                error_message.append("Invalid volume")
            if pd.isna(row['open']) or not isinstance(row['open'], (int, float)):
                error_message.append("Invalid open value")
            if pd.isna(row['close']) or not isinstance(row['close'], (int, float)):
                error_message.append("Invalid close value")
            if pd.isna(row['low']) or not isinstance(row['low'], (int, float)):
                error_message.append("Invalid low value")
            if pd.isna(row['high']) or not isinstance(row['high'], (int, float)):
                error_message.append("Invalid high value")

            errors.append((index, ", ".join(error_message)))

        if len(errors) == 0:
            return True
        
        print("Errors:", self.errors)
        self.errors = errors
        return False
    
    def create_pickle(self):
        pass

    def get_date_range(self):
        """
        Get the min and max date from the 'time' column 
        """
        if self.df.empty:
            return None, None
        times = self.df['time']
        return times.min(), times.max()
