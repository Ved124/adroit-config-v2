// scripts/seed-catalog.ts
// One-time seed: writes the current static .ts catalog (src/data/models.ts +
// every component/addon category file, via src/data/catalogRegistry.js) into
// Vercel Blob as catalog/catalog.json, so the admin manager and the live
// configurator's /api/catalog route have an initial "current" version to read
// and edit going forward.
//
// This replaces the old multi-script seed chain (seed-all.js/.ts,
// seed-mongo.js, patch-catalog.js) that kept drifting out of sync with the
// static files — this one just aggregates the same static data the app
// already uses today and uploads it once. Re-running it is safe (it fully
// overwrites catalog/catalog.json) but is only meant to be run once, before
// the admin manager exists to take over as the source of truth.
//
// Usage:
//   vercel env pull .env.local   # ensures BLOB_READ_WRITE_TOKEN is present locally
//   npx tsx scripts/seed-catalog.ts

import "dotenv/config";
import { put } from "@vercel/blob";
import { getStaticCatalog } from "../src/data/catalogRegistry";

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local` first, or set it manually."
    );
    process.exit(1);
  }

  const catalog = getStaticCatalog();
  const modelCount = catalog.models.length;
  const componentCategoryCount = Object.keys(catalog.components).length;
  const addonCategoryCount = Object.keys(catalog.addons).length;

  console.log(
    `Seeding catalog: ${modelCount} models, ${componentCategoryCount} component categories, ${addonCategoryCount} addon categories...`
  );

  const payload = JSON.stringify(catalog, null, 2);
  const blob = await put("catalog/catalog.json", payload, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  console.log(`Done. catalog/catalog.json -> ${blob.url}`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
