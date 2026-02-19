import React, { useEffect, useState } from "react";
import { approveSeller, pendingSellers, rejectedSellers, suspendSeller } from "../../api/adminApi.js";

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [view, setView] = useState("PENDING");

  const load = () => {
    const req = view === "REJECTED" ? rejectedSellers() : pendingSellers();
    return req.then((res) => setSellers(res.data));
  };

  useEffect(() => {
    load();
  }, [view]);

  const approve = async (id) => {
    await approveSeller(id);
    load();
  };

  const suspend = async (id) => {
    await suspendSeller(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {view === "REJECTED" ? "Rejected Sellers" : "Pending Sellers"}
        </h2>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setView("PENDING")}
            className={`px-3 py-1 rounded border ${view === "PENDING" ? "bg-ink text-white" : "border-ink/20"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setView("REJECTED")}
            className={`px-3 py-1 rounded border ${view === "REJECTED" ? "bg-ink text-white" : "border-ink/20"}`}
          >
            Rejected
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {sellers.map((s) => (
          <div key={s.userId} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>{s.shopName}</div>
              <div className="text-sm text-ink/60">{s.verifiedStatus}</div>
            </div>
            <div className="flex gap-2 mt-3 text-sm">
              {view !== "REJECTED" && (
                <button onClick={() => approve(s.userId)} className="text-emerald-700">Approve</button>
              )}
              <button onClick={() => suspend(s.userId)} className="text-rose-700">Suspend</button>
            </div>
          </div>
        ))}
        {sellers.length === 0 && (
          <div className="text-sm text-ink/60">No records.</div>
        )}
      </div>
    </div>
  );
};

export default AdminSellers;
