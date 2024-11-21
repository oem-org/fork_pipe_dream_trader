import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

const storedToken = localStorage.getItem('user')
const token = storedToken ? JSON.parse(storedToken) : null

const getCsrfToken = () => {
  const value = ` ${document.cookie}`
  const parts = value.split(` csrftoken=`)
  if (parts.length === 2 ) return parts.pop().split('').shift()
}

const csrfToken = getCsrfToken()

// Define headers based on the token
const headers = token ? {
  'Content-Type': 'application/json',
  'Authorization': `Token ${token.token}`,
} : {
  'Content-Type': 'application/json',
  'X-CSRFToken': csrfToken,
}
// res.data is json
class ApiClient<T> {
  endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  getAll = () => {
    return axiosInstance.get<T[]>(this.endpoint, {headers}).then((res) => res.data)
  }


  get = (id: number, params?: any) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/${id}/`, { params, headers })
      .then((res) => res.data)
  }
  getSingleParam = (id: any, queryString:string) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/?${queryString}=${id}`, {headers })
      .then((res) => res.data)
  }
  getNoneParam = (id: number) => {
    return axiosInstance
      .get<T>(`${this.endpoint}/${id}/`, { headers })
      .then((res) => res.data)
  }
  post = (data: T) => {
    return axiosInstance.post<T>(this.endpoint, data, {headers}).then((res) => res.data)
  }

  delete = (id: number) => {
    return axiosInstance.delete(`${this.endpoint}${id}`,{headers})
  }

  update = (id: number, data: T) => {
    return axiosInstance
      .put(`${this.endpoint}${id}/`, data,{headers})
      .then((res) => res.data)
  }
}

export default ApiClient
