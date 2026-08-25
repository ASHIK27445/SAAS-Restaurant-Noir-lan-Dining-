import { Eye, EyeOff, KeyRound, RefreshCw, Save, ShieldCheck, Trash2, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { changeFirebasePassword, deleteUser, getUsers, updateUser, type UserSummary } from "../../api/authorization";

const ROLES = ["Customer", "Chef", "SousChef", "Waiter", "Cashier", "Manager", "Admin", "DemoAdmin", "Accountant", "Supplier"];

export default function UserManagement() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [passwordUser, setPasswordUser] = useState<UserSummary | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState("");

  async function loadUsers() {
    setLoading(true);
    try { setUsers((await getUsers()).data); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Failed to load users"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadUsers(); }, []);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  async function saveUser(user: UserSummary) {
    setSaving(user.id);
    try {
      await updateUser(user.id, { name: user.name || "", phone: user.phone || "", role: user.role, isActive: user.isActive, emailVerificationNeeded: user.emailVerificationNeeded });
      setMessage(`${user.email} updated`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Failed to update user"); }
    finally { setSaving(null); }
  }

  async function resetPassword(user: UserSummary): Promise<boolean> {
    const password = passwords[user.id] || "";
    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setMessage("Password must be 6+ characters with lowercase, uppercase, and number");
      return false;
    }
    setSaving(user.id);
    try {
      await changeFirebasePassword(user.firebaseUid, password);
      setPasswords((current) => ({ ...current, [user.id]: "" }));
      setMessage(`Password updated for ${user.email}`);
      return true;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Failed to update password"); return false; }
    finally { setSaving(null); }
  }

  async function removeUser(user: UserSummary) {
    if (!window.confirm(`Delete ${user.email}? This also removes their Firebase login.`)) return;
    setSaving(user.id);
    try { await deleteUser(user.id); setUsers((current) => current.filter((item) => item.id !== user.id)); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Failed to delete user"); }
    finally { setSaving(null); }
  }

  return (
    <section className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Administration</p>
          <h1 className="mt-1 font-headline text-2xl font-bold">User Management</h1>
          <p className="mt-1 text-xs text-on-surface-variant">Manage accounts, access status, verification, and passwords.</p>
        </div>
        <button title="Refresh users" onClick={() => void loadUsers()} className="rounded-md border border-outline-variant/30 bg-surface-container-low p-2 text-primary hover:bg-surface-container-high"><RefreshCw size={16} /></button>
      </div>
      {message && <p className="rounded-md border border-primary/15 bg-primary/10 px-3 py-2 text-xs text-primary">{message}</p>}
      <div className="overflow-x-auto rounded-md border border-[#aeb5ae] bg-surface-container-lowest shadow-sm">
        <table className="w-full min-w-270 table-fixed border-collapse text-left text-xs">
          <colgroup>
            <col className="w-[25%]" /><col className="w-[13%]" /><col className="w-[15%]" /><col className="w-[11%]" /><col className="w-[15%]" /><col className="w-[13%]" /><col className="w-[8%]" />
          </colgroup>
          <thead className="bg-surface-container-high text-[9px] uppercase tracking-widest text-on-surface-variant">
            <tr><th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">User</th><th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Role</th><th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Contact</th><th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Status</th><th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Email Verification</th><th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Password</th><th className="border border-[#aeb5ae] px-3 py-2.5 text-center font-bold">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="border border-[#aeb5ae] p-8 text-center text-on-surface-variant">Loading users...</td></tr> : users.map((user) => (
              <tr key={user.id} className="even:bg-surface-container-low/45 hover:bg-primary/3">
                <td className="border border-[#aeb5ae] px-3 py-2"><div className="flex items-center gap-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound size={14} /></div><div className="min-w-0"><input value={user.name || ""} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, name: event.target.value } : item))} placeholder="Name" className="w-full rounded border border-outline-variant/30 bg-white px-2 py-1.5 text-xs outline-none focus:border-primary" /><p className="mt-1 truncate text-[10px] text-on-surface-variant">{user.email}</p></div></div></td>
                <td className="border border-[#aeb5ae] px-3 py-2"><select value={user.role} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: event.target.value } : item))} className="w-full rounded border border-outline-variant/30 bg-white px-2 py-1.5 text-xs outline-none focus:border-primary">{ROLES.map((role) => <option key={role}>{role}</option>)}</select></td>
                <td className="border border-[#aeb5ae] px-3 py-2"><input value={user.phone || ""} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, phone: event.target.value } : item))} placeholder="Phone" className="w-full rounded border border-outline-variant/30 bg-white px-2 py-1.5 text-xs outline-none focus:border-primary" /></td>
                <td className="border border-[#aeb5ae] px-3 py-2"><label className="flex items-center gap-1.5 whitespace-nowrap text-xs"><input type="checkbox" checked={user.isActive} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, isActive: event.target.checked } : item))} className="accent-primary" /> Active</label></td>
                <td className="border border-[#aeb5ae] px-3 py-2"><label className="flex items-center gap-1.5 whitespace-nowrap text-xs"><input type="checkbox" checked={user.emailVerificationNeeded} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, emailVerificationNeeded: event.target.checked } : item))} className="accent-primary" /> Required</label></td>
                <td className="border border-[#aeb5ae] px-3 py-2"><div className="flex flex-col gap-1"><span className="text-[10px] text-on-surface-variant">••••••••</span><button type="button" title="Set a new password" onClick={() => setPasswordUser(user)} className="inline-flex w-fit items-center gap-1 rounded border border-primary/20 bg-primary/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-primary hover:bg-primary/15"><KeyRound size={11} /> New Password</button></div></td>
                <td className="border border-[#aeb5ae] px-2 py-2"><div className="flex flex-col items-center gap-0.5"><div className="flex justify-center gap-1"><button title="Save changes" disabled={saving === user.id} onClick={() => void saveUser(user)} className="rounded border border-primary/20 p-1.5 text-primary hover:bg-primary/10 disabled:cursor-wait disabled:opacity-50"><Save size={14} /></button><button title="Delete user" disabled={saving === user.id} onClick={() => void removeUser(user)} className="rounded border border-error/20 p-1.5 text-error hover:bg-error/10 disabled:cursor-wait disabled:opacity-50"><Trash2 size={14} /></button></div>{saving === user.id && <span className="animate-pulse text-[10px] font-bold tracking-[0.2em] text-primary">...</span>}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 text-xs text-on-surface-variant"><ShieldCheck size={15} className="text-primary" /> Only Admin accounts can edit or delete users and change passwords.</div>
      {passwordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-4" role="dialog" aria-modal="true" aria-labelledby="password-modal-title">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Password Management</p>
                <h2 id="password-modal-title" className="mt-1 font-headline text-2xl text-primary">Update password</h2>
                <p className="mt-1 text-xs text-on-surface-variant">{passwordUser.email}</p>
              </div>
              <button type="button" aria-label="Close password dialog" onClick={() => { setPasswordUser(null); setShowNewPassword(false); }} className="rounded-lg p-2 text-secondary hover:bg-surface-container-low"><X size={18} /></button>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-secondary">Current Password</label>
                <input type="password" value="" placeholder="Unavailable for security reasons" readOnly disabled className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 text-sm text-on-surface-variant disabled:cursor-not-allowed" />
                <p className="mt-1 text-[11px] text-on-surface-variant">Current passwords are never readable by administrators.</p>
              </div>
              <div>
                <label htmlFor="new-password" className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-secondary">New Password</label>
                <div className="relative">
                  <input id="new-password" autoFocus type={showNewPassword ? "text" : "password"} value={passwords[passwordUser.id] || ""} onChange={(event) => setPasswords((current) => ({ ...current, [passwordUser.id]: event.target.value }))} placeholder="Enter new password" className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 pr-11 text-sm text-primary outline-none ring-primary/20 focus:ring-2" />
                  <button type="button" aria-label={showNewPassword ? "Hide new password" : "Show new password"} onClick={() => setShowNewPassword((current) => !current)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-secondary hover:bg-surface-container-high hover:text-primary">
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-on-surface-variant">Use 6+ characters with lowercase, uppercase, and number.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => { setPasswordUser(null); setShowNewPassword(false); }} className="rounded-lg bg-surface-container px-4 py-2 text-xs font-semibold text-primary">Cancel</button>
              <button type="button" disabled={saving === passwordUser.id} onClick={() => void resetPassword(passwordUser).then((success) => { if (success) setPasswordUser(null); })} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary disabled:opacity-50"><KeyRound size={14} /> Save New Password</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
