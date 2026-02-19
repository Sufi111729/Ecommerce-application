import api from "./axios";

export const listOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);
export const cancelOrderItem = (id) => api.post(`/orders/${id}/cancel-request`);
export const returnOrderItem = (id, payload) => api.post(`/orders/${id}/return-request`, payload);
