import { RefreshCw, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getUsers, type UserSummary } from "../../api/authorization";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadCustomers() {
    setLoading(true);
    try {
      const users = (await getUsers()).data;
      setCustomers(users.filter((user) => user.role === "Customer"));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCustomers(); }, []);

  return (
    <section className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Administration</p>
          <h1 className="mt-1 font-headline text-2xl font-bold">Customer Management</h1>
          <p className="mt-1 text-xs text-on-surface-variant">View customer accounts and contact information.</p>
        </div>
        <button type="button" title="Refresh customers" onClick={() => void loadCustomers()} className="rounded-md border border-outline-variant/30 bg-surface-container-low p-2 text-primary hover:bg-surface-container-high">
          <RefreshCw size={16} />
        </button>
      </div>
      {message && <p role="alert" className="rounded-md border border-error/20 bg-error/10 px-3 py-2 text-xs text-error">{message}</p>}
      <div className="overflow-x-auto rounded-md border border-[#aeb5ae] bg-surface-container-lowest shadow-sm">
        <table className="w-full min-w-[620px] border-collapse text-left text-xs">
          <thead className="bg-surface-container-high text-[9px] uppercase tracking-widest text-on-surface-variant">
            <tr>
              <th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Customer</th>
              <th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Email</th>
              <th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Phone</th>
              <th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Status</th>
              <th className="border border-[#aeb5ae] px-3 py-2.5 font-bold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="border border-[#aeb5ae] p-8 text-center text-on-surface-variant">Loading customers...</td></tr> : customers.length === 0 ? <tr><td colSpan={5} className="border border-[#aeb5ae] p-8 text-center text-on-surface-variant">No customer accounts yet.</td></tr> : customers.map((customer) => (
              <tr key={customer.id} className="even:bg-surface-container-low/45 hover:bg-primary/3">
                <td className="border border-[#aeb5ae] px-3 py-3"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound size={15} /></div><span className="font-semibold text-primary">{customer.name || "Unnamed customer"}</span></div></td>
                <td className="border border-[#aeb5ae] px-3 py-3">{customer.email}</td>
                <td className="border border-[#aeb5ae] px-3 py-3">{customer.phone || "Not provided"}</td>
                <td className="border border-[#aeb5ae] px-3 py-3"><span className={customer.isActive ? "font-semibold text-primary" : "font-semibold text-error"}>{customer.isActive ? "Active" : "Inactive"}</span></td>
                <td className="border border-[#aeb5ae] px-3 py-3">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
