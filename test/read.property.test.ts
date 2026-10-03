import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { TaskService } from "../src/task-service";
import { createInputArb } from "./arbitraries";

describe("Propiedad: READ", () => {
  it("getById devuelve exactamente la tarea creada, y list contiene todas las creadas", () => {
    fc.assert(
      fc.property(
        fc.array(createInputArb, { maxLength: 30 }),
        (inputs) => {
          const svc = new TaskService();
          const created = inputs.map((i) => svc.create(i));

          created.forEach((t) => expect(svc.getById(t.id)).toEqual(t));

          const listed = svc.list();
          expect(listed).toHaveLength(created.length);
          expect(listed).toEqual(expect.arrayContaining(created));
        }
      )
    );
  });

  it("getById de un id inexistente siempre devuelve undefined", () => {
    fc.assert(
      fc.property(
        fc.array(createInputArb, { maxLength: 10 }),
        fc.uuid(),
        (inputs, randomId) => {
          const svc = new TaskService();
          inputs.forEach((i) => svc.create(i));
          expect(svc.getById(randomId)).toBeUndefined();
        }
      )
    );
  });

  it("leer no modifica el estado (modificar el resultado devuelto no afecta al sistema)", () => {
    fc.assert(
      fc.property(createInputArb, (input) => {
        const svc = new TaskService();
        const created = svc.create(input);
        const read = svc.getById(created.id)!;
        read.title = "MUTADO";
        expect(svc.getById(created.id)).toEqual(created);
      })
    );
  });
});