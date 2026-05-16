import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setAccessToken, setAuthenticated, logout: logoutStore } = useAuthStore();

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await authApi.register(name, email, password);
      setUser(result.user);
      setAccessToken(result.accessToken);
      setAuthenticated(true);
      return result;
    },
    [setUser, setAccessToken, setAuthenticated]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login(email, password);
      setUser(result.user);
      setAccessToken(result.accessToken);
      setAuthenticated(true);
      return result;
    },
    [setUser, setAccessToken, setAuthenticated]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with local logout even if API call fails
    }
    logoutStore();
  }, [logoutStore]);

  const refresh = useCallback(async () => {
    try {
      const result = await authApi.refresh();
      setAccessToken(result.accessToken);
      return result.accessToken;
    } catch (err) {
      logoutStore();
      throw err;
    }
  }, [setAccessToken, logoutStore]);

  const getCurrentUser = useCallback(async () => {
    try {
      const result = await authApi.getCurrentUser();
      setUser(result);
      return result;
    } catch (err) {
      logoutStore();
      throw err;
    }
  }, [setUser, logoutStore]);

  return {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    refresh,
    getCurrentUser,
  };
};
