<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toApplicationPayload } from "@/helpers/applicationForm";
import { createTableQuery, syncRouteQuery, toSortQuery } from "@/helpers/routeQuery";
import { useApplicationsStore } from "@/stores/applications";
import BaseTable from "@/components/table/BaseTable.vue";
import TableFilters from "@/components/TableFilters.vue";
import BaseIconButton from "@/ui/button/BaseIconButton.vue";
import BaseButton from "@/ui/button/BaseButton.vue";
import ApplicationModal from "@/components/modal/ApplicationModal.vue";

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
  { title: "", key: "actions" },
];

const router = useRouter();
const route = useRoute();

const tableQuery = ref(createTableQuery(route.query));

const modalState = ref(false);

const applicationsStore = useApplicationsStore();
const application = ref(null);
const formLoading = ref(false);
const serverError = ref(null);

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

function openCreate() {
  application.value = null;
  serverError.value = null;
  formLoading.value = false;
  modalState.value = true;
}

async function openEdit(id) {
  application.value = { id };
  serverError.value = null;
  formLoading.value = true;
  modalState.value = true;

  try {
    application.value = await applicationsStore.fetchApplication(id);
  } catch {
    serverError.value = { message: "Заявку не знайдено." };
  } finally {
    formLoading.value = false;
  }
}

watch(modalState, (isOpen) => {
  if (!isOpen) {
    application.value = null;
    serverError.value = null;
    formLoading.value = false;
  }
});

async function handleSubmit(form) {
  const applicationId = application.value?.id;
  formLoading.value = true;
  serverError.value = null;

  try {
    const payload = toApplicationPayload(form);

    if (applicationId != null && applicationId !== "") {
      await applicationsStore.updateApplication(applicationId, payload);
    } else {
      await applicationsStore.createApplication(payload);
    }

    modalState.value = false;
    await loadApplications();
  } catch (error) {
    serverError.value = error;
  } finally {
    formLoading.value = false;
  }
}

onMounted(loadApplications);
</script>

<template>
  <div class="applications-page">
    <div class="applications-page__toolbar">
      <TableFilters
        v-model:search="tableQuery.search"
        v-model:status="tableQuery.status"
        @update:search="handleSearchUpdate"
        @update:status="handleStatusUpdate"
        @clear="clearFilters"
        :can-clear-filters="canClearFilters"
      />
      <BaseButton class="create-application__btn" color="primary" @click="openCreate">Створити заявку</BaseButton>
    </div>

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
      <template #createdAt="{ value }"> {{ value ? new Date(value).toLocaleDateString() : "-" }} </template>
      <template #actions="{ item }">
        <BaseIconButton @click="openEdit(item.id)" icon="mdi-pencil" size="small" variant="text" />
      </template>
    </BaseTable>
    <ApplicationModal
      v-model="modalState"
      :application="application"
      :loading="formLoading"
      :server-error="serverError"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.applications-page {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.applications-page__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.applications-page__toolbar .table-filters {
  flex-grow: 1;
}

@media screen and (max-width: 768px) {
  .applications-page__toolbar {
    flex-direction: column;
    width: 100%;
  }

  .applications-page__toolbar .create-application__btn {
    margin-right: auto;
  }
}

@media screen and (max-width: 500px) {
  .applications-page__toolbar .create-application__btn {
    width: 100%;
  }
}
</style>
