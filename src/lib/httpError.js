// src/lib/httpError.js
// Small helper so a mutateCatalog() mutator can throw a specific HTTP
// status/message (and optional extra response fields, e.g. usedByModels),
// caught once in each admin route's outer try/catch instead of duplicating
// status-mapping logic in every mutator callback.
export function httpError(status, message, details) {
  const err = new Error(message);
  err.status = status;
  if (details) err.details = details;
  return err;
}
