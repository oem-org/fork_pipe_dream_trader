from pathlib import Path

import pandas as pd

from ...schemas import FileTypeEnum


class FileLoader:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_type = self._file_type_check()
        self.df = pd.DataFrame()
        self.pickle_dir = Path("pickled_files")
        self.timeframe = ""

    def _file_type_check(self) -> FileTypeEnum | None:
        """Checks the file type based on the extension"""
        if self.file_path.endswith(".csv"):
            return FileTypeEnum.CSV
        elif self.file_path.endswith(".json"):
            return FileTypeEnum.JSON
        else:
            return None

    def get_pair(self):
        columns_to_check = ['pair', 'symbol', 'ticker']

        for column in columns_to_check:
            if column in self.df.columns:
                value = str(self.df[column].iloc[0])
                print(f"Returning value from column: {column}")
                return value

        print("No matching column found.")
        return None

    def determine_time_interval(self):
        """
        Creates the timeinterval the chart will use
        """
        try:
            TIMEFRAME = {
                "1m": 60,
                "5m": 300,
                "15m": 900,
                "30m": 1800,
                "1h": 3600,
                "4h": 7200,
                "8h": 14400,
                "12h": 43200,
                "daily": 86400,
            }

            time_diffs = self.df["time"].diff()

            # First row will allways be nan after diff()
            unique_intervals = time_diffs.dropna().unique()

            if len(unique_intervals) == 1:
                interval_seconds = unique_intervals[0]

                print(f" {interval_seconds} seconds\n")
                for timeframe, timeframe_seconds in TIMEFRAME.items():
                    # Interval_seconds is a negative number and a float because of the
                    # The way diff() compares

                    if interval_seconds + timeframe_seconds == 0:
                        self.timeframe = timeframe
            else:
                raise Exception("Timeframe does not have unique intervals")
        except Exception as e:
            raise Exception(f"Error determining time interval: {e}")

    def load_or_reload(self):
        """
        Checks if a pickle file with the same name as the original file exists.
        If the pickle file does not exist, loads data from the original file and saves it as a pickle.
        """

        original_file_path = Path(self.file_path)

        directory = original_file_path.parent

        new_folder = directory / "pickled_files"

        pickle_file_path = new_folder / original_file_path.with_suffix(".pkl").name

        if pickle_file_path.exists():
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

            column_mapping = {
                "unix": "time",
                "Volume": "volume",
                "o": "open",
                "h": "high",
                "l": "low",
                "c": "close",
            }
            self.df.rename(
                columns=lambda col: column_mapping.get(col, col), inplace=True
            )

            if "time" in self.df.columns:
                self.df["time"] = pd.to_numeric(self.df["time"])
                self.df["time"] = self.df["time"].apply(
                    lambda x: x / 1000 if pd.notna(x) and len(str(int(x))) == 13 else x
                )

            # Coerce inserts NaN or NaT if it gets a bad row, instead of raising a exception,
            # so its possible to identify excatly which rows are bad
            self.df["volume"] = pd.to_numeric(self.df["volume"], errors="coerce")
            self.df["open"] = pd.to_numeric(self.df["open"], errors="coerce")
            self.df["close"] = pd.to_numeric(self.df["close"], errors="coerce")
            self.df["low"] = pd.to_numeric(self.df["low"], errors="coerce")
            self.df["high"] = pd.to_numeric(self.df["high"], errors="coerce")
            self.df.set_index(pd.DatetimeIndex(self.df["time"]), inplace=True)

            self.determine_time_interval()

        except Exception as e:
            raise Exception(f"Error reading file: {e}")

            # self.df["time"] = pd.to_datetime(
            #     self.df["time"], unit="s", errors="coerce"
            # )
