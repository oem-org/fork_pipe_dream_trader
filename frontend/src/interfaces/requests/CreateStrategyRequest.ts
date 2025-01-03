
export interface CreateStrategyRequest {
	name: string;
	description: string;
	fk_file_id?: number;
	indicators?: Record<string, any>;
}
