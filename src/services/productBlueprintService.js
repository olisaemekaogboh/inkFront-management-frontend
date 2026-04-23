import apiClient from "./apiClient";

export const productBlueprintService = {
  async getProductBlueprints(params = {}) {
    const response = await apiClient.get("/public/product-blueprints", {
      params,
    });
    return response.data.data;
  },

  async getProductBlueprintBySlug(slug, params = {}) {
    const response = await apiClient.get(`/public/product-blueprints/${slug}`, {
      params,
    });
    return response.data.data;
  },
};
