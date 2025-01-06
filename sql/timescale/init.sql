CREATE TABLE IF NOT EXISTS bin1s (
    time TIMESTAMP,
    symbol VARCHAR(50),
    price NUMERIC,
    qty INTEGER
);

SELECT create_hypertable('bin1s', 'time', if_not_exists => TRUE);

CREATE INDEX ix_symbol_time ON bin1s (symbol, time DESC);

CREATE MATERIALIZED VIEW ohlc_data_1minute
WITH (timescaledb.continuous) AS
SELECT symbol,
       time_bucket('1 minute', time) AS time1m,
       FIRST(price, time) AS open,
       MAX(price) AS high,
       MIN(price) AS low,
       LAST(price, time) AS close,
       SUM(qty) AS volume
FROM bin1s
GROUP BY symbol, time1m
WITH NO DATA;

CREATE MATERIALIZED VIEW ohlc_data_5minute
WITH (timescaledb.continuous) AS
SELECT symbol,
       time_bucket(INTERVAL '5 minute', time1m) AS time5m,
       FIRST(open, time1m) as open,
       MAX(high) as high,
       MIN(low) as low,
       LAST(close, time1m) as close,
       SUM(volume) as volume
FROM ohlc_data_1minute
GROUP BY symbol, time5m
WITH NO DATA;


SELECT add_continuous_aggregate_policy('ohlc_data_1minute',
  start_offset => NULL,
  end_offset => NULL,
  schedule_interval => INTERVAL '1 minute');

SELECT add_continuous_aggregate_policy('ohlc_data_5minute',
  start_offset => NULL,
  end_offset => NULL,
  schedule_interval => INTERVAL '5 minute');
