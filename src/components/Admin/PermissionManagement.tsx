import { Check, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccessGrants, getCurrentUser, requestAccess, reviewAccess, type AccessGrant, type AccessModule } from "../../api/authorization";
import { getStaffList } from "../../api/employee";
import type { EmployeeListItem } from "../../types/employee";

const MODULES: AccessModule[] = ["SUPPLIERS", "INVENTORY", "EMPLOYEES", "ORDERS", "ATTENDANCE", "POS", "MENU"];

export default function PermissionManagement() {
  const [grants, setGrants] = useState<AccessGrant[]>([]);
  const [staff, setStaff] = useState<EmployeeListItem[]>([]);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [module, setModule] = useState<AccessModule>("INVENTORY");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const [current, grantResponse, staffResponse] = await Promise.all([getCurrentUser(), getAccessGrants(), getStaffList()]);
      setUserRole(current.user.role);
      setGrants(grantResponse.data);
      setStaff(staffResponse.data.filter((item) => item.role !== "Admin"));
    } catch (error) { setMessage(error instanceof Error ? error.message : "Failed to load permissions"); }
  }
  useEffect(() => { void load(); }, []);

  async function submitRequest() {
    if (!userId) return setMessage("Select a staff member");
    try { await requestAccess(userId, module); setMessage("Access request submitted"); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Failed to submit request"); }
  }

  async function review(id: string, status: "APPROVED" | "REJECTED") {
    try { await reviewAccess(id, status); await load(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Failed to review request"); }
  }

  return (
    <section className="p-6 md:p-10 space-y-6">
      <div><p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Security</p><h1 className="text-3xl font-headline font-bold mt-1">Permission Management</h1><p className="text-sm text-on-surface-variant mt-2">Grant staff access to operational modules. Manager requests require Admin approval.</p></div>
      {message && <p className="text-sm text-primary bg-primary/10 rounded-lg px-4 py-3">{message}</p>}
      <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/15 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Shield size={17} className="text-primary" /> Request module access</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <select value={userId} onChange={(event) => setUserId(event.target.value)} className="bg-surface-container-low rounded-lg px-3 py-2 text-sm flex-1"><option value="">Select staff member</option>{staff.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.role}</option>)}</select>
          <select value={module} onChange={(event) => setModule(event.target.value as AccessModule)} className="bg-surface-container-low rounded-lg px-3 py-2 text-sm">{MODULES.map((item) => <option key={item}>{item}</option>)}</select>
          <button onClick={() => void submitRequest()} className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-semibold">{userRole === "Admin" ? "Grant access" : "Request access"}</button>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/15 overflow-x-auto"><table className="w-full min-w-162.5 text-left text-sm"><thead className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/15"><tr><th className="p-4">Staff</th><th className="p-4">Module</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{grants.map((grant) => <tr key={grant.id} className="border-b border-outline-variant/10 last:border-0"><td className="p-4"><p className="font-semibold">{grant.user.name || "Unnamed"}</p><p className="text-xs text-on-surface-variant">{grant.user.email}</p></td><td className="p-4">{grant.module}</td><td className="p-4"><span className={`text-xs font-semibold ${grant.status === "APPROVED" ? "text-primary" : grant.status === "REJECTED" ? "text-error" : "text-secondary"}`}>{grant.status}</span></td><td className="p-4">{userRole === "Admin" && grant.status === "PENDING" && <div className="flex gap-1"><button title="Approve" onClick={() => void review(grant.id, "APPROVED")} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Check size={15} /></button><button title="Reject" onClick={() => void review(grant.id, "REJECTED")} className="p-2 text-error hover:bg-error/10 rounded-lg"><X size={15} /></button></div>}</td></tr>)}</tbody></table></div>
    </section>
  );
}
