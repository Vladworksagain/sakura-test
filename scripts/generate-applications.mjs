import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  service: "послуга",
  goods: "товар",
};

const STATUSES = ["нова", "в роботі", "виконана", "скасована"];

const ASSIGNEES = [
  "Олена Коваль",
  "Андрій Мельник",
  "Марія Шевченко",
  "Ігор Бондар",
  "Софія Ткаченко",
  "Дмитро Кравченко",
  "Наталія Поліщук",
  "Владислав Савчук",
];

const SERVICE_TITLES = [
  "Доставка документів",
  "Консультація з впровадження",
  "Монтаж обладнання",
  "Технічне обслуговування",
  "Навчання персоналу",
  "Аудит процесів",
  "Ремонт обладнання",
  "Встановлення програмного забезпечення",
  "Виїзд фахівця",
  "Супровід проєкту",
];

const GOODS_TITLES = [
  "Ноутбук",
  "Принтер",
  "Кабель HDMI",
  "Монітор",
  "Клавіатура",
  "Картридж",
  "Маршрутизатор",
  "Набір інструментів",
  "Комп'ютерна миша",
  "Жорсткий диск",
];

const TOTAL = 60;

function pad(value) {
  return String(value).padStart(2, "0");
}

function toDateOnly(date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function buildApplication(index) {
  const type = index % 2 === 0 ? TYPES.service : TYPES.goods;
  const createdAt = new Date(Date.UTC(2026, 0, 6 + index, 8 + (index % 8), (index * 7) % 60, 0));
  const assignee = ASSIGNEES[index % ASSIGNEES.length];
  const status = STATUSES[index % STATUSES.length];

  const application = {
    id: String(index + 1),
    title: "",
    type,
    status,
    assignee,
    amount: 0,
    createdAt: createdAt.toISOString(),
  };

  if (type === TYPES.service) {
    const deadline = new Date(createdAt);
    deadline.setUTCDate(deadline.getUTCDate() + 10 + (index % 21));
    application.title = `${SERVICE_TITLES[index % SERVICE_TITLES.length]} #${index + 1}`;
    application.amount = Number((850 + index * 175.5).toFixed(2));
    application.deadline = toDateOnly(deadline);
    return application;
  }

  const quantity = (index % 12) + 1;
  const unitPrice = 120 + (index % 9) * 340;
  application.title = `${GOODS_TITLES[index % GOODS_TITLES.length]} #${index + 1}`;
  application.quantity = quantity;
  application.amount = Number((unitPrice * quantity).toFixed(2));
  return application;
}

const applications = Array.from({ length: TOTAL }, (_, index) => buildApplication(index));

const db = {
  applications,
};

const outputPath = resolve(dirname(fileURLToPath(import.meta.url)), "../server/db.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(db, null, 2)}\n`, "utf8");
console.log(`Wrote ${applications.length} applications to ${outputPath}`);
