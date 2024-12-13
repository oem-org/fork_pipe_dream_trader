import { FileSource, DatabaseSource } from "../Strategy";




export interface CreateStrategyRequest {
	name: string;
	description: string;
	fk_file_id?: number;
	data_source: FileSource | DatabaseSource;
	indicators?: Record<string, any>;
}
