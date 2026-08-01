// src/lib/pricing.js
// Export quotations price at a markup over the domestic (INR) value before
// converting to USD — not a straight currency conversion of the same
// domestic price. Shared because export pricing is independently computed
// in several places (summary totals, individual addon/component line items
// in both the live on-screen preview and the exported PDF/flyer) that must
// agree with each other; importing it from one place means they can't
// silently drift out of sync the way duplicated inline logic has before.
//
// This is a live re-export of catalogRegistry.js's EXPORT_MARKUP binding
// (ES module re-exports preserve live binding, same as a direct import
// would) — the actual value is admin-editable via /admin/settings, with
// 1.3 (30%) as the static fallback if nothing's been saved yet. Kept as a
// separate module so ConfigContext.jsx/summary.jsx's existing imports don't
// need to change, and so this file's name still documents *why* the
// multiplier exists even though the value itself now lives in the catalog.
export { EXPORT_MARKUP as EXPORT_PRICE_MARKUP } from "../data/catalogRegistry";
