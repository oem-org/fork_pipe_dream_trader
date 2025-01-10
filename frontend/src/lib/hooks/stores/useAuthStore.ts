import { create } from "zustand";
import AuthService from "@/lib/services/AuthService";
import CreateUserFormRequest from "@/interfaces/requests/CreateUserFormRequest";
import { QueryClient } from "@tanstack/react-query";

// Inspired by earlier work
// https://github.com/JeppeOEM/dashboard_frontend_exam/blob/main/src/stores/authStore.ts

const authService = AuthService.getInstance();

interface AuthStore {
	isAuthenticated: boolean;
	login: (credentials: FormData) => Promise<boolean>;
	createUser: (user: CreateUserFormRequest) => Promise<boolean>
	logout: (queryClient: QueryClient) => void;
	checkAuth: () => Promise<boolean>;
}

const useAuthStore = create<AuthStore>((set) => ({
	isAuthenticated: false,

	checkAuth: async (): Promise<boolean> => {
		const user = await authService.getCurrentUser();
		const isAuthenticated = !!user;
		set({ isAuthenticated });
		return isAuthenticated;
	},

	createUser: async (user: CreateUserFormRequest): Promise<boolean> => {
		const userDetail = await authService.createUser(user);
		if (userDetail) {
			set({ isAuthenticated: true });
			return true;
		}
		return false;
	},

	login: async (credentials: FormData): Promise<boolean> => {
		const user = await authService.login(credentials);
		if (user) {
			set({ isAuthenticated: true });
			return true;
		}
		return false;
	},

	logout: async (queryClient: QueryClient) => {
		queryClient.clear()
		await authService.logout();
		set({ isAuthenticated: false });
		window.location.reload();
	},
}));

export default useAuthStore;
