import { describe, expect, it } from "vitest";

import { APPLICATION_STATUSES } from "../config/applicationStatuses";
import db from "../../server/db.json";

const TYPES = ["послуга", "товар"];
const STATUSES = APPLICATION_STATUSES.map((status) => status.value);

describe("applications mock", () => {
  it("contains at least 50 applications with the expected shape", () => {
    expect(db.applications.length).toBeGreaterThanOrEqual(50);

    const ids = new Set();

    for (const application of db.applications) {
      expect(application).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          assignee: expect.any(String),
          amount: expect.any(Number),
          createdAt: expect.any(String),
        }),
      );
      expect(TYPES).toContain(application.type);
      expect(STATUSES).toContain(application.status);
      expect(Number.isNaN(Date.parse(application.createdAt))).toBe(false);
      expect(ids.has(application.id)).toBe(false);
      ids.add(application.id);

      if (application.type === "послуга") {
        expect(application.deadline).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(application).not.toHaveProperty("quantity");
      } else {
        expect(application.quantity).toEqual(expect.any(Number));
        expect(application.quantity).toBeGreaterThan(0);
        expect(application).not.toHaveProperty("deadline");
      }
    }
  });
});
