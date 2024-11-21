import axios from 'axios'
import authHeader from './authHeader'

const API_URL = 'http://127.0.0.1:8000/api/'

class UserService {
//   getPublicContent() {
//     return axios.get(API_URL + 'all')
//   }

  getUserBoard() {
    return axios.get(API_URL + 'user/me', { headers: authHeader() })
  }

//   getModeratorBoard() {
//     return axios.get(API_URL + 'mod', { headers: authHeader() })
//   }

//   getAdminBoard() {
//     return axios.get(API_URL + 'admin', { headers: authHeader() })
//   }
}

export default new UserService()