// contexts/AuthContext.js
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

const extractUser = (payload) => {
  if (!payload) return null;

  // Your backend returns { success, authenticated, data }
  if (payload.data) return payload.data;
  if (payload.user) return payload.user;

  return null;
};

const extractAuthenticated = (payload) => {
  if (!payload) return false;

  // Your backend returns authenticated flag
  if (payload.authenticated === true) return true;

  return false;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [googleLoginAvailable] = useState(true);

  const applyAuthPayload = useCallback((payload) => {
    const nextUser = extractUser(payload);
    const nextAuthenticated = extractAuthenticated(payload);

    setUser(nextAuthenticated ? nextUser : null);
    setAuthenticated(nextAuthenticated);

    return nextAuthenticated ? nextUser : null;
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const payload = await authService.me();
      const user = applyAuthPayload(payload);
      return user;
    } catch (error) {
      console.error("Refresh user error:", error);
      setUser(null);
      setAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applyAuthPayload]);
  const login = useCallback(async (payload) => {
    setLoading(true);

    try {
      const response = await authService.login(payload);
      console.log("Login response in AuthContext:", response);

      // Extract user from response
      const nextUser = extractUser(response);
      const nextAuthenticated = extractAuthenticated(response);

      console.log("Extracted user:", nextUser);
      console.log("Extracted authenticated:", nextAuthenticated);

      setUser(nextAuthenticated ? nextUser : null);
      setAuthenticated(nextAuthenticated);

      setLoading(false);

      return {
        ...response,
        user: nextUser,
      };
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });

      setUser(null);
      setAuthenticated(false);
      setLoading(false);

      // Re-throw the error so the LoginPage can handle it
      throw error;
    }
  }, []);

  const register = useCallback(
    async (payload) => {
      setLoading(true);

      try {
        const response = await authService.register(payload);
        const nextUser = applyAuthPayload(response);

        setLoading(false);

        return {
          ...response,
          user: nextUser,
        };
      } catch (error) {
        console.error("Register error in AuthContext:", error);
        setUser(null);
        setAuthenticated(false);
        setLoading(false);
        throw error;
      }
    },
    [applyAuthPayload],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAuthenticated(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  const value = useMemo(
    () => ({
      user,
      authenticated,
      isAuthenticated: authenticated,
      loading,
      googleLoginAvailable,
      login,
      register,
      logout,
      refreshCurrentUser,
    }),
    [
      user,
      authenticated,
      loading,
      googleLoginAvailable,
      login,
      register,
      logout,
      refreshCurrentUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
