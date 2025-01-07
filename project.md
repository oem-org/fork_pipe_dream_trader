nginx folder
/var/www/html

SELECT *
FROM ohlc_data_1minute
WHERE symbol = 'YGGUSDT'
  AND DATE(time5m) = '2024-11-28';

SELECT *
FROM ohlc_data_1minute 
WHERE symbol = 'YGGUSDT'
  AND time1m BETWEEN '2024-11-28 17:30:00.000' AND '2024-11-29 17:29:59.999';


SELECT 
    MIN(timestamp) AS first,
    MAX(timestamp) AS last
FROM ohlc_data_1minute;

SELECT 
    MIN(timestamp) AS first_timestamp,
    MAX(timestamp) AS last_timestamp
FROM ohlc_data_1minute
WHERE symbol = 'BTCUSDT';

# Tech stack

FastAPI automatically converts responses to JSON
https://fastapi.tiangolo.com/tutorial/encoder/


https://realpython.com/prevent-python-sql-injection/


Direct Injection	Simple, easy to implement, automatic lifecycle management	No connection pooling, higher overhead for each request
Singleton Pattern	Efficient for low traffic, service reused across endpoints	No pooling, shared state may cause issues with concurrency or testing
Connection Pooling (Singleton)	Efficient connection reuse, handles high traffic better	More complex to implement, requires careful resource management
Manual Connection Management	Fine-grained control, flexibility	Increased complexity, requires manual management of connections

Frontend:
Next.js, react-query
Lightweight charts

Backend:
Fast api, background tasks
SQLAlchemey + Pydantic
Redis
Timescaledb

Data:
pandas dataframes
pandas-ta (Tekniske indikatorer)

DevOps:
Github Actions

Problemformulering:
Hvordan kan en genetisk algoritme bruges til at optimere kombinationer af tekniske indikatorer til handelsstrategier på historisk markeds data, 
og hvordan kan disse strategier visualiseres og testes i en webapplikation med interaktive grafer og live markets data?


Projektet vil undersøge udviklingen af en algoritme, der identificerer effektive indikator-kombinationer, samt designet af en webapplikation med funktioner til backtesting, live-data simulering og et intuitivt UI, hvor brugeren kan analysere og afprøve de optimerede strategier visuelt.



SELECT add_continuous_aggregate_policy('ohlc_data_1minute',
  start_offset => NULL,
  end_offset => NULL,
  schedule_interval => INTERVAL '1 minute');

SELECT add_continuous_aggregate_policy('ohlc_data_5minute',
  start_offset => NULL,
  end_offset => NULL,
  schedule_interval => INTERVAL '5 minute');





[
    {
        "CreatedAt": "2024-11-28T12:56:57+01:00",
        "Driver": "local",
        "Labels": {
            "com.docker.compose.project": "pipe_dream_paper_trading",
            "com.docker.compose.version": "2.29.7",
            "com.docker.compose.volume": "timescale-data"
        },
        "Mountpoint": "/var/lib/docker/volumes/pipe_dream_paper_trading_timescale-data/_data",
        "Name": "pipe_dream_paper_trading_timescale-data",
        "Options": null,
        "Scope": "local"
    }
]


uvicorn src.main:app --reload


### Alembic

alembic init folder_name           : creates ini file and alembic folder

Generate metadata for the migration file by changing
 target_metadata = models.Base.metadata

alembic revision -m message      : new migration revision that needs to be filled out, has some metadata


create some change in the model and run above command
fill out the migrations

alembic upgrade revision_id          : run the enhancement
paste Revision ID from the file created

alembic downgrade -1

### Sources


### Pytest

Pytest needs RootFolder/App to work


### TA-Lib
install to usr directory and compile:
```
./configure --prefix=/usr
make
sudo make install
pip install ta-lib
```

