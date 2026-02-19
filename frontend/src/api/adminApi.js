import api from "./axios";

export const pendingSellers = () => api.get("/admin/sellers/pending");
export const rejectedSellers = () => api.get("/admin/sellers/rejected");
export const approveSeller = (id) => api.post(`/admin/sellers/${id}/approve`);
export const suspendSeller = (id) => api.post(`/admin/sellers/${id}/suspend`);
export const pendingModerators = () => api.get("/admin/moderators/pending");
export const approveModerator = (id) => api.post(`/admin/moderators/${id}/approve`);
export const suspendModerator = (id) => api.post(`/admin/moderators/${id}/suspend`);
export const createCategory = (payload) => api.post("/admin/categories", payload);
export const updateCommission = (payload) => api.post("/admin/commission", payload);
export const reportSummary = () => api.get("/admin/reports/summary");
export const banUser = (id) => api.post(`/admin/users/${id}/ban`);
