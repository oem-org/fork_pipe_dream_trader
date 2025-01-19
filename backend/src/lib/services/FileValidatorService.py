import pandas as pd

from .FileLoaderService import FileLoader


class FileValidator(FileLoader):
    def __init__(self, file_path: str):
        super().__init__(file_path)  # Inherit from FileLoader
        self.errors = []

    def validate(self) -> bool:
        """
        Validate the DataFrame with vectorized operators for speed.
        Returns True if valid, False otherwise.
        """
        self.load_data()  # Load the data first
        errors = []

        invalid_volume = pd.to_numeric(self.df['volume'], errors='coerce').isna() | (self.df['volume'] < 0)

        invalid_open = pd.to_numeric(self.df['open'], errors='coerce').isna() | (self.df['open'] < 0)

        invalid_close = pd.to_numeric(self.df['close'], errors='coerce').isna() | (self.df['close'] < 0)

        invalid_low = pd.to_numeric(self.df['low'], errors='coerce').isna() | (self.df['low'] < 0)

        invalid_high = pd.to_numeric(self.df['high'], errors='coerce').isna() | (self.df['high'] < 0)
        
        invalid_rows = (
            invalid_volume | invalid_open | invalid_close | invalid_low | invalid_high
        )

        # print("invalid rows", invalid_rows)

        # Check for invalid rows
        for index in self.df[invalid_rows].index:
            row = self.df.loc[index]
            error_message = []

            if pd.isna(row['time']):
                error_message.append("Missing or invalid timestamp")
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

        # Save errors
        if errors:
            self.errors = errors
            self.save_errors_to_file("err.txt")
            return False

        return True

    def save_errors_to_file(self, file_path: str):
        """
        Save the collected errors to a file in a formatted way.
        """
        if not self.errors:
            with open(file_path, 'w') as f:
                f.write("No errors found.\n")
            print(f"No errors to save. File created: {file_path}")
            return

        with open(file_path, 'w') as f:
            f.write("Validation Errors:\n")
            f.write("=" * 50 + "\n")
            for index, message in self.errors:
                f.write(f"Row {index}: {message}\n")
            f.write("=" * 50 + "\n")


    def get_date_range(self):
        """
        Get the min and max date from the 'time' column.
        """
        if self.df.empty:
            return None, None
        times = self.df['time']
        return times.min(), times.max()
