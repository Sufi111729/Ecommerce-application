import React, { useEffect, useState } from "react";
import { approveSeller, pendingSellers, rejectSeller } from "../../api/modApi.js";

const ModSellers = () => {
  const [sellers, setSellers] = useState([]);

  const load = () => pendingSellers().then((res) => setSellers(res.data));

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await approveSeller(id);
    load();
  };

  const reject = async (id) => {
    await rejectSeller(id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Sellers</h2>
      <div className="space-y-3">
        {sellers.map((s) => (
          <div key={s.userId} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>{s.shopName}</div>
              <div className="text-sm text-ink/60">{s.verifiedStatus}</div>
            </div>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => approve(s.userId)} className="text-emerald-700">Approve</button>
              <button onClick={() => reject(s.userId)} className="text-rose-700">Reject</button>
            </div>
          </div>
        ))}
        {sellers.length === 0 && (
          <div className="text-sm text-ink/60">No pending sellers.</div>
        )}
      </div>
    </div>
  );
};

export default ModSellers;
