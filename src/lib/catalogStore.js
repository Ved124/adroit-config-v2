// src/lib/catalogStore.js
// Server-side read/write helper for the admin-editable catalog, backed by
// Vercel Blob (the same storage already used by pages/api/save-kiosk.js /
// pages/api/list-leads.js for lead PDFs — reused here rather than standing up
// a separate database). Catalog blobs live under the `catalog/` prefix, kept
// completely separate from the `data/`/`downloads/` prefixes leads already use.
//
// Every write snapshots the current catalog to `catalog/history/<timestamp>.json`
// first, so a bad edit is always one blob download away from being undone.
//
// PERFORMANCE NOTE: measured directly against production Vercel Blob,
// `list({ prefix })` — used to *discover* the catalog blob's current URL —
// has its own indexing lag independent of the blob's actual content (30-40+
// seconds observed), while fetching a already-known URL directly resolves in
// a few seconds. Since the catalog blob's pathname is stable
// (addRandomSuffix: false), its URL is deterministic for the lifetime of the
// blob store — so the URL is cached at module scope after the first lookup
// (or immediately after a write, which already knows its own fresh URL) and
// reused directly, skipping list() entirely on the hot path. This is the
// single highest-impact fix for "immediate publish" actually feeling
// immediate. The cache resets on cold start, which just costs one list()
// call to re-bootstrap — a fine, self-healing trade-off.
//
// EVEN a known-good direct URL still has read-after-write propagation lag on
// the blob's *content* (observed empirically: a fresh, uncached read can
// return pre-write content for anywhere from a few seconds up to ~30-50s
// after a successful put()). A cache-busting query param does not shorten
// this — it's backend propagation, not a client/CDN cache this process
// controls. So beyond the URL cache above, this module also keeps the full
// decoded catalog OBJECT in memory (`cachedCatalog`) once read successfully,
// and every write updates that in-memory copy immediately alongside the blob
// write. Every read/mutation in this process then uses that in-memory copy
// as its source of truth instead of re-fetching from blob — which both
// serves reads instantly and means two back-to-back admin edits in the same
// process can never race against blob propagation lag to lose one of them.
// A cold-started process (no cache yet) still falls back to one blob read to
// bootstrap, same as before.

import { put, list } from "@vercel/blob";
import { getStaticCatalog } from "../data/catalogRegistry";

const CATALOG_PATH = "catalog/catalog.json";
const HISTORY_PREFIX = "catalog/history/";

let cachedCatalogUrl = null;
let cachedCatalog = null;

function isCloudConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function bust(url) {
  return `${url}${url.includes("?") ? "&" : "?"}_cb=${Date.now()}`;
}

// Resolves the catalog blob's current URL. Uses the cached value if present;
// otherwise falls back to list() once to bootstrap it. Returns null if the
// blob genuinely doesn't exist yet (first-ever run before any save).
async function resolveCatalogUrl({ forceRefresh = false } = {}) {
  if (cachedCatalogUrl && !forceRefresh) return cachedCatalogUrl;

  const { blobs } = await list({ prefix: CATALOG_PATH, limit: 1 });
  if (!blobs || blobs.length === 0) {
    cachedCatalogUrl = null;
    return null;
  }
  cachedCatalogUrl = blobs[0].url;
  return cachedCatalogUrl;
}

// Reads the current catalog. Serves the in-process cache when populated
// (see module header — sidesteps blob propagation lag entirely for this
// process's lifetime). Otherwise falls back to blob storage, and further
// falls back to the static .ts files (via getStaticCatalog()) if blob
// storage isn't configured, the blob doesn't exist yet, or a read fails for
// any reason — the app must never hard-fail just because the catalog blob
// had a bad moment. Only a genuine blob read populates the cache — a
// transient-error/static fallback is never cached, so the next call retries
// the real read instead of getting stuck serving static defaults.
export async function getCatalog() {
  if (cachedCatalog) return cachedCatalog;

  if (!isCloudConfigured()) {
    return { ...getStaticCatalog(), source: "static", updatedAt: null };
  }

  try {
    let url = await resolveCatalogUrl();
    if (!url) {
      return { ...getStaticCatalog(), source: "static", updatedAt: null };
    }

    let res = await fetch(bust(url), { cache: "no-store" });
    if (!res.ok) {
      // Cached URL may be stale (e.g. store recreated) — re-bootstrap once
      // via list() before giving up and falling back to static.
      url = await resolveCatalogUrl({ forceRefresh: true });
      if (!url) return { ...getStaticCatalog(), source: "static", updatedAt: null };
      res = await fetch(bust(url), { cache: "no-store" });
      if (!res.ok) throw new Error(`Blob fetch failed: ${res.status}`);
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.models)) {
      throw new Error("Malformed catalog blob (missing models array)");
    }

    cachedCatalog = { ...data, source: "blob", updatedAt: new Date().toISOString() };
    return cachedCatalog;
  } catch (err) {
    console.error("catalogStore.getCatalog: falling back to static catalog —", err.message);
    return { ...getStaticCatalog(), source: "static", updatedAt: null };
  }
}

// Overwrites the live catalog. Always snapshots the previous version to
// catalog/history/ first so any bad edit can be recovered by hand from the
// Vercel Blob dashboard without needing a code change or redeploy.
export async function saveCatalog(catalog) {
  if (!isCloudConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured — cannot save catalog edits.");
  }
  if (!catalog || !Array.isArray(catalog.models)) {
    throw new Error("Refusing to save malformed catalog (missing models array).");
  }

  const prevUrl = await resolveCatalogUrl();
  if (prevUrl) {
    try {
      const prevRes = await fetch(bust(prevUrl), { cache: "no-store" });
      if (prevRes.ok) {
        const prevText = await prevRes.text();
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        await put(`${HISTORY_PREFIX}${stamp}.json`, prevText, {
          access: "public",
          contentType: "application/json",
        });
      }
    } catch (err) {
      // Don't let a failed snapshot block the save itself, but make it loud.
      console.error("catalogStore.saveCatalog: failed to snapshot previous version —", err.message);
    }
  }

  const payload = JSON.stringify(catalog, null, 2);
  const blob = await put(CATALOG_PATH, payload, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  // The writer already knows its own fresh URL — update the cache immediately
  // so the very next read (even from this same request cycle) skips list()
  // and goes straight to the URL we just wrote, instead of waiting for
  // list()'s slower index to catch up.
  cachedCatalogUrl = blob.url;

  return { url: blob.url, updatedAt: new Date().toISOString() };
}

// Serializes every catalog mutation through this in-process queue, so two
// near-simultaneous admin writes (a fast double-click, two admin API calls
// landing within the same burst) can't silently lose one to a stale
// read-modify-write race — each mutation now gets its OWN fresh getCatalog()
// read, only once every earlier queued mutation has actually finished
// saving, instead of every caller racing to read+save independently.
//
// This does not guarantee safety across two different serverless instances
// writing at the exact same moment — Vercel Blob's put() has no compare-
// and-swap/ETag precondition to make that fully atomic. For this app's
// actual usage (one admin, sequential edits from a single browser tab) that
// residual risk is acceptable; a hard multi-writer guarantee would need a
// transactional store instead of a JSON blob.
let writeQueue = Promise.resolve();

// mutator receives the current catalog (in-process cache if present, else a
// fresh blob/static read), returns the mutated catalog (or throws — e.g. a
// validation/conflict error), and mutateCatalog saves the result and updates
// the in-process cache so the very next read/mutation in this process sees
// it immediately, without waiting on blob propagation lag. Returns whatever
// mutator returns; rejects with whatever it throws.
export function mutateCatalog(mutator) {
  const run = async () => {
    const catalog = await getCatalog();
    const result = await mutator(catalog);
    await saveCatalog(result);
    cachedCatalog = { ...result, source: "blob", updatedAt: new Date().toISOString() };
    return result;
  };
  const resultPromise = writeQueue.then(run, run);
  // Keep the queue alive even if this mutation fails, so later queued
  // mutations still run instead of getting stuck behind a rejected promise.
  writeQueue = resultPromise.then(
    () => undefined,
    () => undefined
  );
  return resultPromise;
}
