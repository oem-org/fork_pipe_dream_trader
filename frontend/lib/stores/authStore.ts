import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function _login(username: string, password: string) {
  console.log(API_URL + "auth/token/", "fucking token");
  return axios
    .post(API_URL + "auth/token/", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return true;
      }
      return false;
    })
    .catch(() => {
      return false;
    });
}

interface AuthStore {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;

  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!localStorage.getItem("user"), // !! converts value to a boolean
  login: async (username: string, password: string) => {
    const success = await _login(username, password);
    if (success) {
      set({ isAuthenticated: true });
    }
    return success;
  },
  logout: () => {
    console.log(localStorage.getItem('user'))
    localStorage.removeItem("user");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore
