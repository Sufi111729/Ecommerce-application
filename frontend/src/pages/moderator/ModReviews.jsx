import React, { useEffect, useState } from "react";
import { approveReview, pendingReviews, rejectReview } from "../../api/modApi.js";
import Badge from "../../components/Badge.jsx";

const ModReviews = () => {
  const [reviews, setReviews] = useState([]);

  const load = () => pendingReviews().then((res) => setReviews(res.data));

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await approveReview(id);
    load();
  };

  const reject = async (id) => {
    await rejectReview(id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Reviews</h2>
      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>Rating: {r.rating}</div>
              <Badge value={r.status} />
            </div>
            <p className="text-sm text-ink/60 mt-2">{r.comment}</p>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => approve(r.id)} className="text-emerald-700">Approve</button>
              <button onClick={() => reject(r.id)} className="text-rose-700">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModReviews;
