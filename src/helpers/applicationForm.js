import { APPLICATION_STATUSES } from "@/config/applicationStatuses";
import { APPLICATION_TYPES } from "@/config/applicationTypes";

const STATUSES = new Set(APPLICATION_STATUSES.map((status) => status.value));
const TYPES = new Set(APPLICATION_TYPES.map((type) => type.value));

export function createEmptyApplicationForm() {
  return {
    title: "",
    type: null,
    status: null,
    assignee: "",
    amount: null,
    quantity: null,
    deadline: null,
  };
}

export function parseApplicationDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? "");

  if (!match) {
    return null;
  }

  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatApplicationDate(value) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
}

export function validateApplicationForm(form) {
  const errors = {};

  if (!String(form.title ?? "").trim()) {
    errors.title = "Назва є обов'язковим полем.";
  }

  if (!TYPES.has(form.type)) {
    errors.type = "Тип є обов'язковим полем.";
  }

  if (!STATUSES.has(form.status)) {
    errors.status = "Статус є обов'язковим полем.";
  }

  if (!String(form.assignee ?? "").trim()) {
    errors.assignee = "Виконавець є обов'язковим полем.";
  }

  if (typeof form.amount !== "number" || form.amount <= 0) {
    errors.amount = "Сума повинна бути числом більше 0.";
  }

  if (form.type === "послуга" && !formatApplicationDate(form.deadline)) {
    errors.deadline = "Дата є обов'язковим полем.";
  }

  if (form.type === "товар" && (!Number.isInteger(form.quantity) || form.quantity <= 0)) {
    errors.quantity = "Кількість повинна бути числом більше 0.";
  }

  return errors;
}

export function toApplicationPayload(form) {
  const payload = {
    title: form.title.trim(),
    type: form.type,
    status: form.status,
    assignee: form.assignee.trim(),
    amount: form.amount,
  };

  if (form.type === "послуга") {
    payload.deadline = formatApplicationDate(form.deadline);
  }

  if (form.type === "товар") {
    payload.quantity = form.quantity;
  }

  return payload;
}
