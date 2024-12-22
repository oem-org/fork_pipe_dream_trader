// TODO: delete back and forward buck in indicator inpyt
export function convertToString(input: any): string {
	if (typeof input === 'number') {
		return input.toString();
	}
	return input;
}

export function normalizeDelimeter(value: any) {
	const normalizeValue = convertToString(value).replace(',', '.');
	return normalizeValue
}

export function addDecimal(value: any): string {
	value = convertToString(value);
	//console.log(value);

	const normalizedValue = value.replace(',', '.');

	if (!normalizedValue.includes('.')) {
		return normalizedValue + '.0';
	}

	return normalizedValue;
}

export const isFloat = (value: any): boolean => {
	const normalizedValue = normalizeDelimeter(value)
	return !isNaN(parseFloat(normalizedValue)) && normalizedValue !== '' && normalizedValue !== null && normalizedValue.indexOf('.') !== -1;
};
