import { use, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { getCurrentUser } from "../../api/authorization";

const SUPPLIER_ROLES = ["Admin", "Manager", "Accountant", "Supplier"];

export default function SupplierAccessGate() {
  const { user, loading } = use(AuthContext) as AuthContextType;
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user || sessionStorage.getItem("supplier-access-granted") !== "true") {
      setAllowed(false);
      return;
    }

    getCurrentUser()
      .then((response) => {
        const hasRole = SUPPLIER_ROLES.includes(response.user.role);
        const hasGrant = response.user.accessGrants?.some((grant) => grant.module === "SUPPLIERS" && grant.status === "APPROVED");
        setAllowed(hasRole || Boolean(hasGrant));
      })
      .catch(() => setAllowed(false));
  }, [loading, user]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-secondary">Restoring supplier session...</div>;
  if (!user || allowed === false) return <Navigate to="/supplier-login" replace />;
  if (allowed === null) return <div className="flex min-h-screen items-center justify-center bg-surface text-sm text-secondary">Checking supplier access...</div>;
  return <Outlet />;
}