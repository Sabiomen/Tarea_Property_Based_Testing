import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { NotFoundError } from "../src/task";
import { TaskService } from "../src/task-service";
import { createInputArb } from "./arbitraries";

describe("Propiedad: DELETE", () => {
  it("eliminar quita la tarea, reduce el total en 1 y no afecta a las demás", () => {
    fc.assert(
      fc.property(
        fc.array(createInputArb, { minLength: 1, maxLength: 30 }),
        fc.nat(),
        (inputs, rawIdx) => {
          const svc = new TaskService();
          const created = inputs.map((i) => svc.create(i));
          const idx = rawIdx % created.length;
          const target = created[idx];

          svc.delete(target.id);

          expect(svc.getById(target.id)).toBeUndefined();
          expect(svc.count()).toBe(created.length - 1);
          created.forEach((t, i) => {
            if (i !== idx) expect(svc.getById(t.id)).toEqual(t);
          });
        }
      )
    );
  });

  it("eliminar dos veces la misma tarea falla la segunda vez con NotFoundError", () => {
    fc.assert(
      fc.property(createInputArb, (input) => {
        const svc = new TaskService();
        const t = svc.create(input);
        svc.delete(t.id);
        expect(() => svc.delete(t.id)).toThrow(NotFoundError);
      })
    );
  });

  it("eliminar un id inexistente nunca modifica el sistema", () => {
    fc.assert(
      fc.property(
        fc.array(createInputArb, { maxLength: 10 }),
        fc.uuid(),
        (inputs, id) => {
          const svc = new TaskService();
          inputs.forEach((i) => svc.create(i));
          expect(() => svc.delete(id)).toThrow(NotFoundError);
          expect(svc.count()).toBe(inputs.length);
        }
      )
    );
  });
});