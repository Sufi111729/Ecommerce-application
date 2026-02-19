import api from "./axios";

export const listProducts = () => api.get("/products");
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (payload) => api.post("/seller/products", payload);
export const updateProduct = (id, payload) => api.put(`/seller/products/${id}`, payload);
export const submitProduct = (id) => api.post(`/seller/products/${id}/submit`);
