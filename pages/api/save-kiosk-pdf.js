import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ip from 'ip';

export const config = {
    api: { bodyParser: { sizeLimit: '10mb' } },
};

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const { pdfBase64, customerName } = req.body;

        // Clean data
        const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");

        // Generate filename
        const safeName = (customerName || 'visitor').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `adroit_${safeName}_${uuidv4().slice(0, 4)}.pdf`;

        // Define public path
        const downloadDir = path.join(process.cwd(), 'public', 'downloads');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(downloadDir, filename);
        fs.writeFileSync(filePath, base64Data, 'base64');

        // Determine Local IP for the QR Code link
        // Use the host header from the request (how the user is actually accessing it)
        // but fall back to network scanning if it's 'localhost'
        const hostHeader = req.headers.host || "";
        const isLocal = hostHeader.includes("localhost") || hostHeader.includes("127.0.0.1");

        let networkIp = ip.address();
        let port = "";

        if (hostHeader && !isLocal) {
            const parts = hostHeader.split(":");
            networkIp = parts[0];
            port = parts[1] ? ":" + parts[1] : "";
        } else {
            const parts = hostHeader.split(":");
            port = parts[1] ? ":" + parts[1] : "";
        }

        const protocol = req.headers["x-forwarded-proto"] || "http";

        // Construct robust URL
        const fileUrl = `${protocol}://${networkIp}${port}/downloads/${filename}`;

        res.status(200).json({ url: fileUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save PDF' });
    }
}
