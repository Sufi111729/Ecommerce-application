import React, { useEffect, useState } from "react";
import {
  approveSeller,
  approveProduct,
  approveReview,
  listDisputes,
  pendingSellers,
  pendingProducts,
  pendingReviews,
  rejectSeller,
  rejectProduct,
  rejectReview
} from "../../api/modApi.js";
import Badge from "../../components/Badge.jsx";

const ModDashboard = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [sellers, setSellers] = useState([]);

  const load = async () => {
    const [pRes, rRes, dRes, sRes] = await Promise.all([
      pendingProducts(),
      pendingReviews(),
      listDisputes(),
      pendingSellers()
    ]);
    setProducts(pRes.data.slice(0, 5));
    setReviews(rRes.data.slice(0, 5));
    setDisputes(dRes.data.slice(0, 5));
    setSellers(sRes.data.slice(0, 5));
  };

  useEffect(() => {
    load();
  }, []);

  const approveProductQuick = async (id) => {
    await approveProduct(id);
    load();
  };

  const rejectProductQuick = async (id) => {
    await rejectProduct(id);
    load();
  };

  const approveReviewQuick = async (id) => {
    await approveReview(id);
    load();
  };

  const rejectReviewQuick = async (id) => {
    await rejectReview(id);
    load();
  };

  const approveSellerQuick = async (id) => {
    await approveSeller(id);
    load();
  };

  const rejectSellerQuick = async (id) => {
    await rejectSeller(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Moderator Dashboard</h2>
        <p className="text-sm text-ink/60">Pending queues and quick actions.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Pending Products</div>
          <div className="text-2xl font-semibold">{products.length}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Pending Reviews</div>
          <div className="text-2xl font-semibold">{reviews.length}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Open Disputes</div>
          <div className="text-2xl font-semibold">{disputes.length}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Pending Sellers</div>
          <div className="text-2xl font-semibold">{sellers.length}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pending Products</h3>
            <a href="/moderator/products" className="text-sm text-ink/70 hover:text-accent">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-ink/60">{p.status}</div>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => approveProductQuick(p.id)} className="text-emerald-700">Approve</button>
                  <button onClick={() => rejectProductQuick(p.id)} className="text-rose-700">Reject</button>
                </div>
              </div>
            ))}
            {products.length === 0 && <div className="text-sm text-ink/60">No pending products.</div>}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Pending Reviews</h3>
            <a href="/moderator/reviews" className="text-sm text-ink/70 hover:text-accent">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Rating: {r.rating}</div>
                  <div className="text-xs text-ink/60">{r.comment}</div>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => approveReviewQuick(r.id)} className="text-emerald-700">Approve</button>
                  <button onClick={() => rejectReviewQuick(r.id)} className="text-rose-700">Reject</button>
                </div>
              </div>
            ))}
            {reviews.length === 0 && <div className="text-sm text-ink/60">No pending reviews.</div>}
          </div>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Pending Sellers</h3>
          <a href="/moderator/sellers" className="text-sm text-ink/70 hover:text-accent">
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
              <div className="flex gap-2 text-sm">
                <button onClick={() => approveSellerQuick(s.userId)} className="text-emerald-700">Approve</button>
                <button onClick={() => rejectSellerQuick(s.userId)} className="text-rose-700">Reject</button>
              </div>
            </div>
          ))}
          {sellers.length === 0 && <div className="text-sm text-ink/60">No pending sellers.</div>}
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Open Disputes</h3>
          <a href="/moderator/disputes" className="text-sm text-ink/70 hover:text-accent">
            View all
          </a>
        </div>
        <div className="space-y-3">
          {disputes.map((d) => (
            <div key={d.id} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Dispute #{d.id}</div>
                <div className="text-xs text-ink/60">{d.message}</div>
              </div>
              <Badge value={d.status} />
            </div>
          ))}
          {disputes.length === 0 && <div className="text-sm text-ink/60">No open disputes.</div>}
        </div>
      </div>
    </div>
  );
};

export default ModDashboard;
