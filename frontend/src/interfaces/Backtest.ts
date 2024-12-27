export interface CreateBacktestRequest {
    buy_conditions: any,
    sell_conditions: any,
}

export interface BacktestResult {
    result: Record<any, any>,
}
