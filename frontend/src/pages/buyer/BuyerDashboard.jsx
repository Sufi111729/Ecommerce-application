import React, { useEffect, useState } from "react";
import { listOrders } from "../../api/orderApi.js";
import Badge from "../../components/Badge.jsx";
import { Link } from "react-router-dom";

const BuyerDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    listOrders().then((res) => setOrders(res.data));
  }, []);

  const recent = orders.slice(0, 5);
  const total = orders.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Buyer Dashboard</h2>
        <p className="text-sm text-ink/60">Your recent activity at a glance.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Total Orders</div>
          <div className="text-2xl font-semibold">{total}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Last Order Status</div>
          <div className="text-2xl font-semibold">{orders[0]?.status || "N/A"}</div>
        </div>
        <div className="bg-white border border-ink/10 rounded-lg p-4">
          <div className="text-sm text-ink/60">Last Order Total</div>
          <div className="text-2xl font-semibold">${orders[0]?.totalAmount || 0}</div>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Recent Orders</h3>
          <Link to="/buyer/orders" className="text-sm text-ink/70 hover:text-accent">View all</Link>
        </div>
        <div className="space-y-3">
          {recent.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Order #{order.id}</div>
                <div className="text-xs text-ink/60">Items: {order.items.length}</div>
              </div>
              <Badge value={order.status} />
            </div>
          ))}
          {recent.length === 0 && <div className="text-sm text-ink/60">No orders yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
