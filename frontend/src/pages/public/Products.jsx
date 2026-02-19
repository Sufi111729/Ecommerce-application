import React, { useEffect, useMemo, useState } from "react";
import { listProducts } from "../../api/productApi.js";
import ProductCard from "../../components/ProductCard.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    listProducts().then((res) => setProducts(res.data));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = products.filter((p) => {
      const matches = !q || p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
      const price = Number(p.priceMin || 0);
      const minOk = minPrice ? price >= Number(minPrice) : true;
      const maxOk = maxPrice ? price <= Number(maxPrice) : true;
      return matches && minOk && maxOk;
    });
    if (sort === "price-asc") result = result.sort((a, b) => (a.priceMin || 0) - (b.priceMin || 0));
    if (sort === "price-desc") result = result.sort((a, b) => (b.priceMin || 0) - (a.priceMin || 0));
    if (sort === "az") result = result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [products, query, sort, minPrice, maxPrice]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold">All products</h2>
          <p className="text-sm text-ink/60">Search, filter, and compare sellers.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="rounded-full border-ink/20 text-sm px-4 py-2 bg-white"
          />
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min price"
            className="rounded-full border-ink/20 text-sm px-4 py-2 bg-white w-28"
          />
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max price"
            className="rounded-full border-ink/20 text-sm px-4 py-2 bg-white w-28"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-full border-ink/20 text-sm px-4 py-2 bg-white"
          >
            <option value="latest">Latest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="az">A to Z</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {filtered.length === 0 && (
          <div className="text-sm text-ink/60">No products match your filters.</div>
        )}
      </div>
    </div>
  );
};

export default Products;
