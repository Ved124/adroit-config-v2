import fs from 'fs';
import path from 'path';
import ip from 'ip';
import { put } from '@vercel/blob';

// Increase limit to handle high-res PDF
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '25mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { pdfBase64, fullContextData } = req.body;

        // --- 1. DETERMINE FILE NAME ---
        const company = fullContextData?.customer?.company || 'Visitor';
        const safeName = company.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30);
        const timestamp = Date.now();
        const pdfName = `adroit_${safeName}_${timestamp}.pdf`;
        const jsonName = `adroit_${safeName}_${timestamp}.json`;

        // Prepare Buffers
        const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), 'base64');
        const jsonBuffer = Buffer.from(JSON.stringify(fullContextData, null, 2), 'utf-8');

        // --- 2. CHECK ENVIRONMENT (Cloud vs Local) ---
        const IS_VERCEL_BLOB_ACTIVE = !!process.env.BLOB_READ_WRITE_TOKEN;

        if (IS_VERCEL_BLOB_ACTIVE) {
            // ============================================
            // MODE A: CLOUD (VERCEL)
            // ============================================
            console.log("Saving to Vercel Blob...");

            const pdfBlob = await put(`downloads/${pdfName}`, pdfBuffer, {
                access: 'public', contentType: 'application/pdf'
            });

            // Silently save JSON lead data for your records
            await put(`leads/${jsonName}`, jsonBuffer, {
                access: 'public', contentType: 'application/json'
            });

            // Return public internet URL
            return res.status(200).json({ success: true, url: pdfBlob.url, mode: 'cloud' });

        } else {
            // ============================================
            // MODE B: LOCAL / OFFLINE (Exhibition Wi-Fi)
            // ============================================
            console.log("Saving to Local Disk (Offline Mode)...");

            // Define folder: /public/downloads
            const downloadDir = path.join(process.cwd(), 'public', 'downloads');

            // Ensure directory exists
            if (!fs.existsSync(downloadDir)) {
                fs.mkdirSync(downloadDir, { recursive: true });
            }

            // Write files
            fs.writeFileSync(path.join(downloadDir, pdfName), pdfBuffer);
            fs.writeFileSync(path.join(downloadDir, jsonName), jsonBuffer);

            // Determine Local Network IP (e.g., 192.168.1.42)
            const networkIp = ip.address();
            const protocol = req.headers['x-forwarded-proto'] || 'http';
            const port = req.headers.host.split(':')[1] || '3000'; // Default to 3000 if not found

            // Create Local URL accessible by phones on same Wi-Fi
            const fileUrl = `${protocol}://${networkIp}:${port}/downloads/${pdfName}`;

            return res.status(200).json({ success: true, url: fileUrl, mode: 'local' });
        }

    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: 'Failed to process file storage' });
    }
}