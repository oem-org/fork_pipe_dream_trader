import { create } from "zustand";
import AuthService from "../services/AuthService";
import CreateUserFormRequest from "../../interfaces/requests/CreateUserFormRequest";


const authService = AuthService.getInstance();

interface AuthStore {
	isAuthenticated: boolean;
	login: (credentials: FormData) => Promise<boolean>;
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

	login: async (credentials: FormData): Promise<boolean> => {

		const user = await authService.login(credentials);
		console.log(user, "LOGin")
		if (user) {
			set({ isAuthenticated: true });

			return true;
		}
		else {
			return false
		}

	},

	logout: () => {

		// Delegte logout to AuthService
		console.log(authService.logout());
		set({ isAuthenticated: false });
	},
}));

export default useAuthStore;
