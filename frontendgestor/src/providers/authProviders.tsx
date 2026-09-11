import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "@/services/api";
import { AuthContext } from "../context/AuthContext";
import { type User } from "../types/User";
import type { Role } from "@/types/Role";

export type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      api
        .get<User>(`/users/${decoded.sub}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((err) => {
          console.error(
            "Erro ao buscar usuário no useEffect:",
            err.response?.data || err.message
          );
          logout();
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Erro ao decodificar token no useEffect:", error);
      logout();
      setLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<{ sub: string; role: Role }>(token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    api
      .get<User>(`/users/${decoded.sub}`)
      .then((response) => {
        setUser(response.data);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(
          "Erro ao buscar usuário no login:",
          err.response?.data || err.message
        );
        logout();
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};