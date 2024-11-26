import asyncio
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import pandas as pd
import psycopg2
import websockets
from binance.client import Client
import os
#https://www.youtube.com/watch?v=-I7jprTueFw&t=2861s&ab_channel=ChadThackray
#gets password from docker-compose env
# dbname = os.environ['POSTGRES_DB']
dbuser = os.environ['POSTGRES_USER']
dbpass = os.environ['POSTGRES_PASSWORD']
client = Client()

dict_ = client.get_exchange_info()

sym = [i['symbol'] for i in dict_['symbols'] if i['symbol'].endswith('USDT')]
print(len(sym))

sym = [i.lower() + '@kline_1m' for i in sym]

stream_these = "/".join(sym)


sql_create_table = """
CREATE TABLE IF NOT EXISTS bin1s (
    time TIMESTAMP,
    symbol VARCHAR(50),
    price NUMERIC,
    qty INTEGER
);
"""

sql_aggregate = """
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
sql_create_hypertable = "SELECT create_hypertable('bin1s', 'time');"

sql_create_index = "CREATE INDEX IF NOT EXISTS ix_symbol_time ON bin1s (symbol, time DESC);"


#host is the ip or hostname of the server, since its called timescaledb in the network created by docker that is the name

def query_row_count():
    connection = psycopg2.connect(user="postgres", password="password", host="timescaledb", port="5435", database="postgres")
    cursor = connection.cursor()
    cursor.execute("SELECT COUNT(*) FROM bin1s;")
    row_count = cursor.fetchone()[0]
    print("Number of rows in Binance1s table:", row_count)
    return row_count


def manipulate(data):
    try:
        value_dict = data['k']
        price, sym = value_dict['c'], value_dict['s']
        event_time = pd.to_datetime([data['E']], unit='ms')
        df = pd.DataFrame([[price, sym]], index=event_time)
    except Exception as e:
        print(e)

    return df


async def on_message(message,cursor, connection):
    json_message = json.loads(message)
    df = manipulate(json_message)
    print(df)
    for index, row in df.iterrows():
        query = "INSERT INTO bin1s (Time, symbol, price, qty) VALUES (%s, %s, %s, %s)"
        record_to_insert = (index, row[1], row[0], 23)
        try:
            cursor.execute(query, record_to_insert)
            connection.commit()
        except psycopg2.Error as e:
            print(f"Error during insertion: {e}")

async def connect_to_database():
    while True:
        try:

            await asyncio.sleep(1)

            connection = psycopg2.connect(user="postgres", password="password", host="timescaledb", port="5432", database="postgres")
            cursor = connection.cursor()

            cursor.execute("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bin1s')")
            table_exists = cursor.fetchone()[0]

            if not table_exists:
                cursor.execute(sql_create_table)
                cursor.execute(sql_create_hypertable)
                cursor.execute(sql_create_index)
                connection.commit()
                cursor.execute(sql_aggregate)
                connection.commit()
                print("Table 'bin1s' created successfully!")
            else:
                print("Table 'bin1s' already exists. Skipping table creation.")

            print("Database setup successful")
            return cursor, connection
        except psycopg2.Error as e:
            print(f"Error connecting to database: {e}")
            print("Retrying in 1 second...")

        # Retry after 1 second
        await asyncio.sleep(1)

async def connect(cursor, connection):
    while True:
        try:
            async with websockets.connect("wss://stream.binance.com:9443/ws/" + stream_these) as websocket:
                while True:
                    message = await websocket.recv()
                    await on_message(message, cursor, connection)
        except websockets.exceptions.ConnectionClosedError:
            print("Connection to Binance WebSocket closed unexpectedly. Reconnecting...")
            await asyncio.sleep(1)
        except Exception as e:
            print(f"Error in WebSocket connection: {e}")
            await asyncio.sleep(1)

async def main():
    while True:
        try:
            cursor, connection = await connect_to_database()
            ws_task = asyncio.create_task(connect(cursor, connection))
            await asyncio.gather(ws_task)
        except psycopg2.Error as e:
            print(f"Error in database connection: {e}")
            await asyncio.sleep(1)

if __name__ == '__main__':
    asyncio.run(main())
