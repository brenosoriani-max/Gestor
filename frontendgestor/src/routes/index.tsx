import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";


export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />
            
      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}