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
    // Handle 401 unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const message = error.response?.data?.message || error.message || "An error occurred";
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
    return { data: data.data || data };
  },
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    return { data: data.data || data };
  },
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return { data: data.data || data };
  },
};

export const projectAPI = {
  getAll: async (teamId) => {
    const { data } = await api.get("/projects", { params: { teamId } });
    return { data: data.data || data };
  },
  create: async (projectData) => {
    const { data } = await api.post("/projects", projectData);
    return { data: data.data || data };
  },
  update: async (id, projectData) => {
    const { data } = await api.put(`/projects/${id}`, projectData);
    return { data: data.data || data };
  },
  delete: async (id) => {
    const { data } = await api.delete(`/projects/${id}`);
    return { data: data.data || data };
  },
};

export const taskAPI = {
  getAll: async (projectId) => {
    const { data } = await api.get("/tasks", { params: { projectId } });
    return { data: data.data || data };
  },
  create: async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    return { data: data.data || data };
  },
  update: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return { data: data.data || data };
  },
  delete: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return { data: data.data || data };
  },
};

export const messageAPI = {
  getAll: async (limit = 100) => {
    const { data } = await api.get("/messages", { params: { limit } });
    return { data: data.data || data };
  },
  send: async (content) => {
    const { data } = await api.post("/messages", { content });
    return { data: data.data || data };
  },
};

export const teamAPI = {
  create: async (teamData) => {
    const { data } = await api.post("/teams", teamData);
    return { data: data.data || data };
  },
  getMyTeam: async () => {
    const { data } = await api.get("/teams/my-team");
    return { data: data.data || data };
  },
  getMembers: async (teamId) => {
    const { data } = await api.get(`/teams/${teamId}/members`);
    return { data: data.data || data };
  },
  getAllMembers: async () => {
    const { data } = await api.get("/teams/members/all");
    return { data: data.data || data };
  },
};

export default api;
