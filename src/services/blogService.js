import http from "./http";
import { unwrapApiResponse, unwrapPagedApiResponse } from "./publicApi";

const withLanguage = (params = {}) => ({
  language: params.language || "EN",
  ...params,
});

export const blogService = {
  async getPublishedPosts(params = {}) {
    const response = await http.get("/public/blog-posts", {
      params: withLanguage(params),
    });

    return unwrapPagedApiResponse(response);
  },

  async getFeaturedPosts(params = {}) {
    const response = await http.get("/public/blog-posts/featured", {
      params: withLanguage(params),
    });

    return unwrapApiResponse(response);
  },

  async getPostBySlug(slug, params = {}) {
    const response = await http.get(`/public/blog-posts/slug/${slug}`, {
      params: withLanguage(params),
    });

    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  async getPostsByCategory(category, params = {}) {
    const response = await http.get(
      `/public/blog-posts/category/${encodeURIComponent(category)}`,
      {
        params: withLanguage(params),
      },
    );

    return unwrapPagedApiResponse(response);
  },

  async getPostsByTag(tag, params = {}) {
    const response = await http.get(
      `/public/blog-posts/tag/${encodeURIComponent(tag)}`,
      {
        params: withLanguage(params),
      },
    );

    return unwrapPagedApiResponse(response);
  },

  async getAdminPosts(params = {}) {
    const response = await http.get("/admin/blog-posts", { params });
    return unwrapPagedApiResponse(response);
  },

  async getAdminPost(id) {
    const response = await http.get(`/admin/blog-posts/${id}`);
    const data = unwrapApiResponse(response);
    return Array.isArray(data) ? null : data;
  },

  async createPost(payload) {
    const response = await http.post("/admin/blog-posts", payload);
    return unwrapApiResponse(response);
  },

  async updatePost(id, payload) {
    const response = await http.put(`/admin/blog-posts/${id}`, payload);
    return unwrapApiResponse(response);
  },

  async deletePost(id) {
    await http.delete(`/admin/blog-posts/${id}`);
    return true;
  },

  async publishPost(id) {
    const response = await http.patch(`/admin/blog-posts/${id}/publish`);
    return unwrapApiResponse(response);
  },

  async unpublishPost(id) {
    const response = await http.patch(`/admin/blog-posts/${id}/unpublish`);
    return unwrapApiResponse(response);
  },

  async archivePost(id) {
    const response = await http.patch(`/admin/blog-posts/${id}/archive`);
    return unwrapApiResponse(response);
  },
};

export default blogService;
