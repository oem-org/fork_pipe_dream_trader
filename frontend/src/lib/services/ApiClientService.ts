import axios from "axios";

const axiosInstance = axios.create({
	baseURL: 'http://localhost:8000/',
});

class ApiClientService<T, R> {
	endpoint: string;
	headers: Record<string, string>;

	// headers can have any lenght
	constructor(endpoint: string, headers: Record<string, string>) {
		this.endpoint = endpoint;
		this.headers = headers
	}

	async getAll(): Promise<R[]> {
		try {
			const response = await axiosInstance.get<R[]>(this.endpoint, { headers: this.headers });
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async get(id: number, params?: T): Promise<R> {
		try {
			const response = await axiosInstance.get<R>(`${this.endpoint}/${id}/`, {
				params,
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async getSingleParam(id: any, queryString: string): Promise<R> {
		try {
			const response = await axiosInstance.get<R>(`${this.endpoint}/?${queryString}=${id}`, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async getNoneParam(id: number): Promise<R> {
		try {
			const response = await axiosInstance.get<R>(`${this.endpoint}/${id}/`, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async post(data: T): Promise<R> {
		try {
			const response = await axiosInstance.post<R>(this.endpoint, data, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await axiosInstance.delete(`${this.endpoint}${id}`, { headers: this.headers });
		} catch (error) {
			throw error;
		}
	}

	async update(id: number, data: T): Promise<R> {
		try {
			const response = await axiosInstance.put<R>(`${this.endpoint}${id}/`, data, {
				headers: this.headers,
			});
			return response.data;
		} catch (error) {
			throw error;
		}
	}
}

export default ApiClientService;
