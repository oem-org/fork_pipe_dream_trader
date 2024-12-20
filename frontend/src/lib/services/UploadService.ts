import { csvFileApi } from "../apiClientInstances";
import { jsonFileApi } from "../apiClientInstances";

export default class UploadService {
	async detectFileType(formData: FormData): Promise<string> {
		return new Promise((resolve, reject) => {
			const file = formData.get("file") as File;

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

			//reader.readAsText(file);
		});
	}

	async upload(formData: FormData): Promise<any> {
		try {
			const type = await this.detectFileType(formData);

			if (type === "json") {
				await jsonFileApi.post(formData).catch((error) => {
					throw new Error("Failed to upload JSON file: " + error.message);
				});
			} else {
				await csvFileApi.post(formData).catch((error) => {
					throw new Error("Failed to upload CSV file: " + error.message);
				});
			}

		} catch (error) {
			console.error("Error in upload process:", error);
			throw error;
		}
	}


	async read(formData: FormDat): Promise<any> {
		try {
			const type = await this.detectFileType(formData);

			if (type === "json") {
				await jsonFileApi.post(formData).catch((error) => {
					throw new Error("Failed to upload JSON file: " + error.message);
				});
			} else {
				await csvFileApi.post(formData).catch((error) => {
					throw new Error("Failed to upload CSV file: " + error.message);
				});
			}

		} catch (error) {
			console.error("Error in upload process:", error);
			throw error;
		}
	}

}
