import CreateUserResponse from "../../interfaces/responses/CreateUserResponse";
import Token from "../../interfaces/Token";
import { createUserApi } from "../apiClientInstances";
import { authUserApi } from "../apiClientInstances";
import CreateUserFormRequest from "../../interfaces/requests/CreateUserFormRequest";

export default class AuthService {
	private static instance: AuthService

	private constructor() { }

	static getInstance(): AuthService {

		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}

		return AuthService.instance;
	}

	async login(credentials: FormData): Promise<Token> {
		return await authUserApi.post(credentials)
	}

	async logout(): Promise<boolean> {
		try {
			localStorage.removeItem("user")
			console.log("gg")
			return true
		} catch (error) {
			return false
		}
	}

	async createUser(user: CreateUserFormRequest): Promise<CreateUserResponse> {
		return await createUserApi.post(user)
	}

	async getCurrentUser() {
		const userStr = localStorage.getItem("user")

		if (userStr) return JSON.parse(userStr)

		return null
	}
}

