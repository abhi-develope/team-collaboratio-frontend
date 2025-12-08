import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  register: async (email, password, name, role) => {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      name,
      role,
    });
    return data;
  },
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

export const projectAPI = {
  getAll: async (teamId) => {
    const { data } = await api.get("/projects", { params: { teamId } });
    return data;
  },
  create: async (projectData) => {
    const { data } = await api.post("/projects", projectData);
    return data;
  },
  update: async (id, projectData) => {
    const { data } = await api.put(`/projects/${id}`, projectData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },
};

export const taskAPI = {
  getAll: async (projectId) => {
    const { data } = await api.get("/tasks", { params: { projectId } });
    return data;
  },
  create: async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    return data;
  },
  update: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },
};

export const messageAPI = {
  getAll: async (teamId, limit = 50) => {
    const { data } = await api.get("/messages", { params: { teamId, limit } });
    return data;
  },
  send: async (content, teamId) => {
    const { data } = await api.post("/messages", { content, teamId });
    return data;
  },
};

export default api;
