import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

class ApiClientJson<T> {
  endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }
//axios parses the response
  getAll = () => {
    return axiosInstance.get<string[]>(this.endpoint).then((res) => res.data)
  }

  get = (id: number) => {
    return axiosInstance
      .get<string>(`${this.endpoint}/${id}`)
      .then((res) => JSON.parse(res.data))
  }

  post = (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data)
  }

  delete = (id: number) => {
    return axiosInstance.delete(`${this.endpoint}/${id}`)
  }

  update = (id: number, data: T) => {
    return axiosInstance
      .put(`${this.endpoint}/${id}`, data)
      .then((res) => res.data)
  }
}

export default ApiClientJson
