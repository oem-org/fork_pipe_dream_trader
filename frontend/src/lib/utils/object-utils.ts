export function parseJsonStrings(obj: Record<string, any>): Record<string, any> {
	for (const key in obj) {
		if (key !== 'pair' && key !== 'timeframe') {
			try {
				const parsedValue = JSON.parse(obj[key]);
				obj[key] = parsedValue;
			} catch (error) {
				console.warn(`Key "${key}" contains invalid JSON:`, obj[key]);
			}
		}
	}
	return obj;
}
