import React, { useEffect, useState } from "react";
import { approveModerator, pendingModerators, suspendModerator } from "../../api/adminApi.js";

const AdminModerators = () => {
  const [mods, setMods] = useState([]);

  const load = () => pendingModerators().then((res) => setMods(res.data));

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await approveModerator(id);
    load();
  };

  const suspend = async (id) => {
    await suspendModerator(id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Moderators</h2>
      <div className="space-y-3">
        {mods.map((m) => (
          <div key={m.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>{m.name} ({m.email})</div>
              <div className="text-sm text-ink/60">{m.status}</div>
            </div>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => approve(m.id)} className="text-emerald-700">Approve</button>
              <button onClick={() => suspend(m.id)} className="text-rose-700">Suspend</button>
            </div>
          </div>
        ))}
        {mods.length === 0 && (
          <div className="text-sm text-ink/60">No pending moderators.</div>
        )}
      </div>
    </div>
  );
};

export default AdminModerators;
