import { getNetworkIP } from "../../src/lib/networkIp";

export default function handler(req, res) {
  const ip = getNetworkIP();

  res.status(200).json({
    ip,
    port: process.env.PORT || 3000,
    url: `http://${ip}:${process.env.PORT || 3000}`,
    mode: process.env.VERCEL ? 'cloud' : 'local'
  });
}
