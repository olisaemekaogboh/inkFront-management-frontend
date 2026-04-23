import apiClient from "./apiClient";

export const siteSettingService = {
  async getPublicSettings(params = {}) {
    const response = await apiClient.get("/public/site-settings", { params });
    return response.data.data;
  },
};
