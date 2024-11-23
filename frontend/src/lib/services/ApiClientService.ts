import axios from "axios"

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

const storedToken = localStorage.getItem('user')
const token = storedToken ? JSON.parse(storedToken) : null

const headers = {
	'Content-Type': 'application/json',
	'Authorization': `Token ${token?.token}`,
}

class ApiClientService<T, R> {
	endpoint: string

	constructor(endpoint: string) {
		this.endpoint = endpoint
	}

	async getAll(): Promise<R[]> {
		try {
			const response = await axiosInstance.get<R[]>(this.endpoint, { headers })

			return response.data
		} catch (error) {
			throw error
		}
	}

	async get(id: number, params?: T): Promise<R> {
		try {
			const response = await axiosInstance.get<R>(`${this.endpoint}/${id}/`, { params, headers })

			return response.data
		} catch (error) {
			throw error
		}
	}

	async getSingleParam(id: any, queryString: string): Promise<R> {
		try {
			const response = await axiosInstance.get<R>(`${this.endpoint}/?${queryString}=${id}`, { headers })

			return response.data
		} catch (error) {
			throw error
		}
	}

	async getNoneParam(id: number): Promise<R> {
		try {
			const response = await axiosInstance.get<R>(`${this.endpoint}/${id}/`, { headers })

			return response.data
		} catch (error) {
			throw error
		}
	}

	async post(data: T): Promise<R> {
		try {
			const response = await axiosInstance.post<R>(this.endpoint, data, { headers })

			return response.data
		} catch (error) {
			throw error
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await axiosInstance.delete(`${this.endpoint}${id}`, { headers })
		} catch (error) {
			throw error
		}
	}

	async update(id: number, data: T): Promise<R> {
		try {
			const response = await axiosInstance.put<R>(`${this.endpoint}${id}/`, data, { headers })

			return response.data
		} catch (error) {
			throw error
		}
	}
}

export default ApiClientService
