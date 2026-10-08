<script setup>
import BaseSelect from "@/ui/input/BaseSelect.vue";
import BaseTextInput from "@/ui/input/BaseTextInput.vue";
import { APPLICATION_STATUSES } from "@/config/applicationStatuses";

defineProps({
  canClearFilters: {
    type: Boolean,
    default: false,
  },
});

const search = defineModel("search", { type: String, default: "" });
const status = defineModel("status", { default: null });

const emit = defineEmits(["clear"]);
</script>

<template>
  <div class="table-filters">
    <BaseTextInput
      prepend-inner-icon="mdi-magnify"
      clearable
      v-model="search"
      :debounce="500"
      label="Пошук"
      placeholder="Пошук за назвою"
    />
    <BaseSelect
      v-model="status"
      :options="APPLICATION_STATUSES"
      label="Статус"
      placeholder="Фільтр за статусом"
      clearable
    />
    <VBtn
      v-show="canClearFilters"
      icon="mdi-filter-remove"
      variant="text"
      aria-label="Clear filters"
      @click="emit('clear')"
    />
  </div>
</template>

<style scoped>
.table-filters {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
}

.table-filters :deep(.v-input) {
  max-width: 280px;
}

@media screen and (max-width: 768px) {
  .table-filters {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .table-filters :deep(.v-input) {
    max-width: 100%;
    width: 100%;
  }

  .table-filters :deep(.v-btn) {
    align-self: flex-start;
  }
}
</style>
