import { FormDataType } from "../../../interfaces/types/FormDataType";

export default function extractFormData<T extends FormDataType<T>>(formData: FormData): T {
	const data: Partial<T> = {};
	formData.forEach((value, key) => {
		// Form data can be files
		if (typeof value === "string") {
			data[key as keyof T] = value as T[keyof T];
		} else {
			throw new Error(`Expected a string for key "${key}", but got ${typeof value}`);
		}
	});

	return data as T;
};
