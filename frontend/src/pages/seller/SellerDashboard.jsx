import React, { useEffect, useMemo, useState } from "react";
import {
  sellerInventorySummary,
  sellerOrders,
  sellerProducts,
  sellerReturns,
  updateOrderItemStatus
} from "../../api/sellerApi.js";
import Badge from "../../components/Badge.jsx";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({ totalProducts: 0, totalVariants: 0, lowStockVariants: 0, totalStock: 0 });
  const [error, setError] = useState("");

  const load = async () => {
    setError("");
    try {
      const [ordersRes, returnsRes, productsRes, inventoryRes] = await Promise.all([
        sellerOrders(),
        sellerReturns(),
        sellerProducts(),
        sellerInventorySummary()
      ]);
      setOrders(ordersRes.data);
      setReturns(returnsRes.data);
      setProducts(productsRes.data);
      setInventory(inventoryRes.data);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load seller dashboard");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const recentOrders = orders.slice(0, 5);
  const openReturns = returns.filter((r) => r.status === "PENDING").slice(0, 5);
  const productList = products.slice(0, 6);

  const revenueByStatus = useMemo(() => {
    const totals = {};
    orders.forEach((o) => {
      const key = o.status;
      const amount = Number(o.price) * Number(o.qty || 0);
      totals[key] = (totals[key] || 0) + amount;
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);

  const alerts = useMemo(() => {
    const cancelReq = orders.filter((o) => o.status === "CANCEL_REQUESTED").length;
    const returnReq = orders.filter((o) => o.status === "RETURN_REQUESTED").length;
    const unshipped = orders.filter((o) => ["PLACED", "CONFIRMED", "PACKED"].includes(o.status)).length;
    const lowStock = inventory.lowStockVariants || 0;
    const items = [];
    if (cancelReq) items.push(`Cancel requests: ${cancelReq}`);
    if (returnReq) items.push(`Return requests: ${returnReq}`);
    if (unshipped) items.push(`Unshipped items: ${unshipped}`);
    if (lowStock) items.push(`Low stock variants: ${lowStock}`);
    if (items.length === 0) items.push("All clear. No urgent alerts.");
    return items;
  }, [orders, inventory.lowStockVariants]);

  const quickShip = async (id) => {
    await updateOrderItemStatus(id, { status: "SHIPPED" });
    load();
  };

  const maxRevenue = Math.max(1, ...revenueByStatus.map(([, v]) => v));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Seller Dashboard</h2>
        <p className="text-sm text-ink/60">Inventory, revenue, and quick actions.</p>
      </div>
      {error && <div className="text-sm text-rose-600">{error}</div>}

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Products</div>
          <div className="text-2xl font-semibold">{inventory.totalProducts}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Variants</div>
          <div className="text-2xl font-semibold">{inventory.totalVariants}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Total Stock</div>
          <div className="text-2xl font-semibold">{inventory.totalStock}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Low Stock</div>
          <div className="text-2xl font-semibold">{inventory.lowStockVariants}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Products</h3>
            <Link to="/seller/products" className="text-sm text-ink/70 hover:text-accent">View all</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {productList.map((p) => (
              <div key={p.id} className="border border-ink/10 rounded-lg p-3">
                <div className="text-sm font-medium">{p.title}</div>
                <div className="text-xs text-ink/60 line-clamp-2">{p.description}</div>
                <div className="mt-2">
                  <Badge value={p.status} />
                </div>
              </div>
            ))}
            {productList.length === 0 && <div className="text-sm text-ink/60">No products yet.</div>}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Revenue by Status</h3>
            <Link to="/seller/orders" className="text-sm text-ink/70 hover:text-accent">View orders</Link>
          </div>
          <div className="space-y-3">
            {revenueByStatus.map(([status, value]) => (
              <div key={status}>
                <div className="flex items-center justify-between text-xs text-ink/70">
                  <span>{status}</span>
                  <span>${value.toFixed(2)}</span>
                </div>
                <div className="h-2 bg-ink/10 rounded">
                  <div
                    className="h-2 bg-ink rounded"
                    style={{ width: `${Math.round((value / maxRevenue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {revenueByStatus.length === 0 && <div className="text-sm text-ink/60">No revenue yet.</div>}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Orders</h3>
            <Link to="/seller/orders" className="text-sm text-ink/70 hover:text-accent">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Item #{o.id}</div>
                  <div className="text-xs text-ink/60">Qty: {o.qty}</div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Badge value={o.status} />
                  <button onClick={() => quickShip(o.id)} className="text-emerald-700">Mark Shipped</button>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && <div className="text-sm text-ink/60">No orders yet.</div>}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Open Returns</h3>
            <Link to="/seller/returns" className="text-sm text-ink/70 hover:text-accent">View all</Link>
          </div>
          <div className="space-y-3">
            {openReturns.map((r) => (
              <div key={r.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Return #{r.id}</div>
                  <div className="text-xs text-ink/60">{r.reason || "No reason"}</div>
                </div>
                <Badge value={r.status} />
              </div>
            ))}
            {openReturns.length === 0 && <div className="text-sm text-ink/60">No open returns.</div>}
          </div>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Alerts</h3>
        <ul className="list-disc pl-5 text-sm text-ink/70 space-y-1">
          {alerts.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SellerDashboard;
