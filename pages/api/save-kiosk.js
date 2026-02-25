import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import ip from 'ip';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Handle large PDFs locally
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { pdfBase64, fullContextData } = req.body;
    
    // --- 1. CONFIGURATION ---
    // Check if we are on Vercel using the Environment Variable they provide
    const IS_VERCEL_ENV = process.env.VERCEL === '1'; 
    const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;
    
    // Determine filenames
    const company = fullContextData?.customer?.company || 'Visitor';
    const safeName = company.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30);
    const timestamp = Date.now();
    const pdfName = `adroit_${safeName}_${timestamp}.pdf`;

    const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), 'base64');

    // --- 2. CLOUD MODE (Priority on Vercel) ---
    if (IS_VERCEL_ENV) {
      if (!HAS_BLOB_TOKEN) {
        throw new Error("Vercel Blob Storage not connected. Go to Vercel > Storage > Connect Blob.");
      }

      console.log("Uploading to Vercel Blob...");
      const blob = await put(`downloads/${pdfName}`, pdfBuffer, {
        access: 'public',
        contentType: 'application/pdf',
      });
      
      return res.status(200).json({ success: true, url: blob.url });
    }

    // --- 3. LOCAL MODE (Offline / Laptop) ---
    console.log("Saving Locally...");
    const downloadDir = path.join(process.cwd(), 'public', 'downloads');
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

    fs.writeFileSync(path.join(downloadDir, pdfName), pdfBuffer);

    // Get Local IP
    const networkIp = ip.address();
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const port = req.headers.host.split(':')[1] || '3000';
    
    const fileUrl = `${protocol}://${networkIp}:${port}/downloads/${pdfName}`;
    return res.status(200).json({ success: true, url: fileUrl });

  } catch (err) {
    console.error("Save API Error:", err);
    res.status(500).json({ error: err.message || 'Server processing failed' });
  }
}
