CREATE TABLE Binance1s (
    Time TIMESTAMP,
    Symbol VARCHAR(50),
    Price NUMERIC,
    Quantity INTEGER
)
SELECT create_hypertable('Binance1s', by_range('Time'));
CREATE INDEX ix_symbol_time ON stocks_real_time (symbol, time DESC);