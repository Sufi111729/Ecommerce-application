import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/productApi.js";
import { addToCart, getCart } from "../../api/cartApi.js";
import { useCart } from "../../store/CartContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const { updateCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    getProduct(id).then((res) => setProduct(res.data));
  }, [id]);

  useEffect(() => {
    if (product?.images?.length) setActiveImage(product.images[0]);
  }, [product]);

  const handleAdd = async () => {
    if (!product?.defaultVariantId) return;
    await addToCart({ variantId: product.defaultVariantId, qty: 1 });
    const cartRes = await getCart();
    updateCart(cartRes.data);
  };

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-4">
          <div className="bg-white border border-ink/10 rounded-2xl p-4">
            {activeImage ? (
              <img src={activeImage} alt={product.title} className="w-full h-96 object-cover rounded-xl" />
            ) : (
              <div className="h-96 bg-sand flex items-center justify-center text-ink/40">Image</div>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            {(product.images || []).map((img) => (
              <button
                key={img}
                onClick={() => setActiveImage(img)}
                className={`h-16 w-16 rounded-xl border ${activeImage === img ? "border-ink" : "border-ink/10"} overflow-hidden`}
              >
                <img src={img} alt="thumb" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-semibold">{product.title}</h2>
          <p className="mt-3 text-ink/70">{product.description}</p>
          <div className="mt-4 text-xl font-semibold">
            {product.priceMin != null ? `$${product.priceMin}` : "Price unavailable"}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAdd}
              disabled={!product.defaultVariantId}
              className="bg-ink text-white px-5 py-3 rounded-full disabled:opacity-50"
            >
              Add to cart
            </button>
            <a href="/buyer/cart" className="border border-ink/20 px-5 py-3 rounded-full">
              Go to cart
            </a>
          </div>
          {!product.defaultVariantId && (
            <p className="mt-3 text-xs text-rose-600">Variant data missing. Add variants to enable cart.</p>
          )}
          <div className="mt-8 glass rounded-2xl p-4">
            <div className="text-sm font-semibold">Why buy here?</div>
            <ul className="mt-2 text-sm text-ink/70 list-disc pl-5 space-y-1">
              <li>Verified sellers and fast approvals</li>
              <li>Split orders by seller automatically</li>
              <li>Secure payouts and clear tracking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-2">Reviews</h3>
        <p className="text-sm text-ink/60">Reviews will appear after approval.</p>
      </div>
    </div>
  );
};

export default ProductDetails;
