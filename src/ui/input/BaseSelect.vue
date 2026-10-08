<script setup>
import { useSlots } from "vue";

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => [],
  },
  chips: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  density: {
    type: String,
    default: "compact", //compact
  },
  titleKey: {
    type: String,
    default: "title",
  },
  valueKey: {
    type: [String, Number],
    default: "value",
  },
  returnObject: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
  hideDetails: {
    type: [Boolean, String],
    default: true,
  },
  errorMessages: {
    type: [String, Array],
    default: "",
  },
  clearable: {
    type: Boolean,
    default: false,
  },
});

const slots = useSlots();
const model = defineModel();

const hasSlot = (name) => {
  return !!slots[name];
};
</script>

<template>
  <VSelect
    class="ui-field"
    :placeholder="placeholder"
    :label="label"
    :items="options || []"
    :chips="chips"
    :closable-chips="multiple"
    :multiple="multiple"
    :density="density"
    :item-title="titleKey"
    :item-value="valueKey"
    variant="outlined"
    v-model="model"
    :disabled="disabled || loading"
    :return-object="returnObject"
    :loading="loading"
    :hide-details="hideDetails"
    :error-messages="errorMessages"
    :clearable="clearable"
    no-data-text="Нічого не знайдено"
  >
    <template v-if="hasSlot('chip')" #chip="{ item, props }">
      <slot :item="item" :prop="props" name="chip" />
    </template>
  </VSelect>
</template>
