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

  const applyAuthPayload = useCallback((payload) => {
    const nextUser = extractUser(payload);
    const nextAuthenticated = extractAuthenticated(payload, nextUser);

    setUser(nextAuthenticated ? nextUser : null);
    setAuthenticated(nextAuthenticated);

    return nextAuthenticated ? nextUser : null;
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const payload = await authService.me();
      return applyAuthPayload(payload);
    } catch {
      setUser(null);
      setAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applyAuthPayload]);

  const login = useCallback(
    async (payload) => {
      setLoading(true);

      try {
        const response = await authService.login(payload);
        const nextUser = applyAuthPayload(response);

        setLoading(false);

        return {
          ...response,
          user: nextUser,
        };
      } catch (error) {
        setUser(null);
        setAuthenticated(false);
        setLoading(false);
        throw error;
      }
    },
    [applyAuthPayload],
  );

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
