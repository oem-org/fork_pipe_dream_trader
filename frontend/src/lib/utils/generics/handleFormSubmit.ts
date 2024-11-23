import { FormDataType } from "../../../interfaces/types/FormDataType";
import extractFormData from "./extractFormData";

export default async function handleFormSubmit<T extends object, R>(
	e: React.FormEvent<HTMLFormElement>,
	apiCall: (data: T) => Promise<R>,
	setError: React.Dispatch<React.SetStateAction<string>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<R | null> {
	e.preventDefault();

	setLoading(true);
	let result: R | null = null;

	const formData = new FormData(e.currentTarget);
	const formDataObject = extractFormData<FormDataType<T>>(formData);
	console.log(import.meta.env.VITE_API_URL)
	try {
		result = await apiCall(formDataObject);
	} catch (error) {
		setError("An error occurred. Try again.");
	} finally {
		setLoading(false);
	}

	return result;
}
