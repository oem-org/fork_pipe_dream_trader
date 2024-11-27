from . import BaseDb

class DatabaseManager(BaseDb):
    def __init__(self):
        super().__init__()

        # SQL queries for table and materialized view creation
        self.sql_create_table = """
        CREATE TABLE IF NOT EXISTS bin1s (
            time TIMESTAMP,
            symbol VARCHAR(50),
            price NUMERIC,
            qty INTEGER
        );
        """

        self.sql_create_hypertable = "SELECT create_hypertable('bin1s', 'time', if_not_exists => TRUE);"
        
        self.sql_create_index = "CREATE INDEX IF NOT EXISTS ix_symbol_time ON bin1s (symbol, time DESC);"
        
        self.sql_aggregate_1minute = """
        CREATE MATERIALIZED VIEW ohlc_data_minute
        WITH (timescaledb.continuous) AS
        SELECT symbol,
            time_bucket(INTERVAL '1 minute', time) AS date,
            FIRST(price, time) as open,
            MAX(price) as high,
            MIN(price) as low,
            LAST(price, time) as close,
            SUM(qty) as volume
        FROM bin1s
        GROUP BY symbol, date
        WITH NO DATA;
        """
        
        self.sql_aggregate_5minute = """
        CREATE MATERIALIZED VIEW ohlc_data_5minute
        WITH (timescaledb.continuous) AS
        SELECT symbol,
               time_bucket(INTERVAL '5 minutes', time) AS date,
               FIRST(open, date) AS open,
               MAX(high) AS high,
               MIN(low) AS low,
               LAST(close, date) AS close,
               SUM(volume) AS volume
        FROM ohlc_data_minute
        GROUP BY symbol, time
        WITH NO DATA;
        """

    def setup_tables(self):
        """Set up the database schema and tables."""
        connection = self._get_db_connection()
        cursor = connection.cursor()
        try:
            # Check if the 'bin1s' table exists
            cursor.execute("""
                SELECT EXISTS (
                    SELECT 1 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' AND table_name = 'bin1s'
                );
            """)
            table_exists = cursor.fetchone()[0]
            
            if not table_exists:
                print("Table 'bin1s' does not exist. Creating...")
                cursor.execute(self.sql_create_table)
                cursor.execute(self.sql_create_hypertable)
                cursor.execute(self.sql_create_index)
                cursor.execute(self.sql_aggregate_1minute)
                cursor.execute(self.sql_aggregate_5minute)
                print("Table 'bin1s' and views created successfully.")
            else:
                print("Table 'bin1s' already exists. Skipping creation.")
        except psycopg2.Error as e:
            print(f"Error during database setup: {e}")
        finally:
            cursor.close()
            connection.close()
