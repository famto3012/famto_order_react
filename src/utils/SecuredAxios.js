import axios from "axios";
import { jwtDecode } from "jwt-decode";
import BASE_URL from "../BaseURL";
import { useAuthStore } from "./store";

const securedAxios = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshingToken = false;
let requestQueue = [];

const processQueue = (error, token = null) => {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  requestQueue = [];
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime < 60; // token about to expire
  } catch (err) {
    return true;
  }
};

const refreshAccessToken = async () => {
  const state = useAuthStore.getState();
  const refreshToken = state.refreshToken;

  if (!refreshToken) {
    console.log("Refresh Token",refreshToken);
    return null;
  }

  if (isRefreshingToken) {
    return new Promise((resolve, reject) => {
      requestQueue.push({ resolve, reject });
    });
  }

  isRefreshingToken = true;

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { newToken, newRefreshToken } = response.data;

    state.setToken(newToken);
    if (newRefreshToken) state.setRefreshToken(newRefreshToken);
    console.log("Refresh Token updated");
    processQueue(null, newToken);
    return newToken;
  } catch (err) {
    processQueue(err, null);
    return null;
  } finally {
    isRefreshingToken = false;
  }
};

securedAxios.interceptors.request.use(
  async (config) => {
    const { token } = useAuthStore.getState();

    if (token) {
      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${newToken}`,
          };
        }
      } else {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

securedAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return securedAxios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default securedAxios;
