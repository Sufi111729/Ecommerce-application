import React, { useEffect, useState } from "react";
import { approveReturn, rejectReturn, sellerReturns } from "../../api/sellerApi.js";
import Badge from "../../components/Badge.jsx";

const SellerReturns = () => {
  const [returns, setReturns] = useState([]);

  const load = () => sellerReturns().then((res) => setReturns(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    await approveReturn(id);
    load();
  };

  const handleReject = async (id) => {
    await rejectReturn(id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Return Requests</h2>
      <div className="space-y-3">
        {returns.map((r) => (
          <div key={r.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>Return #{r.id}</div>
              <Badge value={r.status} />
            </div>
            <p className="text-sm text-ink/60 mt-2">{r.reason}</p>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => handleApprove(r.id)} className="text-emerald-700">Approve</button>
              <button onClick={() => handleReject(r.id)} className="text-rose-700">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerReturns;
