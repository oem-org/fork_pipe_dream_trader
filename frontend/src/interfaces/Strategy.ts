import { DataSourceEnum } from "./enums/DataSourceEnum";

export interface FileDataSource {
    id: number;
    fileName: string;
    filePath: string;
}

export interface DatabaseDataSource {
    tableName: string;
    pair: string
}


export default interface Strategy {
    id: number;
    name: string;
    description: string;
    data_source_type: DataSourceEnum;
    data_source: FileDataSource | DatabaseDataSource;
    indicators?: Record<string, any>;
}
