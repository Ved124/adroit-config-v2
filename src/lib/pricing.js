// src/lib/pricing.js
// Export quotations price at a markup over the domestic (INR) value before
// converting to USD — not a straight currency conversion of the same
// domestic price. Shared because export pricing is independently computed
// in several places (summary totals, individual addon/component line items
// in both the live on-screen preview and the exported PDF/flyer) that must
// agree with each other; a constant defined once here means they can't
// silently drift out of sync the way duplicated inline logic has before.
export const EXPORT_PRICE_MARKUP = 1.3;
