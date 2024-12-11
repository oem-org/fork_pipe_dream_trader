import axios, { AxiosInstance } from "axios";

class ApiService {
	protected axiosInstance: AxiosInstance;
	protected endpoint: string;
	protected model: string;
	protected headers: Record<string, string>;

	constructor(endpoint: string, headers: Record<string, string>, model: string = "") {
		const url = 'http://localhost:8000'

		this.axiosInstance = axios.create({ baseURL: url });
		this.endpoint = endpoint;
		this.model = model;
		this.headers = headers;
	}

	private getAuthorizationHeader(): Record<string, string> {
		const user = localStorage.getItem('user')
		if (user) {
			try {
				const token = JSON.parse(user);
				if (token && token.token_type && token.access_token) {
					return {
						"Authorization": `${token.token_type} ${token.access_token}`,
					};
				}
			} catch (error) {
				console.error("Error parsing user data:", error);
			}
		}

		// If there's no valid token or an error occurred, return an empty object
		return {};
	}

	protected getHeaders(): Record<string, string> {
		return {
			...this.headers,
			...this.getAuthorizationHeader(),
		};
	}

}

export class GetAllService<R> extends ApiService {
	async getAll(): Promise<R[]> {
		console.log(this.getHeaders())
		try {
			const response = await this.axiosInstance.get<R[]>(this.endpoint, {
				headers: this.getHeaders(),
			});
			return response.data;
		} catch (error) {
			console.error("Error in get all");

			throw error;
		}
	}

}


export class PostRelationService<T, R> extends ApiService {
	async getWithParams(id: number, modelId: number, params?: T): Promise<R> {
		try {
			const response = await this.axiosInstance.post<R>(`${this.endpoint}/${id}/${this.model}/${modelId}`, {
				params,
				headers: this.getHeaders(),
			});
			return response.data;
		} catch (error) {
			console.error("Error in with params")
			throw error;
		}
	}
}

export class GetWithParamsService<T, R> extends ApiService {
	async getWithParams(id: number, params?: T): Promise<R> {
		try {
			const response = await this.axiosInstance.get<R>(`${this.endpoint}/${id}/`, {
				params,
				headers: this.getHeaders(),
			});
			return response.data;
		} catch (error) {
			console.error("Error in with params")
			throw error;
		}
	}
}

export class GetWithQueryService<R> extends ApiService {
	async getQueryString(queryString: string): Promise<R> {
		try {
			const response = await this.axiosInstance.get<R>(`${this.endpoint}/?${queryString}`, {
				headers: this.getHeaders(),
			});
			return response.data;
		} catch (error) {
			console.error("Error in get string query")
			throw error;
		}
	}
}

export class GetService<R> extends ApiService {
	async get(id: number): Promise<R> {
		try {
			const response = await this.axiosInstance.get<R>(`${this.endpoint}/${id}/`, {
				headers: this.getHeaders(),
			});

			return response.data;
		} catch (error) {
			console.error("Error in get ");

			throw error;
		}
	}
}

export class PostService<T, R> extends ApiService {
	async post(data: T): Promise<R> {
		console.log('post data', data)
		try {
			const response = await this.axiosInstance.post<R>(this.endpoint, data, {
				headers: this.getHeaders(),
			});

			return response.data;
		} catch (error) {
			console.log("PostService throwing an error")
			throw error;
		}
	}
}

export class DeleteService extends ApiService {
	async delete(id: number): Promise<void> {
		try {
			await this.axiosInstance.delete(`${this.endpoint}/${id}`, {
				headers: this.getHeaders(),
			});
		} catch (error) {
			console.error(error);

			throw error;
		}
	}
}

export class UpdateClient<T, R> extends ApiService {
	async update(id: number, data: T): Promise<R> {
		try {
			const response = await this.axiosInstance.put<R>(`${this.endpoint}/${id}/`, data, {
				headers: this.headers,
			});

			return response.data;
		} catch (error) {
			console.error("Error in update");

			throw error;
		}
	}
}

