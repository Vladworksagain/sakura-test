export const APPLICATIONS_ENDPOINT = "/api/applications";

export async function fetchApplications() {
  let response;

  try {
    response = await fetch(APPLICATIONS_ENDPOINT);
  } catch {
    throw new Error("Cannot reach the applications API. Start it with npm run server.");
  }

  if (!response.ok) {
    throw new Error(`Failed to load applications (${response.status})`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Applications response is not a list");
  }

  return data;
}
