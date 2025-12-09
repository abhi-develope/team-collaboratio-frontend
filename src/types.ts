export type Role = "ADMIN" | "MANAGER" | "MEMBER";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface BaseEntity {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Team extends BaseEntity {
  name: string;
  description?: string;
  members?: User[];
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: Role;
  teamId?: string | Team;
}

export interface Project extends BaseEntity {
  name: string;
  description?: string;
  teamId?: string | Team;
}

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  projectId: string | Project;
  status: TaskStatus;
  assignedTo?: string | User | null;
}

export interface Message extends BaseEntity {
  content: string;
  senderId: string | User;
  timestamp: string | number | Date;
}

export interface ApiResponse<T> {
  data: T;
}

