<script setup>
import BasePagination from "@/components/BasePagination.vue";

defineProps({
  headers: {
    type: Array,
    default: () => [],
    required: true,
  },
  items: {
    type: Array,
    default: () => [],
    required: true,
  },
  page: {
    type: Number,
    default: 1,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hideDefaultFooter: {
    type: Boolean,
    default: true,
  },
  noDataText: {
    type: String,
    default: "Дані відсутні",
  },
  loadingText: {
    type: String,
    default: "Завантаження...",
  },
  meta: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits(["update:page"]);
</script>
<template>
  <div>
    <VDataTable
      :loading="loading"
      :headers="headers"
      :items="items"
      :hide-default-footer="hideDefaultFooter"
      :no-data-text="noDataText"
      :loading-text="loadingText"
      :items-per-page="-1"
    />
    <BasePagination
      v-if="meta.pages > 1"
      :length="meta.pages"
      :disabled="loading"
      density="compact"
      :model-value="page"
      @update:model-value="emit('update:page', $event)"
    />
  </div>
</template>
