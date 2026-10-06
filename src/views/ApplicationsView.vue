<script setup>
import BaseTable from "@/components/table/BaseTable.vue";
import TableFilters from "@/components/TableFilters.vue";
import { createTableQuery, syncRouteQuery, toSortQuery } from "@/helpers/routeQuery";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useApplicationsStore } from "@/stores/applications";

const headers = [
  { title: "ID", key: "id", width: "80px" },
  { title: "Назва", key: "title" },
  { title: "Тип", key: "type" },
  { title: "Статус", key: "status" },
  { title: "Виконавець", key: "assignee" },
  { title: "Сума", key: "amount", align: "end" },
  { title: "Дата", key: "deadline" },
  { title: "Кількість", key: "quantity", align: "end" },
  { title: "Створено", key: "createdAt" },
];

const router = useRouter();
const route = useRoute();

const tableQuery = ref(createTableQuery(route.query));

const applicationsStore = useApplicationsStore();

const applications = computed(() => applicationsStore.getApplications);
const loading = computed(() => applicationsStore.getLoading);
const paginationMeta = computed(() => applicationsStore.getPaginationMeta);
const canClearFilters = computed(() => {
  const query = tableQuery.value;

  return Boolean(query.search || query.status || query.sortBy.length);
});

function syncRoute() {
  syncRouteQuery(router, route, tableQuery.value);
}

async function loadApplications() {
  const state = tableQuery.value;
  const search = state.search.trim();

  syncRoute();
  await applicationsStore.fetchApplications({
    "_page": state.page,
    "_sort": toSortQuery(state.sortBy),
    "title:contains": search || undefined,
    "status": state.status || undefined,
  });
}

function resetPageAndLoad() {
  tableQuery.value.page = 1;
  return loadApplications();
}

const handleSearchUpdate = async (value) => {
  tableQuery.value.search = value ?? "";
  await resetPageAndLoad();
};

const handleStatusUpdate = async (value) => {
  tableQuery.value.status = value || null;
  await resetPageAndLoad();
};

function clearFilters() {
  const query = tableQuery.value;

  query.search = "";
  query.status = null;
  query.sortBy = [];
  query.page = 1;
  loadApplications();
}

const handlePageUpdate = async (nextPage) => {
  tableQuery.value.page = nextPage;
  await loadApplications();
};

const handleSortUpdate = async (nextSort) => {
  tableQuery.value.sortBy = nextSort;
  await resetPageAndLoad();
};

onMounted(loadApplications);
</script>

<template>
  <div class="applications-page">
    <TableFilters
      v-model:search="tableQuery.search"
      v-model:status="tableQuery.status"
      @update:search="handleSearchUpdate"
      @update:status="handleStatusUpdate"
      @clear="clearFilters"
      :can-clear-filters="canClearFilters"
    />
    <BaseTable
      :headers="headers"
      :items="applications"
      :loading="loading"
      :meta="paginationMeta"
      v-model:page="tableQuery.page"
      v-model:sort-by="tableQuery.sortBy"
      @update:page="handlePageUpdate"
      @update:sort-by="handleSortUpdate"
    >
      <template #quantity="{ value }"> {{ value ?? "-" }} </template>
      <template #deadline="{ value }"> {{ value ? new Date(value).toLocaleDateString() : "-" }} </template>
    </BaseTable>
  </div>
</template>

<style scoped>
.applications-page {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}
</style>
