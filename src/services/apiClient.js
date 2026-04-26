import axios from "axios";

function getCookieValue(name) {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: rawBaseUrl.replace(/\/$/, ""),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

async function ensureCsrfToken() {
  let token = getCookieValue("XSRF-TOKEN");

  if (!token) {
    await apiClient.get("/csrf");
    token = getCookieValue("XSRF-TOKEN");
  }

  return token;
}

apiClient.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();

  if (["post", "put", "patch", "delete"].includes(method)) {
    const csrfToken = await ensureCsrfToken();

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  return config;
});

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
    const isCsrfRequest = requestUrl.includes("/csrf");

    if (
      status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      !isLoginRequest &&
      !isCurrentUserRequest &&
      !isPublicRequest &&
      !isCsrfRequest
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
