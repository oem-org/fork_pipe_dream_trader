import { csvFileApi } from "../apiClientInstances";
import { jsonFileApi } from "../apiClientInstances";

export default class UploadService {
	async detectFileType(formData: FormData): Promise<string> {
		return new Promise((resolve, reject) => {
			const file = formData.get("file") as File;
			console.log(file, "file")
			if (!file) {
				reject(new Error("No file found in FormData"));
				return;
			}

			const reader = new FileReader();

			reader.onloadend = () => {
				try {
					let fileType = "";

					if (file.name.endsWith(".json")) {
						fileType = "json";
					} else if (file.name.endsWith(".csv")) {
						fileType = "csv";
					} else {
						reject(new Error("Unsupported file type"));
						return;
					}

					resolve(fileType);
				} catch (err) {
					reject(new Error("Error processing the file"));
				}
			};

			reader.onerror = () => {
				reject(new Error("Error reading the file"));
			};

			reader.readAsText(file);
		});
	}

	async upload(formData: FormData): Promise<void> {
		try {
			const type = await this.detectFileType(formData);

			if (type === "json") {
				const response = await jsonFileApi.post(formData);
				if (response.status >= 400) {
					throw new Error(`Error: ${response.statusText || "Unknown error"}`);
				}
			} else if (type === "csv") {
				const response = await csvFileApi.post(formData);
				if (response.status >= 400) {
					throw new Error(`Error: ${response.statusText || "Unknown error"}`);
				}
			}
		} catch (error: any) {
			console.error("Error in upload process:", error);
			throw new Error(error.message || "Error uploading file");
		}
	}

}
