
export default async function sendFormData<R>(
	e: React.FormEvent<HTMLFormElement>,
	apiCall: (data: FormData) => Promise<R>,
	setError: React.Dispatch<React.SetStateAction<string>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<R | null> {
	//Let form return boolean or void if needed

	e.preventDefault();

	setLoading(true);

	let result: R | null = null;

	const formData = new FormData(e.currentTarget);
	console.log(formData)
	try {
		result = await apiCall(formData);

	} catch (error) {
		setError("An error occurred. Try again.");
	} finally {
		setLoading(false);
	}

	return result;
}
