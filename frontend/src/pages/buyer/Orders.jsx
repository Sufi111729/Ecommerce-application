import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listOrders } from "../../api/orderApi.js";
import Badge from "../../components/Badge.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    listOrders().then((res) => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>Order #{order.id}</div>
              <Badge value={order.status} />
            </div>
            <div className="text-sm text-ink/60 mt-2">
              Items: {order.items.length} | Total: ${order.totalAmount}
            </div>
            <Link to={`/buyer/orders/${order.id}`} className="text-sm text-accent mt-2 inline-block">
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
