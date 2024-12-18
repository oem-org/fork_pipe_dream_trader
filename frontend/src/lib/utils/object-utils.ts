
export function parseJsonStrings(obj: Record<string, any>): Record<string, any> {
	for (const key in obj) {
		try {
			const parsedValue = JSON.parse(obj[key]);
			console.log(parsedValue, parsedValue)
			// Replace the string value with the parsed JSON object
			obj[key] = parsedValue;
		} catch (error) {
			console.warn(`Key "${key}" contains invalid JSON:`, obj[key]);
		}
	}
	return obj;
}
