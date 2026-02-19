import React, { useEffect, useState } from "react";
import { reportSummary, updateCommission } from "../../api/adminApi.js";

const AdminReports = () => {
  const [summary, setSummary] = useState({});
  const [percent, setPercent] = useState("");

  const load = () => reportSummary().then((res) => setSummary(res.data));

  useEffect(() => {
    load();
  }, []);

  const saveCommission = async () => {
    await updateCommission({ percent: Number(percent) });
    alert("Commission updated");
  };

  return (
    <div className="space-y-6">
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
      <div className="bg-white border border-ink/10 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Set commission %</h3>
        <div className="flex gap-2">
          <input
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            placeholder="Percent"
            className="rounded border-ink/20"
          />
          <button onClick={saveCommission} className="bg-ink text-white px-4 py-2 rounded">
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
