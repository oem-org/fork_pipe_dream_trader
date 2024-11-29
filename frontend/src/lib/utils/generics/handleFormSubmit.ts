import { FormDataType } from "../../../interfaces/types/FormDataType";
import extractFormData from "./extractFormData";

export default async function handleFormSubmit<T extends object, R>(
	e: React.FormEvent<HTMLFormElement>,
	apiCall: (data: T) => Promise<R>,
	setError: React.Dispatch<React.SetStateAction<string>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<R | null> {

	// Dynamically creates JSON from form data

	e.preventDefault();
	setLoading(true);

	const formData = new FormData(e.currentTarget);
	const formDataObject = extractFormData<FormDataType<T>>(formData);

	// Return whatever type the apiCalls returns 
	let result: R | null = null;

	try {
		result = await apiCall(formDataObject);
	} catch (error) {
		setError("An error occurred. Try again.");
	} finally {
		setLoading(false);
	}

	return result;
}
