import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sellerProducts } from "../../api/sellerApi.js";
import { submitProduct } from "../../api/productApi.js";
import Badge from "../../components/Badge.jsx";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const res = await sellerProducts();
      setProducts(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load products");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (id) => {
    await submitProduct(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <Link to="/seller/products/new" className="bg-ink text-white px-3 py-2 rounded text-sm">
          Add Product
        </Link>
      </div>
      <div className="space-y-3">
        {error && <div className="text-sm text-rose-600">{error}</div>}
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>{p.title}</div>
              <Badge value={p.status} />
            </div>
            <div className="text-sm text-ink/60 mt-2">{p.description}</div>
            <div className="flex gap-2 mt-3 text-sm">
              {(p.status === "DRAFT" || p.status === "REJECTED") && (
                <button onClick={() => submit(p.id)} className="text-emerald-700">Submit for approval</button>
              )}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="bg-white border border-ink/10 rounded-lg p-4 text-sm text-ink/60">
            Your products will appear here after creation.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
