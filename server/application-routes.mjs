function findApplication(applications, id) {
  return applications.find((application) => String(application.id) === String(id));
}

function nextId(applications) {
  return applications.reduce((max, application) => Math.max(max, Number(application.id) || 0), 0) + 1;
}

function hasDuplicateTitle(applications, title, ignoreId) {
  const normalized = title.trim().toLocaleLowerCase("uk");

  return applications.some((application) => {
    if (ignoreId != null && String(application.id) === String(ignoreId)) {
      return false;
    }

    return (
      String(application.title ?? "")
        .trim()
        .toLocaleLowerCase("uk") === normalized
    );
  });
}

async function readJsonBody(request) {
  if (request.body !== undefined) {
    return request.body;
  }

  let raw = "";

  for await (const chunk of request) {
    raw += chunk;
  }

  if (!raw.trim()) {
    return {};
  }

  return JSON.parse(raw);
}

function sendFieldError(response, field, message) {
  response.status(422).json({
    errors: [{ field, message }],
  });
}

export function registerApplicationRoutes(app, db) {
  app.get("/applications/:id", (request, response) => {
    const application = findApplication(db.data.applications ?? [], request.params.id);

    if (!application) {
      response.status(404).json({ error: "Not Found" });
      return;
    }

    response.json(application);
  });

  app.post("/applications", async (request, response) => {
    let body;

    try {
      body = await readJsonBody(request);
    } catch {
      sendFieldError(response, "title", "Request body must be valid JSON.");
      return;
    }

    const applications = db.data.applications ?? [];

    if (hasDuplicateTitle(applications, body.title ?? "")) {
      sendFieldError(response, "title", "Назва заявки повинна бути унікальною.");
      return;
    }

    const application = {
      id: nextId(applications),
      title: String(body.title ?? "").trim(),
      type: body.type,
      status: body.status,
      assignee: String(body.assignee ?? "").trim(),
      amount: body.amount,
      createdAt: new Date().toISOString(),
    };

    if (body.type === "послуга") {
      application.deadline = body.deadline;
    } else {
      application.quantity = body.quantity;
    }

    applications.push(application);
    db.data.applications = applications;
    await db.write();
    response.status(201).json(application);
  });

  app.put("/applications/:id", async (request, response) => {
    const applications = db.data.applications ?? [];
    const current = findApplication(applications, request.params.id);

    if (!current) {
      response.status(404).json({ error: "Not Found" });
      return;
    }

    let body;

    try {
      body = await readJsonBody(request);
    } catch {
      sendFieldError(response, "title", "Request body must be valid JSON.");
      return;
    }

    if (hasDuplicateTitle(applications, body.title ?? "", current.id)) {
      sendFieldError(response, "title", "Назва заявки повинна бути унікальною.");
      return;
    }

    const application = {
      id: current.id,
      title: String(body.title ?? "").trim(),
      type: body.type,
      status: body.status,
      assignee: String(body.assignee ?? "").trim(),
      amount: body.amount,
      createdAt: current.createdAt,
    };

    if (body.type === "послуга") {
      application.deadline = body.deadline;
    } else {
      application.quantity = body.quantity;
    }

    applications.splice(applications.indexOf(current), 1, application);
    await db.write();
    response.json(application);
  });
}
