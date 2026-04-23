import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const bootstrapAuth = useCallback(async () => {
    try {
      await authService.bootstrapCsrf();
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // This is expected for guests who are not logged in.
      setUser(null);
    } finally {
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = useCallback(async (payload) => {
    await authService.bootstrapCsrf();
    const response = await authService.login(payload);
    setUser(response.user);
    return response;
  }, []);

  const register = useCallback(async (payload) => {
    await authService.bootstrapCsrf();
    const response = await authService.register(payload);
    setUser(response.user);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.bootstrapCsrf();
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const value = useMemo(() => {
    const roles = user?.roles || [];

    return {
      user,
      authChecking,
      isAuthenticated: Boolean(user),
      roles,
      isAdmin: roles.includes("ROLE_ADMIN"),
      login,
      register,
      logout,
      refreshProfile,
      setUser,
      bootstrapAuth,
    };
  }, [
    user,
    authChecking,
    login,
    register,
    logout,
    refreshProfile,
    bootstrapAuth,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
