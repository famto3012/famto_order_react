import { create } from "zustand"; // ✅ Use named import


export const useAuthStore = create((set) => ({
  token: localStorage.getItem("authToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  setToken: (token) => {
    localStorage.setItem("authToken", token);
    set({ token });
  },
  setRefreshToken: (refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);
    set({ refreshToken });
  },
}));
