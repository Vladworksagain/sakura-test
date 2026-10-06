import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { apiFetch } from "@/api/http";

export const useApplicationsStore = defineStore("applications", () => {
  // state //
  const applications = ref([]);
  const paginationMeta = ref({});
  const loading = ref(false);

  // actions //
  const fetchApplications = async (
    params = {
      _page: 1,
    }
  ) => {
    loading.value = true;

    try {
      const { data, ...rest } = await apiFetch("/applications", {
        query: { _per_page: 15, ...params },
      });
      applications.value = data;
      paginationMeta.value = rest;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // getters //
  const getApplications = computed(() => applications.value);
  const getLoading = computed(() => loading.value);
  const getPaginationMeta = computed(() => paginationMeta.value);

  return { applications, fetchApplications, getApplications, getLoading, getPaginationMeta };
});
