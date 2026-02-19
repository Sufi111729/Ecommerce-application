import React from "react";
import { Link, Outlet } from "react-router-dom";

const ModLayout = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <aside className="w-56 text-sm space-y-2">
          <Link to="/moderator/dashboard" className="block hover:text-accent">Dashboard</Link>
          <Link to="/moderator/sellers" className="block hover:text-accent">Seller Approvals</Link>
          <Link to="/moderator/products" className="block hover:text-accent">Pending Products</Link>
          <Link to="/moderator/reviews" className="block hover:text-accent">Pending Reviews</Link>
          <Link to="/moderator/disputes" className="block hover:text-accent">Disputes</Link>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ModLayout;
