import apiClient from "./apiClient";

export const clientLogoService = {
  async getClientLogos(params = {}) {
    const response = await apiClient.get("/public/client-logos", { params });
    return response.data.data;
  },
};
