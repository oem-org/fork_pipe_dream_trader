import React, { useState } from "react";
import UploadService from "../../lib/services/UploadService";

export default function FileUploadForm() {
	const [output, setOutput] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const uploader = new UploadService()


	async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		console.log(formData)
		try {
			const result = await uploader.upload(formData);

			setOutput(result);

		} catch (err: any) {
			setError(err.message);
		}
	}

	return (
		<div>
			<h2>File Upload</h2>
			<form onSubmit={handleUpload}>
				<div>
					<label htmlFor="fileInput">Select File:</label>
					<input name="file"
						id="fileInput"
						type="file"
					/>
				</div>
				<button type="submit">Upload</button>
			</form>

			{error && <div style={{ color: "red" }}>{error}</div>}
			{output && (
				<div>
					<h3>File Content:</h3>
					<pre>{JSON.stringify(output, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}

