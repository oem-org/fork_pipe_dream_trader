import os

class BaseFileHandler:
    """Base class for handling different file types"""

    def __init__(self, file_path):
        self.file_path = file_path

    def read(self):
        raise NotImplementedError("Subclasses must implement the read method.")

    def exists(self):
        return os.path.exists(self.file_path)

    def delete(self):
        """Delete the file."""
        if self.exists():
            os.remove(self.file_path)
            print(f"File {self.file_path} deleted.")
        else:
            print(f"File {self.file_path} does not exist.")
