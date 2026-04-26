import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const DEFAULT_LANGUAGE = import.meta.env.VITE_DEFAULT_LANGUAGE || "EN";

const http = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(csrfToken);
  }

  const url = config.url || "";

  if (url.startsWith("/api/public/")) {
    config.params = {
      language: DEFAULT_LANGUAGE,
      ...(config.params || {}),
    };
  }

  return config;
});

export default http;
