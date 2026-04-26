import apiClient from "./apiClient";

export const adminContentService = {
  async list(endpoint) {
    const response = await apiClient.get(endpoint);
    return response.data?.data || response.data || [];
  },

  async create(endpoint, payload) {
    const response = await apiClient.post(endpoint, payload);
    return response.data?.data || response.data;
  },

  async update(endpoint, id, payload) {
    const response = await apiClient.put(`${endpoint}/${id}`, payload);
    return response.data?.data || response.data;
  },

  async remove(endpoint, id) {
    await apiClient.delete(`${endpoint}/${id}`);
  },
};
