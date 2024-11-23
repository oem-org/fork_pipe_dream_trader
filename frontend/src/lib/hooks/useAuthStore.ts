import { create } from "zustand";
import AuthService from "../services/AuthService";
import LoginFormRequest from "../../interfaces/requests/LoginFormRequest";
import CreateUserResponse from "../../interfaces/responses/CreateUserResponse";
import CreateUserFormRequest from "../../interfaces/requests/CreateUserFormRequest";
const authService = AuthService.getInstance();


interface AuthStore {
	isAuthenticated: boolean;
	login: (credentials: LoginFormRequest) => Promise<boolean>;
	createUser: () => CreateUserResponse
	logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
	// Initialize the authentication state based on stored user data
	isAuthenticated: !!authService.getCurrentUser(),

	createUser: async (request: CreateUserFormRequest) => {

		const userDetails = await authService.

	}

	login: async (credentials: LoginFormRequest) => {
		try {

			// Delegate login to AuthService
			const user = await authService.login(credentials: LoginFormRequest);

			if (user?.token) {
				set({ isAuthenticated: true });
				return true;
			}

			return false;
		} catch (error) {
			console.error("Login failed:", error);
			return false;
		}
	},

	logout: () => {
		// Delegate logout to AuthService
		authService.logout();
		set({ isAuthenticated: false });
	},
}));

export default useAuthStore;
