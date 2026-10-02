import { describe, expect, it } from "vitest";
import { TaskService } from "../src/task-service";

describe("TaskService (tests por ejemplo)", () => {
  it("crea una tarea con valores por defecto", () => {
    const svc = new TaskService();
    const t = svc.create({ title: "Estudiar" });
    expect(t.status).toBe("pending");
    expect(t.description).toBe("");
  });
});