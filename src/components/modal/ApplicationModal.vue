<script setup>
import { computed, nextTick, reactive, ref, watch } from "vue";
import BaseModal from "@/ui/modal/BaseModal.vue";
import BaseTextInput from "@/ui/input/BaseTextInput.vue";
import BaseSelect from "@/ui/input/BaseSelect.vue";
import BaseNumberInput from "@/ui/input/BaseNumberInput.vue";
import BaseDatepicker from "@/ui/input/BaseDatepicker.vue";
import BaseButton from "@/ui/button/BaseButton.vue";

import { APPLICATION_STATUSES } from "@/config/applicationStatuses";
import { APPLICATION_TYPES } from "@/config/applicationTypes";
import {
  createEmptyApplicationForm,
  formatApplicationDate,
  parseApplicationDate,
  validateApplicationForm,
} from "@/helpers/applicationForm";

const props = defineProps({
  application: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  serverError: {
    type: Object,
    default: null,
  },
});

const modalState = defineModel();

const emit = defineEmits(["submit"]);

const form = reactive(createEmptyApplicationForm());
const fieldErrors = ref({});
const formError = ref("");
let hydrating = false;

const isEdit = computed(() => props.application?.id != null && props.application.id !== "");
const title = computed(() => (isEdit.value ? "Редагування заявки" : "Нова заявка"));

function resetForm() {
  Object.assign(form, createEmptyApplicationForm());
  fieldErrors.value = {};
  formError.value = "";
}

async function applyApplication(application) {
  hydrating = true;
  form.title = application.title ?? "";
  form.type = application.type ?? null;
  form.status = application.status ?? null;
  form.assignee = application.assignee ?? "";
  form.amount = application.amount ?? null;
  form.quantity = application.quantity ?? null;
  form.deadline = parseApplicationDate(application.deadline);
  await nextTick();
  hydrating = false;
}

watch(modalState, (isOpen) => {
  if (!isOpen) {
    resetForm();
    return;
  }

  resetForm();

  if (props.application) {
    applyApplication(props.application);
  }
});

watch(
  () => props.application,
  (application) => {
    if (!modalState.value || !application) {
      return;
    }

    applyApplication(application);
  }
);

watch(
  () => form.type,
  (type) => {
    if (hydrating) {
      return;
    }

    if (type === "послуга") {
      form.quantity = null;
    }

    if (type === "товар") {
      form.deadline = null;
    }
  }
);

watch(
  () => ({
    title: form.title,
    type: form.type,
    status: form.status,
    assignee: form.assignee,
    amount: form.amount,
    quantity: form.quantity,
    deadline: formatApplicationDate(form.deadline),
  }),
  (next, previous) => {
    if (!previous) {
      return;
    }

    const errors = { ...fieldErrors.value };

    for (const field of Object.keys(errors)) {
      if (next[field] !== previous[field]) {
        delete errors[field];
      }
    }

    fieldErrors.value = errors;
  }
);

function applyServerErrors(error) {
  const nextErrors = {};

  for (const item of error.errors ?? []) {
    if (item.field) {
      nextErrors[item.field] = item.message;
    }
  }

  fieldErrors.value = nextErrors;
  formError.value = Object.keys(nextErrors).length ? "" : (error.message ?? "");
}

watch(
  () => props.serverError,
  (error) => {
    if (!error) {
      return;
    }

    applyServerErrors(error);
  }
);

function submit() {
  if (props.loading) {
    return;
  }

  formError.value = "";
  const errors = validateApplicationForm(form);
  fieldErrors.value = errors;

  if (Object.keys(errors).length) {
    return;
  }

  emit("submit", { ...form });
}
</script>
<template>
  <BaseModal v-model="modalState" :title="title" max-width="760" :has-close-button="false">
    <VForm @submit.prevent="submit">
      <v-container>
        <v-row>
          <v-col cols="12" md="6">
            <BaseTextInput
              v-model="form.title"
              label="Назва"
              placeholder="Введіть назву"
              :hide-details="'auto'"
              :disabled="loading"
              :error-messages="fieldErrors.title"
            />
          </v-col>
          <v-col cols="12" md="6">
            <BaseSelect
              v-model="form.type"
              label="Тип"
              placeholder="Виберіть тип"
              :options="APPLICATION_TYPES"
              :hide-details="'auto'"
              :disabled="loading"
              :error-messages="fieldErrors.type"
            />
          </v-col>
          <v-col cols="12" md="6">
            <BaseSelect
              v-model="form.status"
              label="Статус"
              placeholder="Виберіть статус"
              :options="APPLICATION_STATUSES"
              :hide-details="'auto'"
              :disabled="loading"
              :error-messages="fieldErrors.status"
            />
          </v-col>
          <v-col cols="12" md="6">
            <BaseTextInput
              v-model="form.assignee"
              label="Виконавець"
              placeholder="Введіть виконавця"
              :hide-details="'auto'"
              :disabled="loading"
              :error-messages="fieldErrors.assignee"
            />
          </v-col>
          <v-col cols="12" md="6">
            <BaseNumberInput
              v-model="form.amount"
              label="Сума"
              placeholder="Введіть суму"
              :hide-details="'auto'"
              :disabled="loading"
              :error-messages="fieldErrors.amount"
            />
          </v-col>
          <v-col v-if="form.type === 'товар'" cols="12" md="6">
            <BaseNumberInput
              v-model="form.quantity"
              label="Кількість"
              placeholder="Введіть кількість"
              :hide-details="'auto'"
              :disabled="loading"
              :error-messages="fieldErrors.quantity"
            />
          </v-col>
          <v-col v-if="form.type === 'послуга'" cols="12" md="6">
            <BaseDatepicker
              v-model="form.deadline"
              label="Дата"
              placeholder="Виберіть дату"
              :hide-details="'auto'"
              :disabled="loading"
              :error-messages="fieldErrors.deadline"
            />
          </v-col>
        </v-row>
        <p v-if="formError" class="text-error mt-2">{{ formError }}</p>
        <div class="d-flex justify-end ga-2 mt-4">
          <BaseButton variant="outlined" :disabled="loading" @click="modalState = false">Скасувати</BaseButton>
          <BaseButton type="submit" color="primary" :loading="loading">Зберегти</BaseButton>
        </div>
      </v-container>
    </VForm>
  </BaseModal>
</template>
