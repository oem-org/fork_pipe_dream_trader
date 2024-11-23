import { FormDataType } from "../../../interfaces/types/FormDataType";
import extractFormData from "./extractFormData";

export default async function handleFormSubmit<T extends object>(
	e: React.FormEvent<HTMLFormElement>,
	apiCall: (data: T) => Promise<boolean>,
	setError: React.Dispatch<React.SetStateAction<string>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
	e.preventDefault();

	setLoading(true);
	let redirect = false

	const formData = new FormData(e.currentTarget);
	const formDataObject = extractFormData<FormDataType<T>>(formData);

	try {
		redirect = await apiCall(formDataObject);
	} catch (error) {
		setError("An error occurred. Try again.");
	} finally {
		setLoading(false);
		return redirect
	}
}
