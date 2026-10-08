import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

import { apiFetch } from "@/api/http";
import { useApplicationsStore } from "@/stores/applications";

vi.mock("@/api/http", () => ({
  apiFetch: vi.fn(),
}));

const page = {
  data: [{ id: 1, title: "Доставка документів" }],
  first: 1,
  prev: null,
  next: 2,
  last: 4,
  pages: 4,
  items: 52,
};

describe("useApplicationsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    apiFetch.mockReset();
  });

  it("stores the page and clears loading after a successful fetch", async () => {
    let resolveFetch;
    apiFetch.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        })
    );

    const store = useApplicationsStore();
    const pending = store.fetchApplications({ _page: 2, status: "нова" });

    expect(store.getLoading).toBe(true);

    resolveFetch(page);
    await pending;

    expect(apiFetch).toHaveBeenCalledWith("/applications", {
      query: { _per_page: 15, _page: 2, status: "нова" },
    });
    expect(store.getApplications).toEqual(page.data);
    expect(store.getPaginationMeta).toEqual({
      first: 1,
      prev: null,
      next: 2,
      last: 4,
      pages: 4,
      items: 52,
    });
    expect(store.getLoading).toBe(false);
  });

  it("keeps the current page when a later fetch fails", async () => {
    const error = new Error("Cannot reach the API. Start it with npm run server.");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    apiFetch.mockResolvedValueOnce(page).mockRejectedValueOnce(error);

    const store = useApplicationsStore();
    await store.fetchApplications();

    await store.fetchApplications({ _page: 2 });

    expect(store.getApplications).toEqual(page.data);
    expect(store.getPaginationMeta).toEqual({
      first: 1,
      prev: null,
      next: 2,
      last: 4,
      pages: 4,
      items: 52,
    });
    expect(store.getLoading).toBe(false);
    expect(consoleError).toHaveBeenCalledWith(error);

    consoleError.mockRestore();
  });

  it("loads a single application by id", async () => {
    const application = { id: 7, title: "Закупівля паперу", type: "товар" };
    apiFetch.mockResolvedValue(application);

    const store = useApplicationsStore();

    await expect(store.fetchApplication(7)).resolves.toEqual(application);
    expect(apiFetch).toHaveBeenCalledWith("/applications/7");
  });

  it("creates an application with the given payload", async () => {
    const payload = { title: "Доставка", type: "послуга", amount: 850 };
    apiFetch.mockResolvedValue({ id: 8, ...payload });

    const store = useApplicationsStore();

    await expect(store.createApplication(payload)).resolves.toEqual({ id: 8, ...payload });
    expect(apiFetch).toHaveBeenCalledWith("/applications", { method: "POST", body: payload });
  });

  it("updates an application by id", async () => {
    const payload = { title: "Оновлена заявка", status: "в роботі" };
    apiFetch.mockResolvedValue({ id: 4, ...payload });

    const store = useApplicationsStore();

    await expect(store.updateApplication(4, payload)).resolves.toEqual({ id: 4, ...payload });
    expect(apiFetch).toHaveBeenCalledWith("/applications/4", { method: "PUT", body: payload });
  });
});
