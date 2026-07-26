// pages/api/admin/login.js
// Single shared-password auth for the machine manager, matching the pattern
// the previous admin panel used (jose JWT signed into an httpOnly cookie).
// Adds basic per-IP rate limiting: since one leaked/guessed password can
// rewrite the entire live catalog instantly (no draft/review step), the login
// endpoint needs some protection against brute-forcing given it's reachable
// from the public internet.
import { SignJWT } from "jose";
import { serialize } from "cookie";

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 60 * 1000;

// In-memory per-instance limiter. Not a global guarantee across serverless
// instances, but meaningfully raises the bar over no limiting at all for an
// internal single-password tool — sufficient for this use case.
const attempts = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    attempts.set(ip, { windowStart: now, count: 1 });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many attempts. Try again in a minute." });
  }

  const { password } = req.body || {};

  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: "ADMIN_PASSWORD is not set on the server" });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    const jwtSecret = new TextEncoder().encode(process.env.ADMIN_PASSWORD);
    const token = await new SignJWT({ admin: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(jwtSecret);

    const serializedCookie = serialize("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    res.setHeader("Set-Cookie", serializedCookie);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ error: "Invalid password" });
}
