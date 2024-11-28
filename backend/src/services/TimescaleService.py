
import psycopg2
from ..config import Config

class TimescaleService:
    def __init__(self):
        self.db_url = Config.TIMESCALE_DATABASE_URL

    def get_connection(self):
        return psycopg2.connect(self.db_url)

    def execute_raw_sql(self, query: str):
        conn = self.get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query)
                conn.commit()
        except Exception as e:
            conn.rollback()
            print(f"Error executing query: {e}")
        finally:
            conn.close()

