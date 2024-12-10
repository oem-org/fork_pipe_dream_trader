
export interface FileDataSource {
    fk_file_id: number;
    timeperiod: string
}

export interface DatabaseDataSource {
    table: string;
    pair: string;
    timeperiod: string;
}

export interface Strategy {
    id: number;
    name: string;
    description: string;
    data_source: FileDataSource | DatabaseDataSource;
    timeperiod: string;
    indicators?: Record<string, any>;
}
