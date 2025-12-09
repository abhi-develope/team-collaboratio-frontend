import axios, { AxiosInstance } from "axios";
import { ApiResponse, Message, Project, Task, Team, User, Role } from "@/types";

type AuthResponse = { token: string; user: User };
type ProjectsResponse = { projects: Project[] };
type TasksResponse = { tasks: Task[] };
type MessagesResponse = { messages: Message[] };
type TeamResponse = { team: Team; members?: User[] };
type MembersResponse = { members: User[] };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

const unwrap = <T>(data: ApiResponse<T> | T): T =>
  (data as ApiResponse<T>)?.data ?? (data as T);

export const authAPI = {
  register: async (email: string, password: string, name: string, role: Role) => {
    const { data } = await api.post<ApiResponse<AuthResponse> | AuthResponse>(
      "/auth/register",
      {
        email,
        password,
        name,
        role,
      }
    );
    return { data: unwrap<AuthResponse>(data) };
  },
  login: async (email: string, password: string) => {
    const { data } = await api.post<ApiResponse<AuthResponse> | AuthResponse>(
      "/auth/login",
      { email, password }
    );
    return { data: unwrap<AuthResponse>(data) };
  },
  getMe: async () => {
    const { data } = await api.get<ApiResponse<AuthResponse> | AuthResponse>(
      "/auth/me"
    );
    return { data: unwrap<AuthResponse>(data) };
  },
};

export const projectAPI = {
  getAll: async (teamId?: string) => {
    const { data } = await api.get<ApiResponse<ProjectsResponse> | ProjectsResponse>(
      "/projects",
      { params: { teamId } }
    );
    return { data: unwrap<ProjectsResponse>(data) };
  },
  create: async (projectData: Partial<Project> & { teamId: string }) => {
    const { data } = await api.post<ApiResponse<{ project: Project }> | { project: Project }>(
      "/projects",
      projectData
    );
    return { data: unwrap<{ project: Project }>(data) };
  },
  update: async (id: string, projectData: Partial<Project>) => {
    const { data } = await api.put<ApiResponse<{ project: Project }> | { project: Project }>(
      `/projects/${id}`,
      projectData
    );
    return { data: unwrap<{ project: Project }>(data) };
  },
  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<{ success: boolean }> | { success: boolean }>(
      `/projects/${id}`
    );
    return { data: unwrap<{ success: boolean }>(data) };
  },
};

export const taskAPI = {
  getAll: async (projectId?: string) => {
    const { data } = await api.get<ApiResponse<TasksResponse> | TasksResponse>(
      "/tasks",
      { params: { projectId } }
    );
    return { data: unwrap<TasksResponse>(data) };
  },
  create: async (taskData: Partial<Task>) => {
    const { data } = await api.post<ApiResponse<{ task: Task }> | { task: Task }>(
      "/tasks",
      taskData
    );
    return { data: unwrap<{ task: Task }>(data) };
  },
  update: async (id: string, taskData: Partial<Task>) => {
    const { data } = await api.put<ApiResponse<{ task: Task }> | { task: Task }>(
      `/tasks/${id}`,
      taskData
    );
    return { data: unwrap<{ task: Task }>(data) };
  },
  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<{ success: boolean }> | { success: boolean }>(
      `/tasks/${id}`
    );
    return { data: unwrap<{ success: boolean }>(data) };
  },
};

export const messageAPI = {
  getAll: async (limit = 100) => {
    const { data } = await api.get<ApiResponse<MessagesResponse> | MessagesResponse>(
      "/messages",
      { params: { limit } }
    );
    return { data: unwrap<MessagesResponse>(data) };
  },
  send: async (content: string) => {
    const { data } = await api.post<ApiResponse<{ message: Message }> | { message: Message }>(
      "/messages",
      { content }
    );
    return { data: unwrap<{ message: Message }>(data) };
  },
};

export const teamAPI = {
  create: async (teamData: Partial<Team>) => {
    const { data } = await api.post<ApiResponse<TeamResponse> | TeamResponse>(
      "/teams",
      teamData
    );
    return { data: unwrap<TeamResponse>(data) };
  },
  getMyTeam: async () => {
    const { data } = await api.get<ApiResponse<TeamResponse> | TeamResponse>(
      "/teams/my-team"
    );
    return { data: unwrap<TeamResponse>(data) };
  },
  getMembers: async (teamId: string) => {
    const { data } = await api.get<ApiResponse<MembersResponse> | MembersResponse>(
      `/teams/${teamId}/members`
    );
    return { data: unwrap<MembersResponse>(data) };
  },
  getAllMembers: async () => {
    const { data } = await api.get<ApiResponse<MembersResponse> | MembersResponse>(
      "/teams/members/all"
    );
    return { data: unwrap<MembersResponse>(data) };
  },
};

export default api;

