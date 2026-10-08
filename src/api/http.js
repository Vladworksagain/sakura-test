const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is not set. Add it to .env (see .env.example).");
}

function buildUrl(path, query) {
  const url = new URL(path, `${apiBaseUrl}/`);

  if (!query) {
    return url;
  }

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url;
}

export async function apiFetch(path, { method = "GET", query, body, headers } = {}) {
  const hasBody = body !== undefined;

  let response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the API. Start it with npm run server.");
  }

  if (!response.ok) {
    const error = new Error(`Request failed (${response.status})`);
    error.status = response.status;

    try {
      const payload = await response.json();

      if (Array.isArray(payload?.errors)) {
        error.errors = payload.errors;
      }
    } catch {
      // The error response has no JSON body.
    }

    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
