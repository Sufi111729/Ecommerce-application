import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const image = product.images && product.images.length > 0 ? product.images[0] : null;
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-ink/10 overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-sand/40 overflow-hidden">
        {image ? (
          <img src={image} alt={product.title} className="h-full w-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink/40">Image</div>
        )}
        {product.priceMin != null && (
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs price-pill">
            From ${product.priceMin}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-ink">{product.title}</h3>
        <p className="text-sm text-ink/70 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-ink/60">
          <span>Seller #{product.sellerId || "N/A"}</span>
          <Link to={`/products/${product.id}`} className="text-accent">View</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
