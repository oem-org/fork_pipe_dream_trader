import psycopg2
import os
# from dotenv import load_dotenv
#
# load_dotenv()
class BaseDatabase:
    def __init__(self):
        self.dbuser = os.environ['TS_POSTGRES_USER']
        self.dbpass = os.environ['TS_POSTGRES_PASSWORD']
        self.db = os.environ['TS_POSTGRES_DB']
        self.host = os.environ['TS_POSTGRES_HOST']
        self.port = os.environ['TS_POSTGRES_PORT']

    def _get_db_connection(self):
        """Create a new database connection."""
        connection = psycopg2.connect(
            user=self.dbuser,
            password=self.dbpass,
            host=self.host,
            port=self.port,
      - POSTGRES_USER=${TS_USER}  # Use .env variables
      - POSTGRES_PASSWORD=${TS_PASSWORD}
      - POSTGRES_DB=${TS_DB}
      - POSTGRES_HOST=${TS_HOST}
            database=self.db
        )
        return connection
