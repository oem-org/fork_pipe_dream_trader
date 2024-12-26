
export interface StrategyCondition {
    id: number;
    side: string;
    fk_strategy_id: number
    fk_strategy_indicator_id_1?: number
    fk_strategy_indicator_id_2?: number
    settings: string
}

export type StrategyConditionRequest = Omit<StrategyCondition, 'id'>;

export interface UpdateStrategyConditionRequest {
    settings: Record<string, any>
}
