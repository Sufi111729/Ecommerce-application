import React from "react";
import { Link, Outlet } from "react-router-dom";

const BuyerLayout = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <aside className="w-48 text-sm space-y-2">
          <Link to="/buyer/dashboard" className="block hover:text-accent">Dashboard</Link>
          <Link to="/buyer/cart" className="block hover:text-accent">Cart</Link>
          <Link to="/buyer/checkout" className="block hover:text-accent">Checkout</Link>
          <Link to="/buyer/orders" className="block hover:text-accent">Orders</Link>
          <Link to="/buyer/profile" className="block hover:text-accent">Profile</Link>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BuyerLayout;
