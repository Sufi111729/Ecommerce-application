import api from "./axios";

export const createReview = (payload) => api.post("/reviews", payload);
