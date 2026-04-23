import apiClient from "./apiClient";

export const testimonialService = {
  async getTestimonials(params = {}) {
    const response = await apiClient.get("/public/testimonials", { params });
    return response.data.data;
  },
};
