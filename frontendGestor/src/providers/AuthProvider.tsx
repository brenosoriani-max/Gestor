import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { User } from '@/types';
import { authService } from '@/services';
import { jwtDecode } from 'jwt-decode';

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  role?: string;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        jwtDecode<DecodedToken>(token);
        // Load user data from API
        authService
          .getMe()
          .then(setUser)
          .catch(() => {
            localStorage.removeItem('token');
          })
          .finally(() => setLoading(false));
      } catch {
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: userData } = await authService.login({ email, password });
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    authService.logout();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
