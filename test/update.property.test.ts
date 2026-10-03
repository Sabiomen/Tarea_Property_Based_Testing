import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { NotFoundError } from "../src/task";
import { TaskService } from "../src/task-service";
import { createInputArb, updatePatchArb } from "./arbitraries";

describe("Propiedad: UPDATE", () => {
  it("actualizar aplica solo los campos del patch, conserva el id y persiste el cambio", () => {
    fc.assert(
      fc.property(createInputArb, updatePatchArb, (input, patch) => {
        const svc = new TaskService();
        const original = svc.create(input);

        const updated = svc.update(original.id, patch);

        expect(updated).toEqual({ ...original, ...patch, id: original.id });
        expect(svc.getById(original.id)).toEqual(updated);
        expect(svc.count()).toBe(1);
      })
    );
  });

  it("actualizar una tarea no afecta a las demás", () => {
    fc.assert(
      fc.property(
        fc.array(createInputArb, { minLength: 2, maxLength: 20 }),
        fc.nat(),
        updatePatchArb,
        (inputs, rawIdx, patch) => {
          const svc = new TaskService();
          const created = inputs.map((i) => svc.create(i));
          const idx = rawIdx % created.length;

          svc.update(created[idx].id, patch);

          created.forEach((t, i) => {
            if (i !== idx) expect(svc.getById(t.id)).toEqual(t);
          });
        }
      )
    );
  });

  it("actualizar un id inexistente siempre lanza NotFoundError", () => {
    fc.assert(
      fc.property(fc.uuid(), updatePatchArb, (id, patch) => {
        const svc = new TaskService();
        expect(() => svc.update(id, patch)).toThrow(NotFoundError);
      })
    );
  });
});