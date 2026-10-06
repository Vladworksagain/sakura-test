export function parseSortQuery(sort) {
  if (typeof sort !== "string" || sort.length === 0) {
    return [];
  }

  return sort.split(",").map((part) => ({
    key: part.replace(/^-/, ""),
    order: part.startsWith("-") ? "desc" : "asc",
  }));
}

export function toSortQuery(items) {
  if (!items?.length) {
    return undefined;
  }

  return items.map((item) => (item.order === "desc" ? `-${item.key}` : item.key)).join(",");
}

export function createTableQuery(query = {}) {
  return {
    page: Number(query.page) || 1,
    sortBy: parseSortQuery(query.sort),
    search: typeof query.search === "string" ? query.search : "",
    status: typeof query.status === "string" ? query.status : null,
  };
}

export function toRouteQuery(tableQuery, currentQuery = {}) {
  const search = tableQuery.search.trim();
  const nextQuery = { ...currentQuery };
  const params = {
    page: tableQuery.page,
    sort: toSortQuery(tableQuery.sortBy),
    search: search || undefined,
    status: tableQuery.status || undefined,
  };

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      delete nextQuery[key];
    } else {
      nextQuery[key] = String(value);
    }
  }

  return nextQuery;
}

export function syncRouteQuery(router, route, tableQuery) {
  return router.push({ query: toRouteQuery(tableQuery, route.query) }).catch(() => {});
}
