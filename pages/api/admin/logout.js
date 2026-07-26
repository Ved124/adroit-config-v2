// pages/api/admin/logout.js
import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const serializedCookie = serialize("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  res.setHeader("Set-Cookie", serializedCookie);
  return res.status(200).json({ success: true });
}
