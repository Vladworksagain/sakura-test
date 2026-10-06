import { existsSync } from "node:fs";
import { resolve } from "node:path";
import process from "node:process";
import { watch } from "chokidar";
import { createApp } from "json-server/lib/app.js";
import { Observer } from "json-server/lib/adapters/observer.js";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 3001);
const DELAY_MS = 2000;
const file = resolve("server/db.json");

if (!existsSync(file)) {
  console.error(`File not found: ${file}`);
  process.exit(1);
}

// JSON Server's normalized adapter turns numeric ids into strings, which sorts "9" before "60".
const observer = new Observer(new JSONFile(file));
const db = new Low(observer, {});
await db.read();

const app = createApp(db, { logger: false });

// json-server 1 has no --delay flag. This middleware must run before the generated routes.
const routes = app.middleware.splice(0);
app.use((_request, _response, next) => {
  setTimeout(() => next(), DELAY_MS);
});
app.middleware.push(...routes);

let writing = false;
observer.onWriteStart = () => {
  writing = true;
};
observer.onWriteEnd = () => {
  writing = false;
};

watch(file).on("change", () => {
  if (!writing) {
    db.read().catch((error) => {
      console.error(error);
    });
  }
});

app.listen(
  PORT,
  () => {
    console.log(`JSON Server started on http://${HOST}:${PORT}`);
    console.log(`Response delay: ${DELAY_MS}ms`);
  },
  HOST,
);
