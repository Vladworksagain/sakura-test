import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { createVuetify } from "vuetify";

import { routes } from "@/router/routes";
import App from "../App.vue";

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
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders page content in a container limited to 1440px", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });
    const wrapper = mount(App, {
      global: {
        plugins: [createVuetify(), router],
      },
    });

    await router.isReady();
    await flushPromises();

    expect(wrapper.text()).toContain("Назва");
    expect(wrapper.text()).toContain("Виконавець");
    expect(wrapper.text()).toContain("Кількість");

    const container = wrapper.get(".v-container");
    expect(container.attributes("style")).toContain("max-width: 1440px");
  });
});
