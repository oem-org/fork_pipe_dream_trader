export interface StrategyIndicator {
    id: number;
    name: string;
    kind: string
    settings: Record<string, any>
    settings_schema: Record<string, any>
    dataframe_column: string,
    strategyId: number;
    indicatorId: string;
}

export type StrategyIndicatorRequest = Omit<StrategyIndicator, 'id'>;

export interface UpdateStrategyIndicatorRequest {
    settings: Record<string, any>
}
