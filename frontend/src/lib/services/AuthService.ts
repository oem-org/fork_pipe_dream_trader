import CreateUserResponse from "../../interfaces/responses/CreateUserResponse";
// import Token from "../../interfaces/Token";
import { createUserApi } from "../apiClientInstances";
import { authUserApi } from "../apiClientInstances";
import CreateUserFormRequest from "../../interfaces/requests/CreateUserFormRequest";
import axios from "axios";

export default class AuthService {
	private static instance: AuthService

	private constructor() { }

	static getInstance(): AuthService {

		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}

		return AuthService.instance;
	}

	async login(credentials: FormData): Promise<boolean> {
		try {
			const authInformation = await authUserApi.post(credentials);

			if (authInformation && authInformation.access_token) {
				localStorage.setItem("user", JSON.stringify(authInformation));
				console.log(authInformation);
				return true;
			}

			console.log("Authentication failed: No access token found");
			return false;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Login failed with status:", error.response?.status);
				console.error("Error details:", error.response?.data);
			} else {
				console.error("Login failed with an unexpected error:", error);
			}
			return false;
		}
	}

	async logout(): Promise<boolean> {
		try {
			localStorage.removeItem("user")
			return true
		} catch (error) {
			return false
		}
	}

	async createUser(user: CreateUserFormRequest): Promise<CreateUserResponse | undefined> {
		return await createUserApi.post(user)
	}

	async getCurrentUser() {
		const userStr = localStorage.getItem("user")

		if (userStr) return JSON.parse(userStr)

		return null
	}
}

