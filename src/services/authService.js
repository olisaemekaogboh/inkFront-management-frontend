import apiClient from "./apiClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

export const authService = {
  async me() {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  async login(payload) {
    const response = await apiClient.post("/auth/login", payload);
    return response.data;
  },

  async register(payload) {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  async refresh() {
    const response = await apiClient.post("/auth/refresh");
    return response.data;
  },

  async logout() {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  getGoogleLoginUrl() {
    return `${BACKEND_ORIGIN}/oauth2/authorization/google`;
  },
};
