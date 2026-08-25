import { use } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";

export default function PosAccessGate() {
  const { user, loading } = use(AuthContext) as AuthContextType;
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-secondary">Restoring POS session...</div>;
  if (!user || sessionStorage.getItem("pos-access-granted") !== "true") return <Navigate to="/pos-login" replace />;
  return <Outlet />;
}
