import psycopg2
from psycopg2 import sql
from typing_extensions import Tuple

from ..config import Config


class TimescaleService:
    def __init__(self):
        self.db_url = Config.TIMESCALE_DATABASE_URL

    def _get_connection(self):
        return psycopg2.connect(self.db_url)

    def execute_raw_sql(self, query: str, params=()):
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                conn.commit()
        except Exception as e:
            conn.rollback()
            print(f"Error executing query: {e}")
        finally:
            conn.close()

    def get_timeperiod(self, table_name: str, val_column: str, symbol: str):
        # Ensure the column name is safely handled
        query = sql.SQL(
            """
            SELECT 
                MIN({val}) AS first,
                MAX({val}) AS last
            FROM {table_name}
            WHERE symbol = %s
        """
        ).format(table_name=sql.Identifier(table_name), val=sql.Identifier(val_column))
        # Type is "Composed" so convert to string
        self.execute_raw_sql(str(query), (symbol,))


# Used for dependency injection
def get_timescale_service():
    return TimescaleService()
