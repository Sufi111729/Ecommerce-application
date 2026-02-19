import api from "./axios";

export const registerBuyer = (payload) => api.post("/auth/buyer/register", payload);
export const registerSeller = (payload) => api.post("/auth/seller/register", payload);
export const registerModerator = (payload) => api.post("/auth/moderator/register", payload);

export const loginBuyer = (payload) => api.post("/auth/buyer/login", payload);
export const loginSeller = (payload) => api.post("/auth/seller/login", payload);
export const loginModerator = (payload) => api.post("/auth/moderator/login", payload);
export const loginAdmin = (payload) => api.post("/auth/admin/login", payload);

export const sellerApply = (payload) => api.post("/auth/seller/apply", payload);
