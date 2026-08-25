import { KeyRound, RefreshCw, Save, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { changeFirebasePassword, deleteUser, getUsers, updateUser, type UserSummary } from "../../api/authorization";

const ROLES = ["Customer", "Chef", "SousChef", "Waiter", "Cashier", "Manager", "Admin", "DemoAdmin"];

export default function UserManagement() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function loadUsers() {
    setLoading(true);
    try { setUsers((await getUsers()).data); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Failed to load users"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadUsers(); }, []);

  async function saveUser(user: UserSummary) {
    setSaving(user.id);
    try {
      await updateUser(user.id, { name: user.name || "", phone: user.phone || "", role: user.role, isActive: user.isActive });
      setMessage(`${user.email} updated`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Failed to update user"); }
    finally { setSaving(null); }
  }

  async function resetPassword(user: UserSummary) {
    const password = passwords[user.id] || "";
    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return setMessage("Password must be 6+ characters with lowercase, uppercase, and number");
    setSaving(user.id);
    try {
      await changeFirebasePassword(user.firebaseUid, password);
      setPasswords((current) => ({ ...current, [user.id]: "" }));
      setMessage(`Password updated for ${user.email}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Failed to update password"); }
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
    <section className="p-6 md:p-10 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">Administration</p>
          <h1 className="text-3xl font-headline font-bold mt-1">User Management</h1>
          <p className="text-sm text-on-surface-variant mt-2">Manage customer and staff accounts, roles, status, and passwords.</p>
        </div>
        <button title="Refresh users" onClick={() => void loadUsers()} className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high"><RefreshCw size={17} /></button>
      </div>
      {message && <p className="text-sm text-primary bg-primary/10 rounded-lg px-4 py-3">{message}</p>}
      <div className="overflow-x-auto bg-surface-container-lowest rounded-xl border border-outline-variant/15">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/15">
            <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Contact</th><th className="p-4">Status</th><th className="p-4">Password</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant">Loading users...</td></tr> : users.map((user) => (
              <tr key={user.id} className="border-b border-outline-variant/10 last:border-0">
                <td className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-full bg-primary/10 text-primary"><UserRound size={16} /></div><div><input value={user.name || ""} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, name: event.target.value } : item))} placeholder="Name" className="bg-surface-container-low rounded-lg px-3 py-2 text-xs w-36" /><p className="text-xs text-on-surface-variant mt-1">{user.email}</p></div></div></td>
                <td className="p-4"><select value={user.role} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, role: event.target.value } : item))} className="bg-surface-container-low rounded-lg px-3 py-2 text-xs">{ROLES.map((role) => <option key={role}>{role}</option>)}</select></td>
                <td className="p-4"><input value={user.phone || ""} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, phone: event.target.value } : item))} placeholder="Phone" className="bg-surface-container-low rounded-lg px-3 py-2 text-xs w-32" /></td>
                <td className="p-4"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={user.isActive} onChange={(event) => setUsers((current) => current.map((item) => item.id === user.id ? { ...item, isActive: event.target.checked } : item))} /> Active</label></td>
                <td className="p-4"><div className="flex gap-1"><input type="password" value={passwords[user.id] || ""} onChange={(event) => setPasswords((current) => ({ ...current, [user.id]: event.target.value }))} placeholder="New password" className="bg-surface-container-low rounded-lg px-3 py-2 text-xs w-28" /><button title="Update password" onClick={() => void resetPassword(user)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><KeyRound size={15} /></button></div></td>
                <td className="p-4"><div className="flex gap-1"><button title="Save changes" disabled={saving === user.id} onClick={() => void saveUser(user)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Save size={15} /></button><button title="Delete user" disabled={saving === user.id} onClick={() => void removeUser(user)} className="p-2 text-error hover:bg-error/10 rounded-lg"><Trash2 size={15} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 text-xs text-on-surface-variant"><ShieldCheck size={15} className="text-primary" /> Only Admin accounts can edit or delete users and change passwords.</div>
    </section>
  );
}
