import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import os from 'os'; // Use OS to check network interfaces

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

// HELPER: Smartly find the WiFi IP, ignoring WSL/Docker IPs
const getNetworkIP = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (localhost) and IPv6
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioritize standard Wi-Fi router ranges (192.168...)
        if (iface.address.startsWith('192.168')) {
          return iface.address;
        }
      }
    }
  }
  // Fallback: If no 192.168 found, just grab the first non-internal one
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { pdfBase64, fullContextData } = req.body;

    // Naming Logic
    const company = fullContextData?.customer?.company || fullContextData?.raw_state?.customer?.company || 'Visitor';
    const safeName = company.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30);
    const timestamp = Date.now();
    const pdfName = `adroit_${safeName}_${timestamp}.pdf`;
    const jsonName = `adroit_${safeName}_${timestamp}.json`;

    // 1. BUFFER PREP
    const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), 'base64');
    const jsonBuffer = Buffer.from(JSON.stringify(fullContextData, null, 2), 'utf-8');

    // 2. CHECK MODE
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
    const VERCEL_ENV = process.env.VERCEL;

    if (BLOB_TOKEN && VERCEL_ENV) {
      // === CLOUD MODE ===
      const blob = await put(`downloads/${pdfName}`, pdfBuffer, { access: 'public', contentType: 'application/pdf' });
      await put(`data/${jsonName}`, jsonBuffer, { access: 'public', contentType: 'application/json' });
      return res.status(200).json({ url: blob.url, mode: 'cloud' });
    } else {
      // === LOCAL OFFLINE MODE ===
      const downloadDir = path.join(process.cwd(), 'public', 'downloads');
      if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

      fs.writeFileSync(path.join(downloadDir, pdfName), pdfBuffer);
      fs.writeFileSync(path.join(downloadDir, jsonName), jsonBuffer);

      // GET SMART IP
      // Use the host header from the request (how the user is actually accessing it)
      // but fall back to network scanning if it's 'localhost'
      const hostHeader = req.headers.host || "";
      const isLocal = hostHeader.includes("localhost") || hostHeader.includes("127.0.0.1");
      
      let networkIp = getNetworkIP();
      if (hostHeader && !isLocal) {
        networkIp = hostHeader.split(":")[0];
      }
      
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const port = hostHeader.split(":")[1] || "3000";

      const fileUrl = `${protocol}://${networkIp}:${port}/downloads/${pdfName}`;

      console.log("Local PDF generated:", fileUrl); // Check terminal to verify
      return res.status(200).json({ url: fileUrl, mode: "local" });
    }

  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: 'Processing failed' });
  }
}
