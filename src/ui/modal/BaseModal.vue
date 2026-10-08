<script setup>
import BaseIconButton from "@/ui/button/BaseIconButton.vue";
import { useSlots } from "vue";

defineProps({
  maxWidth: {
    type: String,
    default: "600",
  },
  title: {
    type: String,
    default: "",
  },
  hasCloseButton: {
    type: Boolean,
    default: true,
  },
  persistent: {
    type: Boolean,
    default: true,
  },
});

const model = defineModel();
const slots = useSlots();

const hasSlots = (name) => !!slots[name];
</script>
<template>
  <VDialog v-model="model" :max-width="maxWidth" :persistent="persistent">
    <template #activator="{ props }" v-if="hasSlots('activator')">
      <slot name="activator" :prop="props"></slot>
    </template>
    <template #default="{ isActive }">
      <v-card>
        <template v-slot:title>
          <span class="font-weight-bold">{{ title }}</span>
        </template>
        <template v-slot:append v-if="hasCloseButton">
          <BaseIconButton icon="mdi-close" variant="text" @click="isActive.value = false" />
        </template>

        <v-card-text> <slot></slot> </v-card-text>
      </v-card>
    </template>
  </VDialog>
</template>
