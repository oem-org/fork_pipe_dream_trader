import { create } from "zustand";
import AuthService from "../services/AuthService";
import LoginFormRequest from "../../interfaces/requests/LoginFormRequest";
import CreateUserFormRequest from "../../interfaces/requests/CreateUserFormRequest";


const authService = AuthService.getInstance();

interface AuthStore {
	isAuthenticated: boolean;
	login: (credentials: LoginFormRequest) => Promise<boolean>;
	createUser: (user: CreateUserFormRequest) => Promise<boolean>
	logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
	// Initialize the authentication state based on stored user data
	isAuthenticated: !!authService.getCurrentUser(),

	createUser: async (user: CreateUserFormRequest): Promise<boolean> => {

		const userDetail = await authService.createUser(user)

		if (userDetail) {
			set({ isAuthenticated: true });

			return true;
		}
		else {
			return false
		}
	},

	login: async (credentials: LoginFormRequest): Promise<boolean> => {

		const user = await authService.login(credentials);

		if (user) {
			set({ isAuthenticated: true });

			return true;
		}
		else {
			return false
		}

	},

	logout: () => {
		// Delegate logout to AuthService
		authService.logout();
		set({ isAuthenticated: false });
	},
}));

export default useAuthStore;
