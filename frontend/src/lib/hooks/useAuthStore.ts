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
		if (user) {
			set({ isAuthenticated: true });

			return true;
		}
		else {
			return false
		}

	},

	logout: () => {
		console.log(authService.logout());
		set({ isAuthenticated: false });
	},
}));

export default useAuthStore;
