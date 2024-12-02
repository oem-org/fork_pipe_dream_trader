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
			};

			reader.onerror = () => {
				reject(new Error("Error reading the file"));
			};

			reader.readAsText(file);
		});
	}

	async upload(formData: FormData): Promise<any> {
		const type = await this.detectFileType(formData)
		if (type === "json") {
			jsonFileApi.post(formData)
		}
		else {
			csvFileApi.post(formData)
		}
	}
}
