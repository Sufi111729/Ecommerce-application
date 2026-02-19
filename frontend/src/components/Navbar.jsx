import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext.jsx";
import { useCart } from "../store/CartContext.jsx";

const Navbar = () => {
  const { role, logout } = useAuth();
  const { cart } = useCart();
  return (
    <nav className="sticky top-0 z-40 bg-ink text-white shadow-lg shadow-black/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-wide">
            MultiSeller
          </Link>
          <div className="md:hidden flex items-center gap-3 text-sm">
            <Link to="/products">Shop</Link>
            <Link to="/buyer/cart">Cart ({cart.items?.length || 0})</Link>
          </div>
        </div>
        <div className="flex-1 md:px-6">
          <div className="flex items-center bg-white/10 rounded-full px-4 py-2">
            <input
              placeholder="Search products, brands, and more..."
              className="w-full bg-transparent text-sm placeholder:text-white/60 focus:outline-none"
            />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm">
          <Link to="/products" className="hover:text-sand">Shop</Link>
          {!role && (
            <>
              <Link to="/login" className="hover:text-sand">Login</Link>
              <Link to="/register" className="hover:text-sand">Register</Link>
            </>
          )}
          {role === "BUYER" && (
            <>
              <Link to="/buyer/cart">Cart ({cart.items?.length || 0})</Link>
              <Link to="/buyer/orders">Orders</Link>
            </>
          )}
          {role === "SELLER" && <Link to="/seller/dashboard">Seller</Link>}
          {role === "MODERATOR" && <Link to="/moderator/dashboard">Moderator</Link>}
          {role === "ADMIN" && <Link to="/admin/dashboard">Admin</Link>}
          {role && (
            <button onClick={logout} className="bg-accent px-3 py-1 rounded">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
