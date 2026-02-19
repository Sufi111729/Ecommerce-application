import React from "react";
import { Link, Outlet } from "react-router-dom";

const SellerLayout = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <aside className="w-56 text-sm space-y-2">
          <Link to="/seller/dashboard" className="block hover:text-accent">Dashboard</Link>
          <Link to="/seller/apply" className="block hover:text-accent">Seller Apply</Link>
          <Link to="/seller/products" className="block hover:text-accent">Products</Link>
          <Link to="/seller/orders" className="block hover:text-accent">Orders</Link>
          <Link to="/seller/returns" className="block hover:text-accent">Returns</Link>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
