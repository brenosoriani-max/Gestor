import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";


export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}