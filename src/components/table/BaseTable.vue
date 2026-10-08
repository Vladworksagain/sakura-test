<script setup>
import { computed } from "vue";
import BasePagination from "@/components/BasePagination.vue";

const props = defineProps({
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
  sortBy: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:page", "update:sortBy"]);

const customKeySort = computed(() => Object.fromEntries(props.headers.map((header) => [header.key, () => 0])));
</script>
<template>
  <div class="base-table">
    <VDataTable
      :loading="loading"
      :headers="headers"
      :header-props="{ class: 'bg-grey-lighten-2' }"
      :items="items"
      :hide-default-footer="hideDefaultFooter"
      :no-data-text="noDataText"
      :loading-text="loadingText"
      :items-per-page="-1"
      :sort-by="sortBy"
      :custom-key-sort="customKeySort"
      :multi-sort="true"
      :fixed-header="true"
      color="primary"
      @update:sort-by="emit('update:sortBy', $event)"
    >
      <template v-for="header in headers" :key="header.key" #[`item.${header.key}`]="{ value, item }">
        <slot :name="header.key" :value="value" :item="item">
          {{ value }}
        </slot>
      </template>
    </VDataTable>
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

<style scoped>
.base-table {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
}

.base-table :deep(.v-table) {
  flex: 0 1 auto;
  max-height: calc(100% - 52px);
  overflow: hidden;
}

.base-table :deep(.v-table__wrapper) {
  max-height: 100%;
  overflow: auto;
}

.base-table :deep(.v-pagination) {
  flex-shrink: 0;
}
</style>
