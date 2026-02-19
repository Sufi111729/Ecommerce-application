import api from "./axios";

export const pendingProducts = () => api.get("/mod/products/pending");
export const approveProduct = (id) => api.post(`/mod/products/${id}/approve`);
export const rejectProduct = (id) => api.post(`/mod/products/${id}/reject`);
export const pendingSellers = () => api.get("/mod/sellers/pending");
export const approveSeller = (id) => api.post(`/mod/sellers/${id}/approve`);
export const rejectSeller = (id) => api.post(`/mod/sellers/${id}/reject`);
export const pendingReviews = () => api.get("/mod/reviews/pending");
export const approveReview = (id) => api.post(`/mod/reviews/${id}/approve`);
export const rejectReview = (id) => api.post(`/mod/reviews/${id}/reject`);
export const listDisputes = () => api.get("/mod/disputes");
export const resolveDispute = (id, payload) => api.post(`/mod/disputes/${id}/resolve`, payload);
