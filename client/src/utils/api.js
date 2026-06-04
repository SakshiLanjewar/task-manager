import axios from "axios";

/**
 * Centralized API client.
 * All backend calls funnel through here so that
 * base URL and error handling stay in one place.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// ─── Response interceptor: normalize errors ───────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.message ||
      err.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ─── Task API methods ─────────────────────────────────────────────────────────

/** Fetch all tasks (optionally filter by status or priority) */
export const getTasks = (params = {}) => api.get("/tasks", { params });

/** Create a new task */
export const createTask = (taskData) => api.post("/tasks", taskData);

/** Update an existing task by ID */
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);

/** Delete a task by ID */
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

/**
 * Bulk-update order + status after a drag-and-drop.
 * @param {Array<{id, status, order}>} updates
 */
export const reorderTasks = (updates) => api.patch("/tasks/reorder", { updates });

export default api;
