import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cancelOrderItem, getOrder, returnOrderItem } from "../../api/orderApi.js";
import { createReview } from "../../api/reviewApi.js";
import Badge from "../../components/Badge.jsx";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [reviewForm, setReviewForm] = useState({});

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data));
  }, [id]);

  const handleCancel = async (itemId) => {
    await cancelOrderItem(itemId);
    const res = await getOrder(id);
    setOrder(res.data);
  };

  const handleReturn = async (itemId) => {
    await returnOrderItem(itemId, { orderItemId: itemId, reason: "Not satisfied" });
    const res = await getOrder(id);
    setOrder(res.data);
  };

  const updateReviewField = (itemId, field, value) => {
    setReviewForm((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), [field]: value }
    }));
  };

  const submitReview = async (item) => {
    const data = reviewForm[item.id] || {};
    const rating = Number(data.rating || 0);
    const comment = data.comment || "";
    if (!item.productId || rating < 1) return;
    await createReview({ productId: item.productId, rating, comment });
    setReviewForm((prev) => ({ ...prev, [item.id]: { rating: "", comment: "" } }));
    alert("Review submitted");
  };

  if (!order) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="bg-white border border-ink/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>Item #{item.id}</div>
              <Badge value={item.status} />
            </div>
            <div className="text-sm text-ink/60 mt-2">
              Qty: {item.qty} | Seller #{item.sellerId}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleCancel(item.id)} className="text-sm text-rose-600">
                Cancel request
              </button>
              <button onClick={() => handleReturn(item.id)} className="text-sm text-ink">
                Return request
              </button>
            </div>
            {item.status === "DELIVERED" && (
              <div className="mt-4 border-t border-ink/10 pt-3">
                <div className="text-sm font-medium mb-2">Leave a review</div>
                <div className="grid gap-2">
                  <input
                    placeholder="Rating (1-5)"
                    value={reviewForm[item.id]?.rating || ""}
                    onChange={(e) => updateReviewField(item.id, "rating", e.target.value)}
                    className="rounded border-ink/20"
                  />
                  <textarea
                    placeholder="Comment"
                    value={reviewForm[item.id]?.comment || ""}
                    onChange={(e) => updateReviewField(item.id, "comment", e.target.value)}
                    className="rounded border-ink/20"
                  />
                  <button onClick={() => submitReview(item)} className="bg-ink text-white px-3 py-2 rounded text-sm">
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
