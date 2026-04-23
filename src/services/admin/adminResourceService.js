import apiClient from "../apiClient";

function normalizePageResponse(data) {
  if (Array.isArray(data)) {
    return {
      content: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: 1,
      first: true,
      last: true,
    };
  }

  return {
    content: data?.content || [],
    page: data?.page ?? 0,
    size: data?.size ?? 10,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    first: data?.first ?? true,
    last: data?.last ?? true,
  };
}

function createAdminCrudService(basePath) {
  return {
    async list(params = {}) {
      const response = await apiClient.get(basePath, { params });
      return normalizePageResponse(response.data.data);
    },

    async getById(id) {
      const response = await apiClient.get(`${basePath}/${id}`);
      return response.data.data;
    },

    async create(payload) {
      const response = await apiClient.post(basePath, payload);
      return response.data.data;
    },

    async update(id, payload) {
      const response = await apiClient.put(`${basePath}/${id}`, payload);
      return response.data.data;
    },

    async remove(id) {
      const response = await apiClient.delete(`${basePath}/${id}`);
      return response.data.data;
    },
  };
}

export const adminDashboardService = {
  async getOverview() {
    const response = await apiClient.get("/admin/dashboard/overview");
    return response.data.data;
  },
};

export const adminServicesService = createAdminCrudService("/admin/services");
export const adminPortfolioProjectsService = createAdminCrudService(
  "/admin/portfolio-projects",
);
export const adminProductBlueprintsService = createAdminCrudService(
  "/admin/product-blueprints",
);
export const adminTestimonialsService = createAdminCrudService(
  "/admin/testimonials",
);
export const adminClientLogosService = createAdminCrudService(
  "/admin/client-logos",
);
export const adminHomepageSectionsService = createAdminCrudService(
  "/admin/homepage-sections",
);
export const adminContactSubmissionsService = createAdminCrudService(
  "/admin/contact-submissions",
);
export const adminNewsletterSubscribersService = createAdminCrudService(
  "/admin/newsletter-subscribers",
);
export const adminTranslationsService = createAdminCrudService(
  "/admin/translations",
);
export const adminSiteSettingsService = createAdminCrudService(
  "/admin/site-settings",
);
export const adminNavigationItemsService = createAdminCrudService(
  "/admin/navigation-items",
);
export const adminSocialLinksService = createAdminCrudService(
  "/admin/social-links",
);
export const adminMediaAssetsService = createAdminCrudService(
  "/admin/media-assets",
);
export const adminFaqItemsService = createAdminCrudService("/admin/faqs");
export const adminCategoriesService =
  createAdminCrudService("/admin/categories");
