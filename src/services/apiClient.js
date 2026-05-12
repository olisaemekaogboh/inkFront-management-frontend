import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: rawBaseUrl.replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ GET LANGUAGE FROM STORAGE (same key you used)
function getLanguage() {
  const lang = localStorage.getItem("language");
  return (lang || "EN").toUpperCase();
}

// ✅ REQUEST INTERCEPTOR (THIS IS THE FIX)
apiClient.interceptors.request.use(
  (config) => {
    const language = getLanguage();

    // attach to params (for GET requests)
    config.params = {
      ...(config.params || {}),
      language,
    };

    // also attach as header (optional but powerful)
    config.headers["Accept-Language"] = language;

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR (unchanged, just cleaned)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;
    const requestUrl = originalRequest.url || "";

    const isRefreshRequest = requestUrl.includes("/auth/refresh");
    const isLoginRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");
    const isCurrentUserRequest = requestUrl.includes("/auth/me");
    const isPublicRequest = requestUrl.includes("/public/");

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isLoginRequest &&
      !isCurrentUserRequest &&
      !isPublicRequest
    ) {
      originalRequest._retry = true;

      try {
        await apiClient.post("/auth/refresh");
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(new Error("Unauthorized"));
      }
    }

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
