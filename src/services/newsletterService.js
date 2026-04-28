import http from "./http";
import { unwrapApiResponse, unwrapPagedApiResponse } from "./publicApi";

export const newsletterService = {
  async subscribe(payload) {
    const response = await http.post("/public/newsletter/subscribe", payload);
    return unwrapApiResponse(response);
  },

  async unsubscribe(token) {
    const response = await http.patch(
      `/public/newsletter/unsubscribe/${encodeURIComponent(token)}`,
    );
    return unwrapApiResponse(response);
  },

  async getSubscribers(params = {}) {
    const response = await http.get("/admin/newsletter/subscribers", {
      params,
    });
    return unwrapPagedApiResponse(response);
  },

  async getCampaigns(params = {}) {
    const response = await http.get("/admin/newsletter/campaigns", {
      params,
    });
    return unwrapPagedApiResponse(response);
  },

  async getCampaign(id) {
    const response = await http.get(`/admin/newsletter/campaigns/${id}`);
    return unwrapApiResponse(response);
  },

  async createCampaign(payload) {
    const response = await http.post("/admin/newsletter/campaigns", payload);
    return unwrapApiResponse(response);
  },

  async updateCampaign(id, payload) {
    const response = await http.put(
      `/admin/newsletter/campaigns/${id}`,
      payload,
    );
    return unwrapApiResponse(response);
  },

  async deleteCampaign(id) {
    await http.delete(`/admin/newsletter/campaigns/${id}`);
    return true;
  },

  async sendCampaign(id) {
    const response = await http.patch(`/admin/newsletter/campaigns/${id}/send`);
    return unwrapApiResponse(response);
  },

  async archiveCampaign(id) {
    const response = await http.patch(
      `/admin/newsletter/campaigns/${id}/archive`,
    );
    return unwrapApiResponse(response);
  },
};

export default newsletterService;
