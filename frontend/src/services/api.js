import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 15000,
});
export const getHealth = () => api.get("/api/v1/health");
export const importTransactions = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/api/v1/transactions/import", form);
};
export const getTransactions = (params = {}) => api.get("/api/v1/transactions", { params });
export const changeCategory = (id, category) => api.patch(`/api/v1/transactions/${id}`, { category });
export const getSummary = (month) => api.get("/api/v1/summary", { params: { month } });
export const getBudgets = (month) => api.get("/api/v1/budgets", { params: { month } });
export const saveBudget = (body) => api.put("/api/v1/budgets", body);
export default api;

export const getForecast = (month) => api.get("/api/v1/forecast", { params: { month } });

export const getBills = (status) => api.get('/api/v1/bills', { params: status ? { status } : {} });
export const createBill = (body) => api.post('/api/v1/bills', body);
export const markBillPaid = (id) => api.patch(`/api/v1/bills/${id}/paid`);
export const simulatePurchase = (body) => api.post('/api/v1/simulations/purchase', body);

export const askAssistant = (body) => api.post('/api/v1/assistant/chat', body, { timeout: 30000 });
