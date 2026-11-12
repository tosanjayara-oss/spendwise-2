import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService, { AuthSession, LoginCredentials, RegisterCredentials } from '../services/authService';

interface AuthContextType {
  session: AuthSession | null;
  user: AuthSession['user'] | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  fillDemoCredentials: () => LoginCredentials;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => authService.getStoredSession());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const active = await authService.getCurrentUser();
        setSession(active);
      } catch (err) {
        console.error('Failed checking auth session:', err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const newSession = await authService.login(credentials);
      setSession(newSession);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const newSession = await authService.register(credentials);
      setSession(newSession);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fillDemoCredentials = useCallback((): LoginCredentials => {
    return {
      email: 'demo@spendwise.com',
      password: 'SpendWise123',
      rememberMe: true
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session ? session.user : null,
        isAuthenticated: !!session,
        loading,
        login,
        register,
        logout,
        fillDemoCredentials
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
