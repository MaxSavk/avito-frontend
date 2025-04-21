import { api } from "./index.js";

export const fetchAllTasks = () => api.get("/tasks");

export const updateTaskStatus = (taskId, status) =>
  api.put(`/tasks/updateStatus/${taskId}`, { status });

