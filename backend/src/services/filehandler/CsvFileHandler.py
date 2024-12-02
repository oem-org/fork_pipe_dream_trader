
class CSVFileHandler(BaseFileHandler):
    def __init__(self, file_path):
        super().__init__(file_path, delimeter=',')

    def read(self):
        if not self.exists():
            raise FileNotFoundError(f"File {self.file_path} not found.")
        with open(self.file_path, 'r', newline='') as file:
            reader = csv.reader(file)
            return [row for row in reader]

    def write(self, content):
        if not isinstance(content, list):
            raise ValueError("Content must be a list of rows to write to the CSV file.")
        with open(self.file_path, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerows(content)
        print(f"CSV data written to {self.file_path}.")

    def delete(self):
        super().delete()
