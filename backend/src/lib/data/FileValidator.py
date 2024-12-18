from .FileLoader import FileLoader
import pandas as pd


class FileValidator(FileLoader):
    def __init__(self, file_path: str):
        super().__init__(file_path)  # Inherit from FileLoader
        self.errors = {}
    # TODO: fix validation
    def validate(self) -> bool:
        """
        Validate the DataFrame with vectorized operators for speed
        """
        self.load_data()  # Load the data first

        errors = []

        # Missing or invalid fields
        # missing_fields = self.df[['time', 'volume', 'open']].isna().any(axis=1)

        # Check for missing or invalid timestamps
        # invalid_time = self.df['time'].isna() | ~self.df['time'].apply(
        #     lambda x: isinstance(x, (int, float)) and len(str(int(x))) in [10, 13]
        # )

        invalid_volume = self.df['volume'] < 0

        # Create a dataframe of same size with booleans
        # Bitwise NOT: ~ will flip the boolean values
        invalid_open = ~self.df['open'].apply(lambda x: isinstance(x, (int, float)))
        invalid_close = ~self.df['close'].apply(lambda x: isinstance(x, (int, float)))
        invalid_low = ~self.df['low'].apply(lambda x: isinstance(x, (int, float)))
        invalid_high = ~self.df['high'].apply(lambda x: isinstance(x, (int, float)))

        # Combine all invalid conditions into one condition with bitwise OR
        invalid_rows = invalid_volume | invalid_open | invalid_close | invalid_low | invalid_high
        duplicate_indices = self.df.index[self.df.index.duplicated()].tolist()
        if duplicate_indices:
            return False
        for index in self.df[invalid_rows].index:
            row = self.df.loc[index]
            error_message = []

            if pd.isna(row['time']):
                error_message.append("Missing or invalid timestamp")
            # elif not (len(str(int(row['time']))) in [10, 13]):
            #     error_message.append(f"Timestamp length is invalid (actual length: {len(str(int(row['time'])))} digits)")

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
            print(len(errors))
        if len(errors) == 0:
            return True

        self.errors = errors
        return False

    def get_date_range(self):
        """
        Get the min and max date from the 'time' column
        """
        if self.df.empty:
            return None, None
        times = self.df['time']

        return times.min(), times.max()
