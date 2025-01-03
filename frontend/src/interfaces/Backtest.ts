export interface CreateBacktestRequest {
    buy_conditions: any,
    sell_conditions: any,
}

export interface BacktestResponse {
    result: Record<any, any>,
}
