import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

const STORAGE_KEY = '@tourist_safety_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          api.setAuthToken(parsed.token);
        }
        setUser(parsed);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const persistUser = useCallback(async (next) => {
    if (next) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (next.token) {
        api.setAuthToken(next.token);
      }
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
      api.setAuthToken(null);
    }
    setUser(next);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await api.login(email, password);
      const normalized = {
        userId: data.userId,
        name: data.name,
        nationality: data.nationality,
        token: data.token,
        email: data.email || email,
      };
      await persistUser(normalized);
    },
    [persistUser]
  );

  const register = useCallback(
    async ({ name, email, password, nationality }) => {
      const data = await api.register({ name, email, password, nationality });
      const normalized = {
        userId: data.userId,
        name: data.name,
        nationality: data.nationality,
        token: data.token,
        email: data.email || email,
      };
      await persistUser(normalized);
    },
    [persistUser]
  );

  const logout = useCallback(async () => {
    await persistUser(null);
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
