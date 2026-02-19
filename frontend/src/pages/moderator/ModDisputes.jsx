import React, { useEffect, useState } from "react";
import { listDisputes, resolveDispute } from "../../api/modApi.js";
import Badge from "../../components/Badge.jsx";

const ModDisputes = () => {
  const [disputes, setDisputes] = useState([]);

  const load = () => listDisputes().then((res) => setDisputes(res.data));

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id, status) => {
    await resolveDispute(id, { status });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Disputes</h2>
      <div className="space-y-3">
        {disputes.map((d) => (
          <div key={d.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>Dispute #{d.id}</div>
              <Badge value={d.status} />
            </div>
            <p className="text-sm text-ink/60 mt-2">{d.message}</p>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => resolve(d.id, "RESOLVED")} className="text-emerald-700">Resolve</button>
              <button onClick={() => resolve(d.id, "REJECTED")} className="text-rose-700">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModDisputes;
