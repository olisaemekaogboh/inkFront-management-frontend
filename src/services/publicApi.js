import http from "./http";

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/* =========================================
   RESPONSE HELPERS
========================================= */

export const unwrapApiResponse = (response) => {
  const root = response?.data ?? response ?? null;

  if (Array.isArray(root)) return root;

  if (!isObject(root)) return [];

  const data = root.data ?? root.payload ?? root.result ?? root;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(root?.content)) return root.content;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(root?.items)) return root.items;

  if (isObject(data)) return data;

  return [];
};

export const unwrapPagedApiResponse = (response) => {
  const root = response?.data ?? response ?? null;
  const data = root?.data ?? root?.payload ?? root ?? null;

  if (Array.isArray(data)) {
    return {
      content: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: 1,
      empty: data.length === 0,
    };
  }

  if (Array.isArray(data?.content)) {
    return {
      content: data.content,
      page: data.page ?? data.number ?? 0,
      size: data.size ?? data.content.length,
      totalElements: data.totalElements ?? data.content.length,
      totalPages: data.totalPages ?? 1,
      empty: data.empty ?? data.content.length === 0,
    };
  }

  if (Array.isArray(root?.content)) {
    return {
      content: root.content,
      page: root.page ?? root.number ?? 0,
      size: root.size ?? root.content.length,
      totalElements: root.totalElements ?? root.content.length,
      totalPages: root.totalPages ?? 1,
      empty: root.empty ?? root.content.length === 0,
    };
  }

  return {
    content: [],
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    empty: true,
  };
};

/* =========================================
   PUBLIC API
========================================= */

export const publicApi = {
  /* SERVICES */
  async getServices(params = {}) {
    const response = await http.get("/public/services", { params });
    return unwrapApiResponse(response);
  },

  async getServiceBySlug(slug, params = {}) {
    const response = await http.get(`/public/services/${slug}`, { params });
    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  /* PORTFOLIO */
  async getPortfolioProjects(params = {}) {
    const response = await http.get("/public/portfolio-projects", { params });
    // response.data = { success, message, data: [...] }
    return response.data?.data ?? [];
  },

  async getPortfolioProjectBySlug(slug, params = {}) {
    const response = await http.get(`/public/portfolio-projects/${slug}`, {
      params,
    });
    // response.data = { success, message, data: {...} }
    return response.data?.data ?? null;
  },

  /* PRODUCTS */
  async getProductBlueprints(params = {}) {
    const response = await http.get("/public/product-blueprints", { params });
    return unwrapPagedApiResponse(response);
  },

  async getProductBlueprintBySlug(slug, params = {}) {
    const response = await http.get(`/public/product-blueprints/${slug}`, {
      params,
    });
    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  /* TESTIMONIALS */
  async getTestimonials(params = {}) {
    const response = await http.get("/public/testimonials", { params });
    return unwrapApiResponse(response);
  },

  /* CLIENT LOGOS */
  async getClientLogos(params = {}) {
    try {
      const response = await http.get("/public/client-logos", { params });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  /* HERO */
  async getHeroSections(params = {}) {
    try {
      const response = await http.get("/public/hero-sections", { params });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  /* HOMEPAGE */
  async getHomepageSections(params = {}) {
    try {
      const response = await http.get("/public/homepage-sections", { params });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  /* FAQ */
  async getFaqs(params = {}) {
    try {
      const response = await http.get("/public/faqs", { params });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  /* SITE SETTINGS */
  async getSiteSettings(params = {}) {
    try {
      const response = await http.get("/public/site-settings", { params });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  /* CONTACT FORM */
  async submitContactMessage(payload = {}) {
    const response = await http.post("/public/contact-messages", payload);
    return unwrapApiResponse(response);
  },

  /* NEWSLETTER */
  async subscribeNewsletter(payload = {}) {
    const response = await http.post("/public/newsletter/subscribe", payload);
    return unwrapApiResponse(response);
  },
};
