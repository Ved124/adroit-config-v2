// scripts/add-unoflex-36.ts
// One-off migration: inserts the UNOFLEX-36 model (defined in src/data/models.ts) into the
// LIVE catalog blob (catalog/catalog.json) right after UNOFLEX-32. The configurator reads
// models from the blob at runtime (src/data/models.ts is only the fallback), so without
// this the new model won't appear in the app. Idempotent — skips if the code already exists.
//
//   npx tsx -r dotenv/config scripts/add-unoflex-36.ts dotenv_config_path=.env.local          (writes)
//   npx tsx scripts/add-unoflex-36.ts --dry                                                   (no token needed)
//
// After a real run: restart the local dev server / redeploy so each process's in-memory
// catalog cache is flushed. Safe to delete this file afterwards.
import { ALL_MODELS } from "../src/data/models";

const CODE = "UNOFLEX-36";
const AFTER = "UNOFLEX-32";

function insert(catalog: any) {
  const model = ALL_MODELS.find((m) => m.code === CODE);
  if (!model) throw new Error(`${CODE} not found in src/data/models.ts`);
  if (catalog.models.some((m: any) => m.code === CODE)) {
    console.log(`${CODE} already present in catalog — nothing to do.`);
    return catalog;
  }
  const idx = catalog.models.findIndex((m: any) => m.code === AFTER);
  const next = JSON.parse(JSON.stringify(catalog));
  next.models.splice(idx === -1 ? next.models.length : idx + 1, 0, JSON.parse(JSON.stringify(model)));
  console.log(`Inserted ${CODE} at index ${idx === -1 ? next.models.length - 1 : idx + 1} (models: ${catalog.models.length} -> ${next.models.length}).`);
  return next;
}

(async () => {
  if (process.argv.includes("--dry")) {
    const res = await fetch("https://adroit-config.vercel.app/api/catalog");
    const live = await res.json();
    const out = insert(live);
    console.log("DRY RUN — nothing written. Mono model order:", out.models.filter((m: any) => m.machineType === "mono").map((m: any) => m.code).join(", "));
    return;
  }
  const { mutateCatalog } = await import("../src/lib/catalogStore");
  await mutateCatalog(async (catalog: any) => insert(catalog));
  console.log("Catalog saved.");
})().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
