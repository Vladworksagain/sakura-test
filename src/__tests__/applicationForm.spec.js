import { describe, expect, it } from "vitest";

import { validateApplicationForm } from "@/helpers/applicationForm";

const service = {
  title: "Доставка документів",
  type: "послуга",
  status: "нова",
  assignee: "Олена Коваль",
  amount: 850,
  deadline: new Date(2026, 0, 16),
  quantity: null,
};

describe("application form validation", () => {
  it("accepts a complete service", () => {
    expect(validateApplicationForm(service)).toEqual({});
  });

  it("requires the field that matches the selected type", () => {
    expect(validateApplicationForm({ ...service, deadline: null }).deadline).toBe("Deadline is required.");
    expect(
      validateApplicationForm({
        ...service,
        type: "товар",
        deadline: null,
        quantity: null,
      }).quantity,
    ).toBe("Quantity must be an integer greater than 0.");
  });
});
