import http from "./http";

function unwrap(response) {
  return (
    response?.data?.data ?? response?.data?.payload ?? response?.data ?? null
  );
}

function unwrapPage(response) {
  const root =
    response?.data?.data ?? response?.data?.payload ?? response?.data ?? {};

  return {
    content: Array.isArray(root?.content)
      ? root.content
      : Array.isArray(root)
        ? root
        : [],
    page: root?.number ?? root?.page ?? 0,
    size: root?.size ?? 12,
    totalElements: root?.totalElements ?? 0,
    totalPages: root?.totalPages ?? 0,
    empty: root?.empty ?? false,
  };
}

export const adminContactMessageApi = {
  async getMessages(params = {}) {
    const response = await http.get("/admin/contact-messages", { params });
    return unwrapPage(response);
  },

  async getStats() {
    const response = await http.get("/admin/contact-messages/stats");
    return unwrap(response);
  },

  async getMessage(id) {
    const response = await http.get(`/admin/contact-messages/${id}`);
    return unwrap(response);
  },

  async updateMessage(id, payload) {
    const response = await http.patch(`/admin/contact-messages/${id}`, payload);
    return unwrap(response);
  },

  async replyToMessage(id, payload) {
    const response = await http.post(
      `/admin/contact-messages/${id}/reply`,
      payload,
    );
    return unwrap(response);
  },

  async deleteMessage(id) {
    await http.delete(`/admin/contact-messages/${id}`);
    return true;
  },
};
