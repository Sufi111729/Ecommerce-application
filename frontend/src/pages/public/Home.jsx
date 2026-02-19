import React, { useEffect, useState } from "react";
import { listProducts } from "../../api/productApi.js";
import ProductCard from "../../components/ProductCard.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    listProducts().then((res) => setProducts(res.data));
  }, []);

  const featured = products.slice(0, 6);
  const trending = products.slice(6, 12);

  return (
    <div>
      <section className="relative overflow-hidden hero-grid">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="uppercase tracking-[0.3em] text-xs text-ink/60">Marketplace</p>
              <h1 className="text-4xl md:text-6xl font-semibold mt-4">
                Amazon-style shopping for multi-seller catalogs.
              </h1>
              <p className="mt-4 text-ink/70 max-w-xl">
                Shop verified sellers, split orders automatically, and track every shipment
                from one clean dashboard.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/products" className="bg-ink text-white px-5 py-3 rounded-full text-sm">
                  Start shopping
                </a>
                <a href="/register" className="border border-ink/20 px-5 py-3 rounded-full text-sm">
                  Become a seller
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 text-xs text-ink/60">
                <span>Secure payments</span>
                <span>Verified sellers</span>
                <span>Fast approvals</span>
              </div>
            </div>
            <div className="glass rounded-3xl p-6">
              <div className="grid grid-cols-2 gap-4">
                {featured.slice(0, 4).map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl p-3 border border-ink/10">
                    <div className="text-xs text-ink/60 mb-2">Featured</div>
                    <div className="text-sm font-semibold">{p.title}</div>
                    <div className="text-xs text-ink/60 line-clamp-2">{p.description}</div>
                  </div>
                ))}
                {featured.length === 0 && (
                  <div className="col-span-2 text-sm text-ink/60">No products yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured picks</h2>
          <a href="/products" className="text-sm text-ink/60 hover:text-accent">View all</a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {featured.length === 0 && <div className="text-sm text-ink/60">No products yet.</div>}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Trending now</h2>
          <a href="/products" className="text-sm text-ink/60 hover:text-accent">Shop trends</a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {trending.length === 0 && <div className="text-sm text-ink/60">No trending items yet.</div>}
        </div>
      </section>
    </div>
  );
};

export default Home;
