import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  // Jika belum login, lempar ke halaman login
  if (!user) {
    const loginPath = import.meta.env.VITE_SECRET_LOGIN_PATH || "xL9pQ2m";
    return <Navigate to={`/${loginPath}`} replace />;
  }

  // Jika role user tidak ada dalam daftar yang diizinkan untuk halaman tersebut
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Lempar ke halaman beranda jika tidak berhak
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
