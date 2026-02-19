import React from "react";
import { checkout } from "../../api/cartApi.js";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const handleCheckout = async () => {
    await checkout();
    navigate("/buyer/orders");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Checkout</h2>
        <p className="text-sm text-ink/60">Confirm your order details.</p>
      </div>
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white border border-ink/10 rounded-2xl p-4 space-y-4">
          <div>
            <div className="text-sm text-ink/60">Payment method</div>
            <div className="text-sm font-medium mt-1">Cash on Delivery</div>
          </div>
          <div>
            <div className="text-sm text-ink/60">Shipping</div>
            <div className="text-sm font-medium mt-1">Standard (3-5 days)</div>
          </div>
          <div>
            <div className="text-sm text-ink/60">Returns</div>
            <div className="text-sm font-medium mt-1">30-day return window</div>
          </div>
        </div>
        <div className="bg-white border border-ink/10 rounded-2xl p-4 h-fit">
          <div className="text-sm text-ink/60">Place order</div>
          <button onClick={handleCheckout} className="mt-4 bg-ink text-white px-4 py-2 rounded-full w-full">
            Place Order
          </button>
          <p className="text-xs text-ink/60 mt-3">
            By placing your order, you agree to our terms and policies.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
