import { use } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";

export default function SupplierAccessGate() {
  const { user, loading } = use(AuthContext) as AuthContextType;
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-secondary">Restoring supplier session...</div>;
  if (!user || sessionStorage.getItem("supplier-access-granted") !== "true") return <Navigate to="/supplier-login" replace />;
  return <Outlet />;
}