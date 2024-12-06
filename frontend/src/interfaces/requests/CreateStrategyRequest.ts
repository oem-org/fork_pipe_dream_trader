
export default interface CreateStrategyRequest {
	name: string;
	description: string;
	data_source?: Record<string, any>;
	indicators?: Record<string, any>;
}
