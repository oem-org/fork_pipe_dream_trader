
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

//const storedToken = localStorage.getItem('user')
//const token = storedToken ? JSON.parse(storedToken) : null

//const getCsrfToken = () => {
//  const value = ` ${document.cookie}`
//  const parts = value.split(` csrftoken=`)
//  if (parts != undefined) {
//
//    if (parts.length === 2) return parts.pop().split('').shift()
//  }
//
//}
axiosInstance.interceptors.request.use((config) => {
  console.log("Request Headers:", config.headers);
  return config;
});
//const csrfToken = getCsrfToken()

const headers = {
  'Content-Type': 'application/json'
}

// Define headers based on the token
//const headers = token ? {
//  'Content-Type': 'application/json',
//  'Authorization': `Token ${token.token}`,
//} : {
//  'Content-Type': 'application/json',
//  'X-CSRFToken': csrfToken,
//}
// res.data is json
class ApiClient<T> {
  endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  getAll = async () => {
    return axiosInstance.get<T[]>(this.endpoint, { headers }).then((res) => res.data)
  }

  get = async (id: number, params?: any) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/${id}/`, { params, headers })
      .then((res) => res.data)
  }

  getSingleParam = async (id: any, queryString: string) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/?${queryString}=${id}`, { headers })
      .then((res) => res.data)
  }

  getNoneParam = async (id: number) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/${id}/`, { headers })
      .then((res) => res.data)
  }

  post = async (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data, { headers }).then((res) => res.data)
  }

  delete = async (id: number) => {
    return axiosInstance.delete(`${this.endpoint}${id}`, { headers })
  }

  update = async (id: number, data: T) => {
    return axiosInstance
      .put(`${this.endpoint}${id}/`, data, { headers })
      .then((res) => res.data)
  }
}

export default ApiClient
