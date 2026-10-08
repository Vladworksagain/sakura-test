<script setup>
import { VDateInput } from "vuetify/labs/VDateInput";

defineProps({
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  errorMessages: {
    type: [String, Array],
    default: "",
  },
  hideDetails: {
    type: [Boolean, String],
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  inputFormat: {
    type: String,
    default: "dd.mm.yyyy",
  },
});

const model = defineModel();
</script>

<template>
  <VDateInput
    v-model="model"
    :label="label"
    :placeholder="placeholder"
    :error-messages="errorMessages"
    :hide-details="hideDetails"
    :disabled="disabled"
    variant="outlined"
    prepend-icon=""
    prepend-inner-icon="mdi-calendar"
    :input-format="inputFormat"
  />
</template>
