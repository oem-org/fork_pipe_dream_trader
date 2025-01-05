import React, { useState } from "react";
import UploadService from "../../lib/services/UploadService";
import { Button } from "../ui/buttons/button";
import Modal from "../ui/modal";

export default function FileUploadForm() {
	const [modalMessage, setModalMessage] = useState<string | null>(null);
	const [isModal, setIsModal] = useState<boolean>(false);
	const uploader = new UploadService();

	const toggleModal = () => setIsModal(!isModal);

	async function handleUpload(e: React.FormEvent<HTMLFormElement>): Promise<void> {
		e.preventDefault();
		setModalMessage(null);
		const formData = new FormData(e.currentTarget);

		try {
			await uploader.upload(formData);
			setModalMessage("File uploaded successfully!");
			setIsModal(true);
		} catch (err: any) {
			setModalMessage(err.message || "An error occurred during file upload.");
			setIsModal(true);
		}
	}

	return (
		<div>
			<Modal onClose={toggleModal} isOpen={isModal} title="Upload Status">
				<p>{modalMessage}</p>
			</Modal>

			<form className="py-2 px-2 flex flex-col sm:flex-row justify-between" onSubmit={handleUpload}>
				<div className="flex flex-row">
					<input className="pb-2"
						name="file"
						id="fileInput"
						type="file"
					/>
				</div>
				<Button type="submit">Upload File</Button>
			</form>
		</div>
	);
}
