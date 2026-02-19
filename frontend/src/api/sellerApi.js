import api from "./axios";

export const sellerProducts = () => api.get("/seller/products/list");
export const sellerInventorySummary = () => api.get("/seller/inventory/summary");
export const sellerOrders = () => api.get("/seller/orders");
export const updateOrderItemStatus = (id, payload) => api.put(`/seller/order-items/${id}/status`, payload);
export const updateTracking = (id, payload) => api.put(`/seller/order-items/${id}/tracking`, payload);
export const sellerReturns = () => api.get("/seller/returns");
export const approveReturn = (id) => api.post(`/seller/returns/${id}/approve`);
export const rejectReturn = (id) => api.post(`/seller/returns/${id}/reject`);
