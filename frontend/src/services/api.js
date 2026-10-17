import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("monetra_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && !error.config?.url?.includes("/auth/")) {
    localStorage.removeItem("monetra_token");
    window.dispatchEvent(new Event("monetra-auth-expired"));
  }
  return Promise.reject(error);
});

export const register = (body) => api.post("/api/v1/auth/register", body);
export const login = (body) => api.post("/api/v1/auth/login", body);
export const logout = () => api.post("/api/v1/auth/logout");
export const getMe = () => api.get("/api/v1/auth/me");
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
export const getForecast = (month) => api.get("/api/v1/forecast", { params: { month } });
export const getBills = (status) => api.get("/api/v1/bills", { params: status ? { status } : {} });
export const createBill = (body) => api.post("/api/v1/bills", body);
export const markBillPaid = (id) => api.patch(`/api/v1/bills/${id}/paid`);
export const simulatePurchase = (body) => api.post("/api/v1/simulations/purchase", body);
export const askAssistant = (body) => api.post("/api/v1/assistant/chat", body, { timeout: 30000 });

export default api;
