import apiClient from "./apiClient";

export const heroService = {
  async getHeroSections(params = {}) {
    try {
      const response = await apiClient.get("/public/hero-sections", {
        params: {
          language: params.language || "EN",
          placement: params.placement || "HOME",
          featuredOnly: params.featuredOnly || false,
        },
      });

      return response.data;
    } catch (error) {
      return { success: false, data: [] };
    }
  },
};
