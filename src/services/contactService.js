import apiClient from "./apiClient";

export const contactService = {
  async submitContactForm(payload) {
    const response = await apiClient.post("/contact", payload);
    return response.data.data;
  },
};
