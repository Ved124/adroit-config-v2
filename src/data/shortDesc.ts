// src/data/shortDesc.ts

export function techLineToShortDesc(
  item: any,
  defaultPrefix?: string
): string | undefined {
  // if shortDesc already exists, keep it
  if (item.shortDesc && typeof item.shortDesc === "string") {
    return item.shortDesc;
  }

  // 1) if there is a plain desc, use that
  if (item.desc && typeof item.desc === "string" && item.desc.trim() !== "") {
    return item.desc.trim();
  }

  // 2) if techDesc is an array of {label,value}
  if (Array.isArray(item.techDesc) && item.techDesc.length > 0) {
    const first = item.techDesc[0];
    if (first && typeof first.value === "string") {
      return first.value;
    }
  }

  // 3) if techDesc is an object map, pick the first non-empty value
  if (
    item.techDesc &&
    typeof item.techDesc === "object" &&
    !Array.isArray(item.techDesc)
  ) {
    const firstEntry = Object.entries(item.techDesc).find(
      ([, v]) => v != null && String(v).trim() !== ""
    );
    if (firstEntry) {
      const [label, value] = firstEntry;
      return `${label}: ${String(value)}`;
    }
  }

  // 4) last fallback – use name with a generic prefix
  if (item.name) {
    return defaultPrefix
      ? `${defaultPrefix} – ${item.name}`
      : String(item.name);
  }

  return undefined;
}
