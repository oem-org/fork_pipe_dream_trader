type DataSourceType = "file" | "database"

export interface FileDataSource {
    id: number;
    fileName: string;
    filePath: string;
}

export interface DatabaseDataSource {
    tableName: string;
    pair: string
}



export interface Strategy {
    id: number;
    name: string;
    description: string;
    data_source_type: DataSourceType;
    data_source: FileDataSource | DatabaseDataSource;
    timeperiod: string;
    indicators?: Record<string, any>;
}
