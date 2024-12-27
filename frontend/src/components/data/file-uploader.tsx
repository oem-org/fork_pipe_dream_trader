import React, { useState } from "react";
import UploadService from "../../lib/services/UploadService";
import { Button } from "../ui/buttons/button";

export default function FileUploadForm() {
	const [error, setError] = useState<string | null>(null);
	const uploader = new UploadService()


	async function handleUpload(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		console.log(formData)
		try {
			const result = await uploader.upload(formData);
			console.log(result)

		} catch (err: any) {
			setError(err.message);
		}
	}

	return (
		<div>
			<form className="py-2 flex flex-row justify-between" onSubmit={handleUpload}>
				<div className="flex flex-row">
					<input name="file"
						id="fileInput"
						type="file"
					/>
				</div>
				<Button type="submit">Upload File</Button>
			</form>

			{error && <div className="text-error">{error}</div>}
		</div>
	);
}

