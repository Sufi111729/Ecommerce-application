import React, { useEffect, useMemo } from "react";
import { getCart, removeFromCart } from "../../api/cartApi.js";
import { useCart } from "../../store/CartContext.jsx";

const Cart = () => {
  const { cart, updateCart } = useCart();

  useEffect(() => {
    getCart().then((res) => updateCart(res.data));
  }, [updateCart]);

  const grouped = useMemo(() => {
    const map = {};
    (cart.items || []).forEach((item) => {
      if (!map[item.sellerId]) map[item.sellerId] = [];
      map[item.sellerId].push(item);
    });
    return map;
  }, [cart]);

  const handleRemove = async (variantId) => {
    await removeFromCart(variantId);
    const res = await getCart();
    updateCart(res.data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Your cart</h2>
        <p className="text-sm text-ink/60">Review items and proceed to checkout.</p>
      </div>
      {Object.keys(grouped).length === 0 && (
        <div className="glass rounded-2xl p-6 text-sm text-ink/60">
          Your cart is empty.
        </div>
      )}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          {Object.entries(grouped).map(([sellerId, items]) => (
            <div key={sellerId} className="bg-white border border-ink/10 rounded-2xl">
              <div className="px-4 py-3 border-b text-sm font-medium">
                Seller #{sellerId}
              </div>
              <div className="p-4 space-y-3">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-ink/60">Qty: {item.qty}</div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.variantId)}
                      className="text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white border border-ink/10 rounded-2xl p-4 h-fit">
          <div className="text-sm text-ink/60">Order summary</div>
          <div className="text-2xl font-semibold mt-2">${cart.subtotal || 0}</div>
          <p className="text-xs text-ink/60 mt-1">Taxes calculated at checkout.</p>
          <a href="/buyer/checkout" className="mt-4 inline-block bg-ink text-white px-4 py-2 rounded-full">
            Proceed to checkout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Cart;
