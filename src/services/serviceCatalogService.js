import apiClient from "./apiClient";

export const serviceCatalogService = {
  async getServices(params = {}) {
    const response = await apiClient.get("/public/services", { params });
    return response.data.data;
  },

  async getServiceBySlug(slug, params = {}) {
    const response = await apiClient.get(`/public/services/${slug}`, {
      params,
    });
    return response.data.data;
  },
};
