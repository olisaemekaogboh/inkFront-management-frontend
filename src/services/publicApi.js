import http from "./http";

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const unwrapApiResponse = (response) => {
  const root = response?.data ?? response ?? null;

  if (Array.isArray(root)) {
    return root;
  }

  if (!isObject(root)) {
    return [];
  }

  const data = root.data ?? root.payload ?? root.result ?? root;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(root?.content)) {
    return root.content;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(root?.items)) {
    return root.items;
  }

  if (isObject(data)) {
    return data;
  }

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

export const publicApi = {
  async getServices(params = {}) {
    const response = await http.get("/public/services", { params });
    return unwrapApiResponse(response);
  },

  async getPortfolioProjects(params = {}) {
    const response = await http.get("/public/portfolio-projects", {
      params,
    });
    return unwrapPagedApiResponse(response);
  },

  async getPortfolioProjectBySlug(slug, params = {}) {
    const response = await http.get(`/public/portfolio-projects/${slug}`, {
      params,
    });

    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  async getProductBlueprints(params = {}) {
    const response = await http.get("/public/product-blueprints", {
      params,
    });

    return unwrapPagedApiResponse(response);
  },

  async getProductBlueprintBySlug(slug, params = {}) {
    const response = await http.get(`/public/product-blueprints/${slug}`, {
      params,
    });

    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  async getTestimonials(params = {}) {
    const response = await http.get("/public/testimonials", { params });
    return unwrapApiResponse(response);
  },

  async getClientLogos(params = {}) {
    try {
      const response = await http.get("/public/client-logos", { params });
      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  async getHomepageSections(params = {}) {
    try {
      const response = await http.get("/public/homepage-sections", {
        params,
      });

      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },

  async getHeroSections(params = {}) {
    try {
      const response = await http.get("/public/hero-sections", {
        params,
      });

      return unwrapApiResponse(response);
    } catch {
      return [];
    }
  },
};
