<script setup>
defineProps({
  color: {
    type: String,
    default: "primary",
  },
  variant: {
    type: String,
    default: "elevated",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
</script>
<template>
  <VBtn :color="color" :variant="variant" :disabled="disabled" :loading="loading" @click="emit('click')">
    <slot />
  </VBtn>
</template>
