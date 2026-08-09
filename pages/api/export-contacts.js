// pages/api/export-contacts.js
// Bulk-exports every captured lead as a single .vcf file so they can be
// imported into a phone's Contacts app in one tap instead of typing each
// lead in by hand. Unauthenticated, matching list-leads.js/save-kiosk.js —
// this data is already fully visible with no login on /admin/leads.
import { list } from "@vercel/blob";
import fs from "fs";
import path from "path";

function escapeVCard(str) {
  if (!str) return "";
  return String(str).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
}

// Indian mobile numbers are saved as bare 10-digit strings almost
// everywhere in this dataset; normalize those to +91 so contacts import
// with a dialable number instead of an ambiguous local one.
function normalizePhone(raw) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return "+91" + digits;
  // 11 digits with a leading trunk-prefix 0 (e.g. "09106961736"), a common
  // way Indian numbers get typed without a country code.
  if (digits.length === 11 && digits.startsWith("0")) return "+91" + digits.slice(1);
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  if (digits.length > 10) return "+" + digits;
  return digits;
}

function buildVCard({ name, company, phone, email, city, state }) {
  const fullName = name || company || "Unknown";
  const parts = fullName.trim().split(/\s+/);
  const familyName = parts.length > 1 ? parts.pop() : "";
  const givenName = parts.join(" ") || fullName;

  let card = "BEGIN:VCARD\r\n";
  card += "VERSION:3.0\r\n";
  card += `FN:${escapeVCard(fullName)}\r\n`;
  card += `N:${escapeVCard(familyName)};${escapeVCard(givenName)};;;\r\n`;
  if (company) card += `ORG:${escapeVCard(company)}\r\n`;
  card += `TEL;TYPE=CELL:${phone}\r\n`;
  if (email) card += `EMAIL:${escapeVCard(email)}\r\n`;
  if (city || state) card += `ADR;TYPE=WORK:;;;${escapeVCard(city)};${escapeVCard(state)};;\r\n`;
  card += "NOTE:Adroit Extrusion exhibition lead\r\n";
  card += "END:VCARD\r\n";
  return card;
}

export default async function handler(req, res) {
  try {
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
    const VERCEL_ENV = process.env.VERCEL;

    let items = []; // { url?, localFile?, uploadedAt }

    if (BLOB_TOKEN && VERCEL_ENV) {
      const { blobs } = await list({ prefix: "data/", limit: 1000 });
      items = blobs.map((b) => ({ url: b.url, uploadedAt: b.uploadedAt }));
    } else {
      const downloadDir = path.join(process.cwd(), "public", "downloads");
      if (fs.existsSync(downloadDir)) {
        items = fs
          .readdirSync(downloadDir)
          .filter((f) => f.endsWith(".json"))
          .map((f) => {
            const filePath = path.join(downloadDir, f);
            return { localFile: filePath, uploadedAt: fs.statSync(filePath).mtime };
          });
      }
    }

    const CONCURRENCY = 10;
    const contacts = [];
    for (let i = 0; i < items.length; i += CONCURRENCY) {
      const batch = items.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        batch.map(async (item) => {
          try {
            const data = item.localFile
              ? JSON.parse(fs.readFileSync(item.localFile, "utf-8"))
              : await (await fetch(item.url)).json();
            const c = data.customer || {};
            return {
              name: c.contact_name || c.name || "",
              company: c.company_name || c.company || "",
              phone: c.phone || c.mobile || "",
              email: c.email && c.email !== "-" ? c.email : "",
              city: c.city && c.city !== "-" ? c.city : "",
              state: c.state && c.state !== "-" ? c.state : "",
              uploadedAt: item.uploadedAt,
            };
          } catch (e) {
            return null;
          }
        })
      );
      contacts.push(...results.filter(Boolean));
    }

    // Dedupe by normalized phone — same person quoted multiple times should
    // become one contact, keeping whichever lead is most recent.
    const byPhone = new Map();
    for (const c of contacts) {
      // Skip anything that isn't a plausible phone number (e.g. "1", "123",
      // "878626") — a handful of leads in this dataset are leftover test
      // entries from earlier configurator testing, not real customers, and
      // a real 10-digit Indian mobile number is the reliable signal to
      // separate them out.
      const rawDigits = String(c.phone || "").replace(/\D/g, "");
      if (rawDigits.length < 10) continue;

      const normPhone = normalizePhone(c.phone);
      if (!normPhone) continue;
      const existing = byPhone.get(normPhone);
      if (!existing || new Date(c.uploadedAt) > new Date(existing.uploadedAt)) {
        byPhone.set(normPhone, { ...c, phone: normPhone });
      }
    }

    const uniqueContacts = Array.from(byPhone.values()).sort((a, b) =>
      (a.company || a.name).localeCompare(b.company || b.name)
    );

    const vcf = uniqueContacts.map(buildVCard).join("");

    res.setHeader("Content-Type", "text/vcard; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="adroit-leads.vcf"');
    res.status(200).send(vcf);
  } catch (err) {
    console.error("pages/api/export-contacts.js error:", err);
    res.status(500).json({ error: "Failed to export contacts" });
  }
}
