export interface FileSource {
    fk_file_id: number;
    timeperiod?: string;
}

export interface DatabaseSource {
    table: string;
    pair: string;
    timeperiod?: string;
}

export interface Strategy {
    id: number;
    name: string;
    fk_file_id?: number;
    description: string;
    data_source?: FileSource | DatabaseSource;
    timeperiod?: string;

    file?: {
        id: number;
        path: string;
        name: string;
        pair?: string;
        file_type: string;
    };
    strategy_conditions?: StrategyCondition[];
    strategy_indicators?: StrategyIndicator[];
    backtests?: StrategyBacktest[];
}

export interface StrategyCondition {
    id: number;
    side: string;
    settings?: Record<string, any>;
    created_at?: string;
    updated_at?: string;
}

export interface StrategyIndicator {
    id: number;
    settings?: Record<string, any>;
    dataframe_column?: string;
}

export interface StrategyBacktest {
    id: number;
    conditions: Record<string, any>;
    created_at: string;
    updated_at: string;
}

