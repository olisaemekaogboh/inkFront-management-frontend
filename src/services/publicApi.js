import http from "./http";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from "../i18n/languages";

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

function getStoredLanguage() {
  return (
    localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
    localStorage.getItem("language") ||
    DEFAULT_LANGUAGE
  )
    .trim()
    .toUpperCase();
}

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

const withLanguage = (params = {}) => ({
  language: params.language || getStoredLanguage(),
  ...params,
});

export const publicApi = {
  async getServices(params = {}) {
    const response = await http.get("/public/services", {
      params: withLanguage(params),
    });
    return unwrapApiResponse(response);
  },

  async getServiceBySlug(slug, params = {}) {
    const response = await http.get(`/public/services/${slug}`, {
      params: withLanguage(params),
    });
    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  async getPortfolioProjects(params = {}) {
    const response = await http.get("/public/portfolio-projects", {
      params: withLanguage(params),
    });
    return unwrapApiResponse(response);
  },

  async getPortfolioProjectBySlug(slug, params = {}) {
    const response = await http.get(`/public/portfolio-projects/${slug}`, {
      params: withLanguage(params),
    });
    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  async getProductBlueprints(params = {}) {
    const response = await http.get("/public/product-blueprints", {
      params: withLanguage(params),
    });
    return unwrapPagedApiResponse(response);
  },

  async getProductBlueprintBySlug(slug, params = {}) {
    const response = await http.get(`/public/product-blueprints/${slug}`, {
      params: withLanguage(params),
    });
    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  async getTestimonials(params = {}) {
    const response = await http.get("/public/testimonials", {
      params: withLanguage(params),
    });
    return unwrapApiResponse(response);
  },

  async getClientLogos(params = {}) {
    try {
      const response = await http.get("/public/client-logos", {
        params: withLanguage(params),
      });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  async getHeroSections(params = {}) {
    try {
      const response = await http.get("/public/hero-sections", {
        params: withLanguage(params),
      });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  async getHomepageSections(params = {}) {
    try {
      const response = await http.get("/public/homepage-sections", {
        params: withLanguage(params),
      });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  async getFaqs(params = {}) {
    try {
      const response = await http.get("/public/faqs", {
        params: withLanguage(params),
      });
      return unwrapPagedApiResponse(response);
    } catch {
      return {
        content: [],
        page: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
        empty: true,
      };
    }
  },

  async getSiteSettings(params = {}) {
    try {
      const response = await http.get("/public/site-settings", {
        params: withLanguage(params),
      });
      return unwrapApiResponse(response);
    } catch {
      return {};
    }
  },

  async submitContactMessage(payload = {}, params = {}) {
    const response = await http.post("/public/contact-messages", payload, {
      params: withLanguage(params),
    });
    return unwrapApiResponse(response);
  },

  async subscribeNewsletter(payload = {}, params = {}) {
    const response = await http.post("/public/newsletter/subscribe", payload, {
      params: withLanguage(params),
    });
    return unwrapApiResponse(response);
  },
};
