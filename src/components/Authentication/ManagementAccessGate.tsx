import { use, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { getCurrentUser } from "../../api/authorization";

const MANAGEMENT_ROLES = ["Admin", "DemoAdmin", "Manager", "Chef", "SousChef", "Waiter", "Cashier"];

export default function ManagementAccessGate() {
  const { user, loading } = use(AuthContext) as AuthContextType;
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setCheckingRole(false);
      return;
    }

    setCheckingRole(true);
    getCurrentUser()
      .then((response) => setRole(response.user.role))
      .catch(() => setRole(null))
      .finally(() => setCheckingRole(false));
  }, [loading, user]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-secondary">Restoring management session...</div>;
  }

  if (!user) return <Navigate to="/management-login" replace />;
  if (checkingRole) return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-secondary">Checking management access...</div>;
  if (!role || !MANAGEMENT_ROLES.includes(role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
