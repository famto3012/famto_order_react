import { create } from "zustand"; // ✅ Use named import

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("authToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  setToken: (token) => {
    localStorage.setItem("authToken", token);
    set({ token });
  },
  setRefreshToken: (refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);
    set({ refreshToken });
  },
  clearAuth: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    set({ token: null, refreshToken: null });
  }
}));