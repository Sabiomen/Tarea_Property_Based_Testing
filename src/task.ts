export type TaskStatus = "pending" | "in_progress" | "done";

export const TASK_STATUSES: TaskStatus[] = ["pending", "in_progress", "done"];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export type UpdateTaskInput = Partial<Omit<Task, "id">>;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(id: string) {
    super(`Tarea con id ${id} no encontrada`);
    this.name = "NotFoundError";
  }
}