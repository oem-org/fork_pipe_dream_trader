build Dockerfile first, must be called: time

```
docker build -t time .
```

```
docker compose up
```

Will start to save alot of cryptocurrency prices, so terminal will be spammed..

Run postgres code from another terminal:

```
docker exec -it timescaledb psql -U postgres
```

## Timescale SQL magic

SELECT symbol, first(price,time), last(price, time)
FROM stocks_real_time srt
WHERE time > now() - INTERVAL '4 days'
GROUP BY symbol
ORDER BY symbol
