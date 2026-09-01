"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  X,
  Loader2,
  Globe,
} from "lucide-react";

export default function AdminTenantsPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // New tenant form
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState("free");
  const [submitting, setSubmitting] = useState(false);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/tenants");
      const data = await res.json();
      if (res.ok) {
        setTenants(data.tenants || []);
      } else {
        setError(data.error || "Failed to fetch tenants");
      }
    } catch (err) {
      setError("Network error fetching tenants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, domain, plan }),
      });
      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        setName("");
        setDomain("");
        setPlan("free");
        fetchTenants();
      } else {
        alert(data.error || "Failed to create tenant");
      }
    } catch (err) {
      alert("Error creating tenant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (tenantId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch("/api/v1/admin/tenants", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, status: newStatus }),
      });
      if (res.ok) {
        fetchTenants();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Error updating status");
    }
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Tenant Management
          </h1>
          <p className="text-xs text-slate-500">
            Create, monitor, and configure multi-tenant organizations on the platform.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-950/10 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Tenant</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3 bg-white border border-slate-200/80 p-2 rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenants by name or slug..."
            className="w-full bg-slate-50/80 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 focus:bg-white focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200/80">
              <tr>
                <th className="px-4 py-3.5">Tenant Name & Slug</th>
                <th className="px-4 py-3.5">Custom Domain</th>
                <th className="px-4 py-3.5">Owner</th>
                <th className="px-4 py-3.5">Plan</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600 mb-2" />
                    Loading tenants...
                  </td>
                </tr>
              ) : filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No tenants found. Click "Provision Tenant" to create one.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-900">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-900">{t.name}</span>
                        <span className="text-[11px] text-indigo-600 font-mono">/{t.slug}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                      {t.domain ? (
                        <span className="flex items-center gap-1 text-slate-800 font-medium">
                          <Globe className="w-3.5 h-3.5 text-indigo-600" />
                          {t.domain}
                        </span>
                      ) : (
                        <span className="text-slate-400">Default Subdomain</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {t.ownerId ? (
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold">{t.ownerId.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{t.ownerId.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">System Admin</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {t.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            t.status === "active" ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        />
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(t._id, t.status)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          t.status === "active"
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                      >
                        {t.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Provisioning Tenant */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Provision New Tenant
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Tenant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Blog"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Custom Domain (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. blog.acme.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Subscription Plan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="free">Free Tier</option>
                  <option value="pro">Pro Tier</option>
                  <option value="enterprise">Enterprise Tier</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold shadow-md shadow-slate-950/10"
                >
                  {submitting ? "Creating..." : "Create Tenant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
