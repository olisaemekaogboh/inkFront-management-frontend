import apiClient from "./apiClient";

export const authService = {
  async bootstrapCsrf() {
    const response = await apiClient.get("/auth/csrf");
    return response.data.data;
  },

  async register(payload) {
    const response = await apiClient.post("/auth/register", payload);
    return response.data.data;
  },

  async login(payload) {
    const response = await apiClient.post("/auth/login", payload);
    return response.data.data;
  },

  async logout() {
    const response = await apiClient.post("/auth/logout");
    return response.data.data;
  },

  async refresh() {
    const response = await apiClient.post("/auth/refresh");
    return response.data.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },

  async getAdminHealth() {
    const response = await apiClient.get("/admin/health");
    return response.data.data;
  },
};
