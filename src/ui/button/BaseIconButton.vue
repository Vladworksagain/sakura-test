<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "default",
  },
  variant: {
    type: String,
    default: "elevated",
  },
  rounded: {
    type: Boolean,
    default: true,
  },
});
</script>
<template>
  <VBtn :icon="icon" :size="size" :variant="variant" :rounded="rounded" />
</template>
