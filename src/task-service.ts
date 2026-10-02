import { randomUUID } from "node:crypto";
import {
  CreateTaskInput,
  NotFoundError,
  Task,
  TASK_STATUSES,
  UpdateTaskInput,
  ValidationError,
} from "./task";

function validateTitle(title: unknown): asserts title is string {
  if (typeof title !== "string" || title.trim().length === 0) {
    throw new ValidationError("El título no puede estar vacío");
  }
  if (title.length > 100) {
    throw new ValidationError("El título no puede superar 100 caracteres");
  }
}

function validateStatus(status: unknown): void {
  if (!TASK_STATUSES.includes(status as never)) {
    throw new ValidationError("Estado inválido");
  }
}

export class TaskService {
  private tasks = new Map<string, Task>();

  create(input: CreateTaskInput): Task {
    validateTitle(input.title);
    if (input.status !== undefined) validateStatus(input.status);

    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description ?? "",
      status: input.status ?? "pending",
    };
    this.tasks.set(task.id, task);
    return { ...task };
  }

  getById(id: string): Task | undefined {
    const task = this.tasks.get(id);
    return task ? { ...task } : undefined;
  }

  list(): Task[] {
    return [...this.tasks.values()].map((t) => ({ ...t }));
  }

  update(id: string, patch: UpdateTaskInput): Task {
    const existing = this.tasks.get(id);
    if (!existing) throw new NotFoundError(id);

    if (patch.title !== undefined) validateTitle(patch.title);
    if (patch.status !== undefined) validateStatus(patch.status);

    const updated: Task = { ...existing, ...patch, id: existing.id };
    this.tasks.set(id, updated);
    return { ...updated };
  }

  delete(id: string): void {
    if (!this.tasks.delete(id)) throw new NotFoundError(id);
  }

  count(): number {
    return this.tasks.size;
  }
}