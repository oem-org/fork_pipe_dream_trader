export interface StrategyIndicator {
    id: number;
    kind: string;
    settings: Record<string, any>
    fk_strategy_id: number;
    fk_indicator_id: string;
}

export type StrategyIndicatorRequest = Omit<StrategyIndicator, 'id'>;
