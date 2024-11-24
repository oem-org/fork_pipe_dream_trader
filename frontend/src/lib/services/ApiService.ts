
import axios, { AxiosInstance } from "axios";

// Base class to create and manage axios instance
class ApiService {
	protected axiosInstance: AxiosInstance;
	protected endpoint: string;
	protected headers: Record<string, string>;

	constructor(endpoint: string, headers: Record<string, string>) {
		const url = 'http://localhost:8000'

		this.axiosInstance = axios.create({ baseURL: url });
		this.endpoint = endpoint;
		this.headers = headers;
	}
}

export class GetAllService<R> extends ApiService {
	async getAll(): Promise<R[]> {
		try {
			const response = await this.axiosInstance.get<R[]>(this.endpoint, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

}


export class GetWithParamsService<T, R> extends ApiService {
	async getWithParams(id: number, params?: T): Promise<R> {
		try {
			const response = await this.axiosInstance.get<R>(`${this.endpoint}/${id}/`, {
				params,
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

export class GetWithQueryService<R> extends ApiService {
	async getQueryString(id: any, queryString: string): Promise<R> {
		try {
			const response = await this.axiosInstance.get<R>(`${this.endpoint}/?${queryString}=${id}`, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

export class GetService<R> extends ApiService {
	async get(id: number): Promise<R> {
		try {
			const response = await this.axiosInstance.get<R>(`${this.endpoint}/${id}/`, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

// Class for POST requests
export class PostService<T, R> extends ApiService {
	async post(data: T): Promise<R> {
		try {
			const response = await this.axiosInstance.post<R>(this.endpoint, data, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

// Class for DELETE requests
export class DeleteService extends ApiService {
	async delete(id: number): Promise<void> {
		try {
			await this.axiosInstance.delete(`${this.endpoint}/${id}`, {
				headers: this.headers,
			});
		} catch (error) {
			throw error;
		}
	}
}

// Class for UPDATE (PUT) requests
export class UpdateClient<T, R> extends ApiService {
	async update(id: number, data: T): Promise<R> {
		try {
			const response = await this.axiosInstance.put<R>(`${this.endpoint}/${id}/`, data, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

