import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/public/Home.jsx";
import Products from "./pages/public/Products.jsx";
import ProductDetails from "./pages/public/ProductDetails.jsx";
import Login from "./pages/public/Login.jsx";
import Register from "./pages/public/Register.jsx";
import AdminLogin from "./pages/public/AdminLogin.jsx";
import BuyerLayout from "./pages/buyer/BuyerLayout.jsx";
import BuyerDashboard from "./pages/buyer/BuyerDashboard.jsx";
import Cart from "./pages/buyer/Cart.jsx";
import Checkout from "./pages/buyer/Checkout.jsx";
import Orders from "./pages/buyer/Orders.jsx";
import OrderDetails from "./pages/buyer/OrderDetails.jsx";
import Profile from "./pages/buyer/Profile.jsx";
import SellerLayout from "./pages/seller/SellerLayout.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import SellerApply from "./pages/seller/SellerApply.jsx";
import SellerProducts from "./pages/seller/SellerProducts.jsx";
import SellerProductForm from "./pages/seller/SellerProductForm.jsx";
import SellerOrders from "./pages/seller/SellerOrders.jsx";
import SellerReturns from "./pages/seller/SellerReturns.jsx";
import ModLayout from "./pages/moderator/ModLayout.jsx";
import ModDashboard from "./pages/moderator/ModDashboard.jsx";
import ModSellers from "./pages/moderator/ModSellers.jsx";
import ModProducts from "./pages/moderator/ModProducts.jsx";
import ModReviews from "./pages/moderator/ModReviews.jsx";
import ModDisputes from "./pages/moderator/ModDisputes.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminSellers from "./pages/admin/AdminSellers.jsx";
import AdminModerators from "./pages/admin/AdminModerators.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/buyer"
            element={
              <ProtectedRoute allowedRoles={["BUYER"]}>
                <BuyerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/buyer/dashboard" replace />} />
            <Route path="dashboard" element={<BuyerDashboard />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["SELLER"]}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/seller/dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="apply" element={<SellerApply />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/new" element={<SellerProductForm />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="returns" element={<SellerReturns />} />
          </Route>

          <Route
            path="/moderator"
            element={
              <ProtectedRoute allowedRoles={["MODERATOR"]}>
                <ModLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/moderator/dashboard" replace />} />
            <Route path="dashboard" element={<ModDashboard />} />
            <Route path="sellers" element={<ModSellers />} />
            <Route path="products" element={<ModProducts />} />
            <Route path="reviews" element={<ModReviews />} />
            <Route path="disputes" element={<ModDisputes />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="moderators" element={<AdminModerators />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
