<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  errorMessages: {
    type: [String, Array],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: "",
  },
  hideDetails: {
    type: [Boolean, String],
    default: true,
  },
  debounce: {
    type: Number,
    default: 0,
  },
});

const model = defineModel();
</script>
<template>
  <VNumberInput
    v-model="model"
    :label="label"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :disabled="disabled"
    :error-messages="errorMessages"
    :hide-details="hideDetails"
    :input-class="inputClass"
    variant="outlined"
    control-variant="split"
  />
</template>
