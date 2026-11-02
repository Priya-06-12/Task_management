import axios from "axios";

// The API URL comes from the Vite env file (VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Turn any Axios error into a readable message for the UI
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") return "The request timed out. Please try again.";
  if (error.request) return "Cannot reach the server. Check that the backend is running.";
  return "Something went wrong. Please try again.";
};

export const fetchTasks = async ({ status = "All", search = "" } = {}) => {
  const { data } = await api.get("/tasks", { params: { status, search } });
  return data.data;
};

export const fetchStats = async () => {
  const { data } = await api.get("/tasks/stats");
  return data.data;
};

export const createTask = async (task) => {
  const { data } = await api.post("/tasks", task);
  return data.data;
};

export const updateTask = async (id, task) => {
  const { data } = await api.put(`/tasks/${id}`, task);
  return data.data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data.data;
};
