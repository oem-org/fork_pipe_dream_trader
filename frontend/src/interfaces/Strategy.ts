import { FileDataSource, DatabaseDataSource } from "./DataSource";
import { DataSourceEnum } from "./enums/DataSourceEnum";


export default interface Strategy {
    id: number;
    name: string;
    description: string;
    data_source_type: DataSourceEnum;
    data_source: FileDataSource | DatabaseDataSource;
    indicators?: Record<string, any>;
}
