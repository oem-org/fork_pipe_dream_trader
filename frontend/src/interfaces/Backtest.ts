export interface Backtest {
    fk_strategy_id: number,
    buy_string: string,
    sell_string: string,
    pnl: string,
    max_drawdown: string,
}


export interface CreateBacktestRequest {
    buy_string: string,
    sell_string: string,
}

export interface BacktestResponse {
    result: Record<any, any>,
}
