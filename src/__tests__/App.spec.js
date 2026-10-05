import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import App from "../App.vue";

const sampleApplication = {
  id: "1",
  title: "Document delivery",
  type: "послуга",
  status: "нова",
  assignee: "Олена Коваль",
  amount: 1500,
  deadline: "2026-11-01",
  createdAt: "2026-10-01T09:00:00.000Z",
};

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [sampleApplication],
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads applications from the API", async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createVuetify()],
      },
    });

    expect(wrapper.text()).toContain("Applications");

    await flushPromises();

    expect(fetch).toHaveBeenCalledWith("/api/applications");
    expect(wrapper.text()).toContain("Document delivery");
    expect(wrapper.text()).toContain("Олена Коваль");
  });
});
