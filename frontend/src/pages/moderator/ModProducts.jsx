import React, { useEffect, useState } from "react";
import { approveProduct, pendingProducts, rejectProduct } from "../../api/modApi.js";
import Badge from "../../components/Badge.jsx";

const ModProducts = () => {
  const [products, setProducts] = useState([]);

  const load = () => pendingProducts().then((res) => setProducts(res.data));

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    await approveProduct(id);
    load();
  };

  const reject = async (id) => {
    await rejectProduct(id);
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pending Products</h2>
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>{p.title}</div>
              <Badge value={p.status} />
            </div>
            <div className="text-sm text-ink/60 mt-2">{p.description}</div>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => approve(p.id)} className="text-emerald-700">Approve</button>
              <button onClick={() => reject(p.id)} className="text-rose-700">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModProducts;
