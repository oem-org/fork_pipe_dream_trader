import axios from "axios"



class AuthService {
  login(email: string, password: string) {
    console.log(import.meta.env.VITE_API_URL + "user/login/","fucking token")
    return axios
      .post(import.meta.env.VITE_API_URL + "user/login/", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data))
        }
        return response.data
      })
  }

  logout() {
    localStorage.removeItem("user")
  }

  register(email: string, password: string) {
    return axios.post(import.meta.env.VITE_API_URL + "/api/user/create/", {
      email,
      password
    })
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user")
    if (userStr) return JSON.parse(userStr)

    return null
  }
}

export default new AuthService()