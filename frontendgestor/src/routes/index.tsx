import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RecuperarSenha from "@/pages/RecuperarSenha";
import Dashboard from "@/pages/Dashboard";
import { PrivateRoute } from "@/components/PrivateRoute";

export default function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />

      {/* Rotas privadas */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}