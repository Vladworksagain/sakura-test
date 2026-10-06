<script setup>
defineProps({
  page: {
    type: Number,
    default: 1,
  },
  density: {
    type: String,
    default: "default",
  },
  length: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:page"]);
</script>
<template>
  <VPagination
    :length="length"
    :density="density"
    :disabled="disabled"
    :model-value="page"
    @update:model-value="emit('update:page', $event)"
  />
</template>
