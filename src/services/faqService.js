import apiClient from "./apiClient";

export const faqService = {
  async getFaqItems(params = {}) {
    const response = await apiClient.get("/public/faqs", { params });
    return response.data.data;
  },
};
