import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: rawBaseUrl.replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// GET LANGUAGE FROM STORAGE
function getLanguage() {
  const lang = localStorage.getItem("language");
  return (lang || "EN").toUpperCase();
}

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config) => {
    const language = getLanguage();

    config.params = {
      ...(config.params || {}),
      language,
    };

    config.headers["Accept-Language"] = language;

    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR - FIXED to preserve error response
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

    // For 401 on login/register, DON'T create a new error - just pass the original error
    if (
      status === 401 &&
      (isLoginRequest || requestUrl.includes("/auth/register"))
    ) {
      // Return the original error with full response data
      return Promise.reject(error);
    }

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
      } catch (refreshError) {
        // Return the refresh error
        return Promise.reject(refreshError);
      }
    }
   
    // For all other errors, pass the original error with response
    return Promise.reject(error);
  },
);
 console.log("API BASE URL =", import.meta.env.VITE_API_BASE_URL);
    console.log("Axios Base URL =", apiClient.defaults.baseURL);


export default apiClient;
