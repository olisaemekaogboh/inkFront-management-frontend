// services/authService.js
import apiClient from "./apiClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");

export const authService = {
  async me() {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("me() error:", error);
      throw error;
    }
  },

  async login(payload) {
    try {
      const response = await apiClient.post("/auth/login", payload);
      console.log("Login response status:", response.status);
      console.log("Login response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("Login API error - status:", error.response?.status);
      console.error("Login API error - data:", error.response?.data);
      // Re-throw the original error so the LoginPage can access error.response
      throw error;
    }
  },

  async register(payload) {
    try {
      const response = await apiClient.post("/auth/register", payload);
      return response.data;
    } catch (error) {
      console.error("Register API error:", error);
      throw error;
    }
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
