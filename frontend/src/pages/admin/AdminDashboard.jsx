import React, { useEffect, useState } from "react";
import {
  approveModerator,
  approveSeller,
  pendingModerators,
  pendingSellers,
  reportSummary
} from "../../api/adminApi.js";

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ orders: 0, totalSales: 0, totalCommission: 0 });
  const [sellers, setSellers] = useState([]);
  const [mods, setMods] = useState([]);

  const load = async () => {
    const [summaryRes, sellersRes, modsRes] = await Promise.all([
      reportSummary(),
      pendingSellers(),
      pendingModerators()
    ]);
    setSummary(summaryRes.data);
    setSellers(sellersRes.data.slice(0, 5));
    setMods(modsRes.data.slice(0, 5));
  };

  useEffect(() => {
    load();
  }, []);

  const approveSellerQuick = async (id) => {
    await approveSeller(id);
    load();
  };

  const approveModeratorQuick = async (id) => {
    await approveModerator(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-ink/60">Quick overview and approvals.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Orders</div>
          <div className="text-2xl font-semibold">{summary.orders || 0}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Sales</div>
          <div className="text-2xl font-semibold">${summary.totalSales || 0}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Commission</div>
          <div className="text-2xl font-semibold">${summary.totalCommission || 0}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pending Sellers</h3>
            <a href="/admin/sellers" className="text-sm text-ink/70 hover:text-accent">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {sellers.map((s) => (
              <div key={s.userId} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{s.shopName}</div>
                  <div className="text-xs text-ink/60">{s.verifiedStatus}</div>
                </div>
                <button onClick={() => approveSellerQuick(s.userId)} className="text-emerald-700 text-sm">
                  Approve
                </button>
              </div>
            ))}
            {sellers.length === 0 && <div className="text-sm text-ink/60">No pending sellers.</div>}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pending Moderators</h3>
            <a href="/admin/moderators" className="text-sm text-ink/70 hover:text-accent">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {mods.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-ink/60">{m.email}</div>
                </div>
                <button onClick={() => approveModeratorQuick(m.id)} className="text-emerald-700 text-sm">
                  Approve
                </button>
              </div>
            ))}
            {mods.length === 0 && <div className="text-sm text-ink/60">No pending moderators.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
