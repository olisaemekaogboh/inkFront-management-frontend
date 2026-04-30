import apiClient from "./apiClient";

function unwrap(response) {
  return response?.data?.data ?? response?.data ?? null;
}

export const adminContentService = {
  async list(endpoint) {
    const response = await apiClient.get(endpoint);
    return unwrap(response) || [];
  },

  async create(endpoint, payload) {
    const response = await apiClient.post(endpoint, payload);
    return unwrap(response);
  },

  async update(endpoint, id, payload) {
    const response = await apiClient.put(`${endpoint}/${id}`, payload);
    return unwrap(response);
  },

  async remove(endpoint, id) {
    await apiClient.delete(`${endpoint}/${id}`);
  },
};
