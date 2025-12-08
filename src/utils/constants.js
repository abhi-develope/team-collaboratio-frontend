export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
};

export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  DONE: "done",
};

export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: "bg-gray-500",
  [TASK_STATUS.IN_PROGRESS]: "bg-blue-500",
  [TASK_STATUS.DONE]: "bg-green-500",
};

export const STATUS_LABELS = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.DONE]: "Done",
};
