import axios from "axios"
import LoginFormRequest from "../../interfaces/requests/LoginFormRequest";
import CreateUserResponse from "../../interfaces/responses/CreateUserResponse";
import Token from "../../interfaces/Token";
import { creatUserApi } from "../apiClientInstances";
import { authUserApi } from "../apiClientInstances";

export default class AuthService {
	private static instance: AuthService

	private constructor() { }

	static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}

		return AuthService.instance;
	}

	async login(credentials: LoginFormRequest): Promise<Token> {

		const response = authUserApi.post(credentials)


		//return axios
		//	.post(import.meta.env.VITE_API_URL + "auth/token/", {
		//		username,
		//		password
		//	})
		//	.then(response => {
		//		if (response.data.token) {
		//			localStorage.setItem("user", JSON.stringify(response.data))
		//		}
		//
		//		return response.data
		//	})
	}

	async logout(): Promise<boolean> {
		try {
			localStorage.removeItem("user")
			return true
		} catch (error) {
			return false
		}
	}

	async createUser(email: string, password: string): Promise<CreateUserResponse> {

		const response = axios.post(import.meta.env.VITE_API_URL + "/auth/", {
			email,
			password
		})

		return response.data
	}

	async getCurrentUser() {
		const userStr = localStorage.getItem("user")

		if (userStr) return JSON.parse(userStr)

		return null
	}
}

