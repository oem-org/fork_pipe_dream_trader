export interface StrategyIndicator {
    id: number;
    kind: string
    settings: Record<string, any>
    settings_schema: Record<string, any>
    fk_strategy_id: number;
    fk_indicator_id: string;
}

export type StrategyIndicatorRequest = Omit<StrategyIndicator, 'id'>;

export interface UpdateStrategyIndicatorRequest {
    settings: Record<string, any>
}
