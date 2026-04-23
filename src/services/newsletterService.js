import apiClient from "./apiClient";

export const newsletterService = {
  async subscribe(payload) {
    const response = await apiClient.post("/newsletter/subscribe", payload);
    return response.data.data;
  },
};
