import fc from "fast-check";
import { TASK_STATUSES } from "../src/task";

export const titleArb = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0);

export const blankTitleArb = fc
  .array(fc.constantFrom(" ", "\t", "\n"), { maxLength: 20 })
  .map((chars) => chars.join(""));

export const tooLongTitleArb = fc.string({ minLength: 101, maxLength: 300 });

export const statusArb = fc.constantFrom(...TASK_STATUSES);

export const createInputArb = fc.record(
  {
    title: titleArb,
    description: fc.string({ maxLength: 300 }),
    status: statusArb,
  },
  { requiredKeys: ["title"] }
);

export const updatePatchArb = fc.record(
  {
    title: titleArb,
    description: fc.string({ maxLength: 300 }),
    status: statusArb,
  },
  { requiredKeys: [] }
);