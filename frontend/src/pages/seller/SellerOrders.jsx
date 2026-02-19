import React, { useEffect, useState } from "react";
import { sellerOrders, updateOrderItemStatus, updateTracking } from "../../api/sellerApi.js";
import Badge from "../../components/Badge.jsx";

const SellerOrders = () => {
  const [items, setItems] = useState([]);

  const load = () => sellerOrders().then((res) => setItems(res.data));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await updateOrderItemStatus(id, { status });
    load();
  };

  const setTracking = async (id) => {
    const trackingId = prompt("Tracking ID");
    if (!trackingId) return;
    await updateTracking(id, { trackingId });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order Items</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>Item #{item.id}</div>
              <Badge value={item.status} />
            </div>
            <div className="text-sm text-ink/60 mt-2">Qty: {item.qty}</div>
            <div className="flex gap-2 mt-3 text-sm">
              <button onClick={() => updateStatus(item.id, "CONFIRMED")} className="text-ink">
                Confirm
              </button>
              <button onClick={() => updateStatus(item.id, "PACKED")} className="text-ink">
                Packed
              </button>
              <button onClick={() => updateStatus(item.id, "SHIPPED")} className="text-ink">
                Shipped
              </button>
              <button onClick={() => setTracking(item.id)} className="text-accent">
                Add Tracking
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerOrders;
