import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: rawBaseUrl.replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function getLanguage() {
  const lang = localStorage.getItem("language");
  return (lang || "EN").toUpperCase();
}

// ---------------------------------------------------------
// Refresh coordination
// ---------------------------------------------------------
// Only ONE refresh request can run at a time.
//
// If five API requests receive 401 simultaneously:
//
// Request A ─┐
// Request B ─┤
// Request C ─┼──> ONE /auth/refresh request
// Request D ─┤
// Request E ─┘
//
// All five wait for the same promise.
// ---------------------------------------------------------
let refreshPromise = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = apiClient.post("/auth/refresh").finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

// ---------------------------------------------------------
// REQUEST INTERCEPTOR
// ---------------------------------------------------------

apiClient.interceptors.request.use(
  (config) => {
    const language = getLanguage();

    config.params = {
      ...(config.params || {}),
      language,
    };

    config.headers = config.headers || {};
    config.headers["Accept-Language"] = language;

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------
// RESPONSE INTERCEPTOR
// ---------------------------------------------------------

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

    const isLogoutRequest = requestUrl.includes("/auth/logout");

    const isPublicRequest = requestUrl.includes("/public/");

    // -----------------------------------------------------
    // Never refresh these requests
    // -----------------------------------------------------

    if (
      status !== 401 ||
      isRefreshRequest ||
      isLoginRequest ||
      isLogoutRequest ||
      isPublicRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // -----------------------------------------------------
    // Mark the original request so we don't create
    // an infinite 401 → refresh → retry loop.
    // -----------------------------------------------------

    originalRequest._retry = true;

    try {
      // Wait for the existing refresh request if another
      // API call is already refreshing the session.
      await refreshSession();

      // The backend has now replaced the HttpOnly cookies.
      // Retry the original request.
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh token is expired/revoked/invalid.
      //
      // Don't try to refresh again.
      // Let the authentication layer handle the logout.
      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
