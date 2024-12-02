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
            database=self.db
        )
        return connection
