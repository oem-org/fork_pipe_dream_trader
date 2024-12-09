import { DataSourceEnum } from "../enums/DataSourceEnum";

export interface FileDataSourceRequest {
	id: number,
}

export interface DatabaseDataSourceRequest {
	table: string
}


export interface CreateStrategyRequest {
	id: number;
	name: string;
	description: string;
	data_source_type: DataSourceEnum;
	data_source: FileDataSourceRequest | DatabaseDataSourceRequest;
	indicators?: Record<string, any>;
}
