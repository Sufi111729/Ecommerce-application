import api from "./axios";

export const getCart = () => api.get("/cart");
export const addToCart = (payload) => api.post("/cart/add", payload);
export const updateCart = (payload) => api.put("/cart/update", payload);
export const removeFromCart = (variantId) => api.delete(`/cart/remove/${variantId}`);
export const checkout = () => api.post("/checkout");
