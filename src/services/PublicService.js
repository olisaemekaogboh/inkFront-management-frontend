import http from "./http";

const DEFAULT_LANGUAGE = "ENGLISH";

const unwrapApiResponse = (response) => {
  const payload = response?.data;

  if (payload?.data !== undefined) {
    return payload.data;
  }

  return payload;
};

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.content)) {
    return value.content;
  }

  if (Array.isArray(value?.items)) {
    return value.items;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
};

const withLanguage = (params = {}) => ({
  language: params.language || DEFAULT_LANGUAGE,
  ...params,
});

export const publicService = {
  async getServices(params = {}) {
    const response = await http.get("/api/public/services", {
      params: withLanguage(params),
    });

    return normalizeList(unwrapApiResponse(response));
  },

  async getPortfolioProjects(params = {}) {
    const response = await http.get("/api/public/portfolio-projects", {
      params: withLanguage(params),
    });

    return unwrapApiResponse(response);
  },

  async getPortfolioProjectBySlug(slug, params = {}) {
    const response = await http.get(`/api/public/portfolio-projects/${slug}`, {
      params: withLanguage(params),
    });

    return unwrapApiResponse(response);
  },

  async getProductBlueprints(params = {}) {
    const response = await http.get("/api/public/product-blueprints", {
      params: withLanguage(params),
    });

    return unwrapApiResponse(response);
  },

  async getProductBlueprintBySlug(slug, params = {}) {
    const response = await http.get(`/api/public/product-blueprints/${slug}`, {
      params: withLanguage(params),
    });

    return unwrapApiResponse(response);
  },

  async getTestimonials(params = {}) {
    const response = await http.get("/api/public/testimonials", {
      params: withLanguage(params),
    });

    return normalizeList(unwrapApiResponse(response));
  },

  async getHomepageSections(params = {}) {
    const response = await http.get("/api/public/homepage-sections", {
      params: withLanguage(params),
    });

    return normalizeList(unwrapApiResponse(response));
  },

  async getClientLogos(params = {}) {
    const response = await http.get("/api/public/client-logos", {
      params: withLanguage(params),
    });

    return normalizeList(unwrapApiResponse(response));
  },

  normalizeList,
  unwrapApiResponse,
};
