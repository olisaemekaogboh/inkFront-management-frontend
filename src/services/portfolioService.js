import apiClient from "./apiClient";

export const portfolioService = {
  async getProjects(params = {}) {
    const response = await apiClient.get("/public/portfolio-projects", {
      params,
    });
    return response.data.data;
  },

  async getProjectBySlug(slug, params = {}) {
    const response = await apiClient.get(`/public/portfolio-projects/${slug}`, {
      params,
    });
    return response.data.data;
  },
};
