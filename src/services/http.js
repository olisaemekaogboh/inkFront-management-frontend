import axios from "axios";
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from "../i18n/languages";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const http = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function getStoredLanguage() {
  return (
    localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
    localStorage.getItem("language") ||
    DEFAULT_LANGUAGE
  )
    .trim()
    .toUpperCase();
}

function isPublicEndpoint(url = "") {
  return url.startsWith("/public/") || url.startsWith("/api/public/");
}

http.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
  }

  if (isPublicEndpoint(config.url || "")) {
    config.params = {
      language: getStoredLanguage(),
      ...(config.params || {}),
    };
  }

  return config;
});

export default http;
