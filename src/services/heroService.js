import apiClient from "./apiClient"; // Make sure this path is correct

export const heroService = {
  async getHeroSections(params = {}) {
    try {
      console.log("Fetching hero sections with params:", params);

      const response = await apiClient.get("/public/hero-sections", {
        params: {
          language: params.language || "EN",
          placement: params.placement || "HOME",
          featuredOnly: params.featuredOnly || false,
        },
      });

      console.log("Hero API Full Response:", response);
      console.log("Response data:", response.data);

      // Return the full response data
      return response.data;
    } catch (error) {
      console.error("Failed to fetch hero sections:", error);
      console.error("Error details:", error.response?.data || error.message);
      return { success: false, data: [] };
    }
  },
};
