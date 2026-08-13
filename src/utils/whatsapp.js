// src/utils/whatsapp.js
// Shared between the Summary page's "Send via WhatsApp" flow and the Leads
// dashboard's "Follow Up" flow — one place to fix a normalization edge case
// instead of two.

/** Normalize a saved phone number into a WhatsApp-dialable digit string
 * (no leading +). Handles bare Indian mobiles, an accidental leading trunk
 * 0, and already-international numbers. Returns null if the input doesn't
 * look like a real phone number at all. */
export function normalizeWhatsAppPhone(raw) {
  const trimmed = String(raw || "").trim();
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10) return "91" + digits;
  if (digits.length === 11 && digits.startsWith("0")) return "91" + digits.slice(1);
  if (trimmed.startsWith("+")) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}
