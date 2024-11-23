import axios from "axios"
import LoginFormRequest from "../../interfaces/requests/LoginFormRequest";

export default class AuthService {
	private static instance: AuthService

	private constructor() {

	}

	static getInstance() {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	async login(credentials: LoginFormRequest) {
		{ username, password } = credentials
		console.log(import.meta.env.VITE_API_URL + "user/login/", "fucking token")
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

	async logout() {
		localStorage.removeItem("user")
	}

	async register(email: string, password: string) {
		return axios.post(import.meta.env.VITE_API_URL + "/api/user/create/", {
			email,
			password
		})
	}

	async getCurrentUser() {
		const userStr = localStorage.getItem("user")
		if (userStr) return JSON.parse(userStr)

		return null
	}
}

