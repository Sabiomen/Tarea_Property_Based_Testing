import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { ValidationError } from "../src/task";
import { TaskService } from "../src/task-service";
import {
  blankTitleArb,
  createInputArb,
  tooLongTitleArb,
} from "./arbitraries";

describe("Propiedad: CREATE", () => {
  it("toda entrada válida crea una tarea que conserva sus datos, con id único y defaults correctos", () => {
    fc.assert(
      fc.property(
        fc.array(createInputArb, { minLength: 1, maxLength: 30 }),
        (inputs) => {
          const svc = new TaskService();
          const created = inputs.map((i) => svc.create(i));

          expect(new Set(created.map((t) => t.id)).size).toBe(created.length);

          created.forEach((task, idx) => {
            const input = inputs[idx];
            expect(task.title).toBe(input.title);
            expect(task.description).toBe(input.description ?? "");
            expect(task.status).toBe(input.status ?? "pending");
          });

          expect(svc.count()).toBe(inputs.length);
        }
      )
    );
  });

  it("todo título vacío, solo espacios o demasiado largo es rechazado y no altera el sistema", () => {
    fc.assert(
      fc.property(
        fc.oneof(blankTitleArb, tooLongTitleArb),
        (badTitle) => {
          const svc = new TaskService();
          expect(() => svc.create({ title: badTitle })).toThrow(ValidationError);
          expect(svc.count()).toBe(0);
        }
      )
    );
  });
});