// src/utils/mergeCatalogItem.js
// Single shared implementation of "merge catalog default + model/UI override" for
// techDesc and scopeDesc. Previously this logic was duplicated (and drifted) across
// ConfigContext.jsx's applyModelPreset() (components + addons paths), syncComponentWithBase/
// syncAddonWithBase, and generateScopeDesc.js's internal td() helper.

/**
 * Merge a base techDesc map with a model/UI override map, per key (override wins
 * per-key, unmentioned keys are inherited from base), then strip any key whose
 * FINAL merged value is exactly the literal string "hidden" — the convention used
 * throughout models.ts to suppress an inherited spec line without deleting the key
 * from the override (e.g. "Type": "hidden"). Optionally applies a category-specific
 * sanitize callback (e.g. ConfigContext.jsx's sanitizeTechDesc).
 *
 * sanitize runs on the catalog DEFAULT only, before the model override is merged
 * in — never on the merged result. Some sanitize rules delete or force-overwrite
 * specific keys (e.g. strip "Nip roller width" so a later dynamic-size block can
 * recompute it, or force Die Head's "Surface Treatment"); running that on the
 * merged object would silently discard a model's explicit override for that exact
 * key. Running it on the base only means an override always wins, while the base
 * default still gets its category-specific cleanup when no override is present.
 */
export function resolveTechDesc({ category, baseTechDesc, metadataTechDesc, sanitize } = {}) {
  const sanitizedBase = typeof sanitize === "function" ? sanitize(category, baseTechDesc || {}) : (baseTechDesc || {});
  const merged = { ...sanitizedBase, ...(metadataTechDesc || {}) };
  const stripped = {};
  for (const [key, value] of Object.entries(merged)) {
    if (value === "hidden") continue;
    stripped[key] = value;
  }
  return stripped;
}

/**
 * Resolve the scope-of-supply line for an item: a model-specific override always
 * wins; otherwise fall back to the catalog's hardcoded default (per-size default if
 * the item is dynamic and a matching size entry exists, else the flat default);
 * otherwise undefined, so the caller (generateScopeDesc.js) falls through to its
 * dynamic per-category generator.
 */
export function resolveScopeDesc({ base, size, metadataScopeDesc } = {}) {
  if (typeof metadataScopeDesc === "string" && metadataScopeDesc.trim() !== "") {
    return metadataScopeDesc;
  }
  if (base?.isDynamic && size && base.sizeDetails?.[size]?.scopeDesc) {
    return base.sizeDetails[size].scopeDesc;
  }
  if (typeof base?.scopeDesc === "string" && base.scopeDesc.trim() !== "") {
    return base.scopeDesc;
  }
  return undefined;
}

/**
 * Normalize a techDesc value (object map, or already an array of {label,value}
 * rows) into a display-ready array of {label, value} rows, stripping any row whose
 * value is exactly "hidden" as a safety net (in case a caller passes an
 * already-merged-but-unstripped techDesc directly, e.g. sizeDetails techDesc that
 * bypassed resolveTechDesc).
 */
export function toTechRows(techDesc) {
  if (!techDesc) return [];
  const rows = Array.isArray(techDesc)
    ? techDesc.map((row) => ({ label: row.label, value: String(row.value) }))
    : Object.entries(techDesc).map(([label, value]) => ({ label, value: String(value) }));
  return rows.filter((row) => row.value !== "hidden");
}
