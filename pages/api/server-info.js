import { getNetworkIP } from "../../src/lib/networkIp";

export default function handler(req, res) {
  const isCloud = !!process.env.VERCEL;

  if (isCloud) {
    // On Vercel, getNetworkIP() would return the serverless container's
    // internal link-local address (169.254.x.x) — meaningless to a client.
    // The real reachable address is just this deployment's own host.
    const proto = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host;
    return res.status(200).json({
      ip: null,
      port: null,
      url: `${proto}://${host}`,
      mode: "cloud",
    });
  }

  const ip = getNetworkIP();
  res.status(200).json({
    ip,
    port: process.env.PORT || 3000,
    url: `http://${ip}:${process.env.PORT || 3000}`,
    mode: "local",
  });
}
