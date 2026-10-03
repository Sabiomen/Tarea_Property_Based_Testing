import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { CreateTaskInput, Task, UpdateTaskInput } from "../src/task";
import { TaskService } from "../src/task-service";
import { createInputArb, updatePatchArb } from "./arbitraries";

type Op =
  | { kind: "create"; input: CreateTaskInput }
  | { kind: "update"; idx: number; patch: UpdateTaskInput }
  | { kind: "delete"; idx: number };

const opArb: fc.Arbitrary<Op> = fc.oneof(
  createInputArb.map((input): Op => ({ kind: "create", input })),
  fc
    .tuple(fc.nat(), updatePatchArb)
    .map(([idx, patch]): Op => ({ kind: "update", idx, patch })),
  fc.nat().map((idx): Op => ({ kind: "delete", idx }))
);

describe("Propiedad de modelo: secuencias aleatorias de operaciones", () => {
  it("el servicio siempre coincide con un modelo de referencia", () => {
    fc.assert(
      fc.property(fc.array(opArb, { maxLength: 60 }), (ops) => {
        const svc = new TaskService();
        const model: Task[] = [];

        for (const op of ops) {
          if (op.kind === "create") {
            model.push(svc.create(op.input));
          } else if (model.length > 0) {
            const i = op.idx % model.length;
            if (op.kind === "update") {
              model[i] = svc.update(model[i].id, op.patch);
            } else {
              svc.delete(model[i].id);
              model.splice(i, 1);
            }
          }
        }

        expect(svc.count()).toBe(model.length);
        model.forEach((t) => expect(svc.getById(t.id)).toEqual(t));
      })
    );
  });
});