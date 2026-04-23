import apiClient from "./apiClient";

export const heroService = {
  async getHeroSections(params = {}) {
    const response = await apiClient.get("/public/hero-sections", { params });
    return response.data.data;
  },
};
