# Tech stack

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
