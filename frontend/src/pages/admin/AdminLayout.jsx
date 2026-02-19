import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        <aside className="w-56 text-sm space-y-2">
          <Link to="/admin/dashboard" className="block hover:text-accent">Dashboard</Link>
          <Link to="/admin/sellers" className="block hover:text-accent">Seller Approvals</Link>
          <Link to="/admin/moderators" className="block hover:text-accent">Moderator Approvals</Link>
          <Link to="/admin/categories" className="block hover:text-accent">Categories</Link>
          <Link to="/admin/reports" className="block hover:text-accent">Reports</Link>
          <Link to="/admin/users" className="block hover:text-accent">Users</Link>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
