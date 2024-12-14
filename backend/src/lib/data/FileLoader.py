from pathlib import Path

import pandas as pd

from ...schemas import FileTypeEnum


class FileLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_type = self._file_type_check()
        self.df = pd.DataFrame()
        self.pickle_dir = Path("pickled_files")

    def _file_type_check(self) -> FileTypeEnum | None:
        """Checks the file type based on the extension"""
        if self.file_path.endswith(".csv"):
            return FileTypeEnum.CSV
        elif self.file_path.endswith(".json"):
            return FileTypeEnum.JSON
        else:
            print(self.file_path)
            return None

    def load_or_reload(self):
        """
        Checks if a pickle file with the same name as the original file exists.
        If the pickle file does not exist, loads data from the original file and saves it as a pickle.
        """

        original_file_path = Path(self.file_path)

        directory = original_file_path.parent

        new_folder = directory / "pickled_files"

        pickle_file_path = new_folder / original_file_path.with_suffix(".pkl").name
        
        print(pickle_file_path)

        if pickle_file_path.exists():
            print("LOADING DATA FROM PICKLE")
            print(f"Loading data from pickle file: {pickle_file_path}")
            self.df = pd.read_pickle(pickle_file_path)
        else:
            print(
                f"Pickle file not found, loading data from original file: {self.file_path}"
            )
            self.load_data()
            # self.df.to_pickle(pickle_file_path)
            print(f"Data saved as pickle file: {pickle_file_path}")

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
                print("first head######################################################3")
                print("first head######################################################3")
                print("first head######################################################3")
                print("first head######################################################3")
                print("first head######################################################3")
                print("first head######################################################3")
                timestamps = self.df['unix'].head(1)
                print(timestamps)
            # Convert timestamps to Unix timestamp (seconds since the epoch)
            #     unix_timestamps = timestamps.apply(lambda x: int(x.timestamp()) if pd.notna(x) else None)
            #
            # # Check if the Unix timestamps are 10 digits (valid for seconds-based Unix timestamps)
            #     valid_length_check = unix_timestamps.apply(lambda x: len(str(x)) == 10 if x is not None else None)

            # Display the result
                # print("Unix Timestamps:", unix_timestamps)
                # print("Valid Tigggtamp Length Check:", valid_length_check)
            column_mapping = {
                "unix": "time",
                # "timestamp": "time",
                "o": "open",
                "h": "high",
                "l": "low",
                "c": "close",
            }
            self.df.rename(
                columns=lambda col: column_mapping.get(col, col), inplace=True
            )

            # Coerce inserts NaN or NaT if it gets bad row, instead of raising a exception, so its possible to identify excatly which rows are bad
            self.df["volume"] = pd.to_numeric(self.df["volume"], errors="coerce")
            self.df["open"] = pd.to_numeric(self.df["open"], errors="coerce")
            self.df["close"] = pd.to_numeric(self.df["close"], errors="coerce")
            self.df["low"] = pd.to_numeric(self.df["low"], errors="coerce")
            self.df["high"] = pd.to_numeric(self.df["high"], errors="coerce")
            self.df.set_index(pd.DatetimeIndex(self.df["time"]), inplace=True)
            # self.df["time"] = pd.to_davetime(
            #     self.df["time"], unit="s", errors="coerce"
            # )
        except Exception as e:
            raise Exception(f"Error reading file: {e}")

    def get_data(self):
        return self.df
