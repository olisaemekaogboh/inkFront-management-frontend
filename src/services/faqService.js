import { publicApi } from "./publicApi";

const normalizeLanguage = (language) => language || "EN";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const faqService = {
  async getFaqItems({
    language = "EN",
    pageKey = "ABOUT",
    page = 0,
    size = 8,
  } = {}) {
    if (typeof publicApi.getFaqs === "function") {
      return publicApi.getFaqs({
        language: normalizeLanguage(language),
        pageKey,
        page,
        size,
      });
    }

    const params = new URLSearchParams({
      language: normalizeLanguage(language),
      pageKey,
      page: String(page),
      size: String(size),
    });

    const response = await fetch(
      `${API_BASE_URL}/api/public/faqs?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to load FAQs");
    }

    return response.json();
  },
};
