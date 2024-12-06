export default interface CreateStrategyRequest {
	name: string
	description: string
	data_source: JSON
	indicators?: JSON
}

