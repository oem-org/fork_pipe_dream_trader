
export interface StrategyCondition {
    id: number;
    side: string;
    position: number;
    fk_strategy_id: number;
    settings: string;
}

export type StrategyConditionRequest = Omit<StrategyCondition, 'id'>;

export interface UpdateStrategyConditionRequest {
    settings: Record<string, any>
}
