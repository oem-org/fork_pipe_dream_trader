import asyncio
import json
import pandas as pd
import psycopg2
import websockets
from binance.client import Client
import os
from dotenv import load_dotenv

load_dotenv()

class BinanceDatabaseStreamer:
    def __init__(self):
        self.dbuser = os.getenv('POSTGRES_USER')
        self.dbpass = os.getenv('POSTGRES_PASSWORD')
        self.db = os.getenv('POSTGRES_DB')
        self.host = os.getenv('POSTGRES_HOST')
        self.port = os.getenv('POSTGRES_PORT')

        self.client = Client()
        self.stream_these = self._generate_stream_list()
        self.connection = None
        self.cursor = None

        self.sql_create_table = """
        CREATE TABLE IF NOT EXISTS bin1s (
            time TIMESTAMP,
            symbol VARCHAR(50),
            price NUMERIC,
            qty INTEGER
        );
        """
        u
        self.sql_create_hypertable = "SELECT create_hypertable('bin1s', 'time');"
        self.sql_create_index = "CREATE INDEX IF NOT EXISTS ix_symbol_time ON bin1s (symbol, time DESC);"

    def _generate_stream_list(self):
        dict_ = self.client.get_exchange_info()
        symbols = [i['symbol'] for i in dict_['symbols'] if i['symbol'].endswith('USDT')]
        print(f"Number of symbols: {len(symbols)}")
        return "/".join([i.lower() + '@kline_1m' for i in symbols])

    async def _connect_to_database(self):
        while True:
            try:
                print("Trying to connect to the database...")
                self.connection = psycopg2.connect(
                    user=self.dbuser, password=self.dbpass,
                    host=self.host, port=self.port, database=self.db
                )
                self.cursor = self.connection.cursor()
                self._setup_database()
                print("Database connection and setup successful.")
                return
            except psycopg2.Error as e:
                print(f"Error connecting to database: {e}. Retrying in 1 second...")
                await asyncio.sleep(1)

    def _setup_database(self):
        self.cursor.execute("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bin1s')")
        table_exists = self.cursor.fetchone()[0]

        if not table_exists:
            self.cursor.execute(self.sql_create_table)
            self.cursor.execute(self.sql_create_hypertable)
            self.cursor.execute(self.sql_create_index)
            self.connection.commit()
            self.cursor.execute(self.sql_aggregate)
            self.connection.commit()
            print("Table 'bin1s' created successfully.")
        else:
            print("Table 'bin1s' already exists. Skipping creation.")

    async def _connect_to_websocket(self):
        while True:
            try:
                async with websockets.connect("wss://stream.binance.com:9443/ws/" + self.stream_these) as websocket:
                    print("Connected to Binance WebSocket.")
                    while True:
                        message = await websocket.recv()
                        await self._process_message(message)
            except websockets.exceptions.ConnectionClosedError:
                print("WebSocket connection closed unexpectedly. Reconnecting...")
                await asyncio.sleep(1)
            except Exception as e:
                print(f"WebSocket connection error: {e}. Reconnecting...")
                await asyncio.sleep(1)

    async def _process_message(self, message):
        json_message = json.loads(message)
        df = self._manipulate(json_message)
        if df is not None:
            print("inserted")
            for index, row in df.iterrows():
                query = "INSERT INTO bin1s (time, symbol, price, qty) VALUES (%s, %s, %s, %s)"
                record_to_insert = (index, row[1], row[0], 23)
                try:
                    self.cursor.execute(query, record_to_insert)
                    self.connection.commit()
                except psycopg2.Error as e:
                    print(f"Error during insertion: {e}")

    def _manipulate(self, data):
        df = None
        try:
            value_dict = data['k']
            price, sym = value_dict['c'], value_dict['s']
            event_time = pd.to_datetime([data['E']], unit='ms')
            df = pd.DataFrame([[price, sym]], index=event_time)
        except Exception as e:
            print(f"Error in data manipulation: {e}")
        return df

    async def run(self):
        await self._connect_to_database()
        await self._connect_to_websocket()


if __name__ == '__main__':
    streamer = BinanceDatabaseStreamer()
    asyncio.run(streamer.run())

