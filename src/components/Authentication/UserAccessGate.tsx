import { use, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./auth";
import { getCurrentUser } from "../../api/authorization";

export default function UserAccessGate() {
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
      .then((result) => setRole(result.user.role))
      .catch(() => setRole(null))
      .finally(() => setCheckingRole(false));
  }, [loading, user]);

  if (!loading && !user) return <Navigate to="/login" replace />;

  if (loading || checkingRole) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F5F0E6] text-sm text-[#4b463f]">Restoring your table...</div>;
  }

  if (role !== "Customer") return <Navigate to="/" replace />;
  return <Outlet />;
}
