import { use } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";

export default function ManagementAccessGate() {
  const { user, loading } = use(AuthContext) as AuthContextType;

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-secondary">Restoring management session...</div>;
  }

  if (!user) return <Navigate to="/management-login" replace />;

  return <Outlet />;
}
