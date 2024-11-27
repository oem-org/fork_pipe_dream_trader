DO $$ 
BEGIN
    SELECT remove_continuous_aggregate_policy('ohlc_data_1minute');
    SELECT remove_continuous_aggregate_policy('ohlc_data_5minute');

    DROP MATERIALIZED VIEW ohlc_data_1minute;
    DROP MATERIALIZED VIEW ohlc_data_5minute;

    DROP TABLE IF EXISTS bin1s;

END $$;
