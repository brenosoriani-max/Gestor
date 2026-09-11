import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RecuperarSenha from "@/pages/RecuperarSenha";

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

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}