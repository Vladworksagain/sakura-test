<script setup>
import BaseTable from "@/components/table/BaseTable.vue";
import { onMounted, ref, computed, watch } from "vue";
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
const page = ref(Number(route.query.page) || 1);

const applicationsStore = useApplicationsStore();

const applications = computed(() => applicationsStore.getApplications);
const loading = computed(() => applicationsStore.getLoading);
const paginationMeta = computed(() => applicationsStore.getPaginationMeta);

watch(page, async (newVal) => {
  buildQuery({ page: newVal });
  await applicationsStore.fetchApplications({ _page: newVal });
});

const buildQuery = (params) => {
  router.push({ query: { ...router.query, ...params } });
};

onMounted(async () => {
  await applicationsStore.fetchApplications({ _page: page.value });
});
</script>

<template>
  <div>
    <BaseTable :headers="headers" :items="applications" :loading="loading" :meta="paginationMeta" v-model:page="page" />
  </div>
</template>
