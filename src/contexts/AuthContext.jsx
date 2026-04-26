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

  if (payload.user) return payload.user;
  if (payload.data?.user) return payload.data.user;
  if (payload.data && typeof payload.data === "object") return payload.data;

  return null;
};

const extractAuthenticated = (payload, user) => {
  if (!payload) return false;

  if (payload.authenticated === true) return true;
  if (payload.data?.authenticated === true) return true;

  return Boolean(user?.email || user?.id);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [googleLoginAvailable] = useState(true);

  const refreshCurrentUser = useCallback(async () => {
    setLoading(true);

    try {
      const payload = await authService.me();

      console.log("AUTH /me response:", payload);

      const nextUser = extractUser(payload);
      const nextAuthenticated = extractAuthenticated(payload, nextUser);

      setUser(nextAuthenticated ? nextUser : null);
      setAuthenticated(nextAuthenticated);

      return nextAuthenticated ? nextUser : null;
    } catch (error) {
      console.log("AUTH /me failed:", error?.response?.status, error?.message);

      setUser(null);
      setAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (payload) => {
      const response = await authService.login(payload);
      await refreshCurrentUser();
      return response;
    },
    [refreshCurrentUser],
  );

  const register = useCallback(
    async (payload) => {
      const response = await authService.register(payload);
      await refreshCurrentUser();
      return response;
    },
    [refreshCurrentUser],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
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
