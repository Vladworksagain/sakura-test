<script setup>
import { onUnmounted, ref, useSlots, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
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
  prependInnerIcon: {
    type: String,
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
  clearable: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
const model = defineModel();
const text = ref(model.value ?? "");
let debounceTimer;

watch(model, (value) => {
  const nextValue = value ?? "";

  if (nextValue === text.value) {
    return;
  }

  clearTimeout(debounceTimer);
  text.value = nextValue;
});

function clearText() {
  clearTimeout(debounceTimer);

  if ((model.value ?? "") !== "") {
    model.value = "";
  }

  if (text.value !== "") {
    text.value = "";
  }
}

watch(text, (value) => {
  if (value == null) {
    clearText();
    return;
  }

  if (value === (model.value ?? "")) {
    return;
  }

  clearTimeout(debounceTimer);

  if (!props.debounce) {
    model.value = value;
    return;
  }

  debounceTimer = setTimeout(() => {
    model.value = value;
  }, props.debounce);
});

onUnmounted(() => {
  clearTimeout(debounceTimer);
});

const hasSlot = (name) => {
  return !!slots[name];
};
</script>

<template>
  <VTextField
    :label="label"
    :type="type"
    :placeholder="placeholder"
    :autofocus="autofocus"
    :error-messages="errorMessages"
    :prepend-inner-icon="prependInnerIcon"
    :disabled="disabled"
    :hide-details="hideDetails"
    :clearable="clearable"
    density="compact"
    variant="outlined"
    v-model="text"
    @click:clear="clearText"
  >
    <template v-if="hasSlot('append')" #append>
      <slot name="append" />
    </template>
    <template v-if="hasSlot('append-inner')" #append-inner>
      <slot name="append-inner" />
    </template>
  </VTextField>
</template>
