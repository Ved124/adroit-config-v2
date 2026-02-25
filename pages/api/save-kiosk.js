import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ip from 'ip';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '25mb', // Increased limit to handle image-heavy JSON & PDF
        },
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        // 1. Destructure payload
        const { pdfBase64, fullContextData } = req.body;

        // 2. Determine File Names
        const timestamp = Date.now();
        // Fallback names if context is empty
        const companyName = fullContextData?.customer?.company || fullContextData?.customer?.company_name || 'Visitor';
        const safeName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `adroit_${safeName}_${timestamp}`;

        // 3. Set up directory (public/downloads)
        const downloadDir = path.join(process.cwd(), 'public', 'downloads');
        if (!fs.existsSync(downloadDir)) {
            fs.mkdirSync(downloadDir, { recursive: true });
        }

        // ---------------------------------------------
        // ACTION A: Save PDF
        // ---------------------------------------------
        if (pdfBase64) {
            const pdfBuffer = Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), 'base64');
            fs.writeFileSync(path.join(downloadDir, `${filename}.pdf`), pdfBuffer);
            console.log(`Saved PDF: ${filename}.pdf`);
        }

        // ---------------------------------------------
        // ACTION B: Save JSON (Configuration Data)
        // ---------------------------------------------
        if (fullContextData) {
            // Add a timestamp field for record keeping
            const finalJson = {
                ...fullContextData,
                meta: {
                    savedAt: new Date().toISOString(),
                    clientIP: req.headers['x-forwarded-for'] || req.socket.remoteAddress
                }
            };

            const jsonContent = JSON.stringify(finalJson, null, 2);
            fs.writeFileSync(path.join(downloadDir, `${filename}.json`), jsonContent);
            console.log(`Saved JSON: ${filename}.json`);
        }

        // 4. Generate Local Network URL (For QR Code)
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const networkIp = ip.address(); // Get 192.168.x.x
        const port = host.split(':')[1] || ''; // keep port if exists

        // Kiosk needs the Local Network IP, not "localhost"
        const fileUrl = `${protocol}://${networkIp}${port ? ':' + port : ''}/downloads/${filename}.pdf`;

        res.status(200).json({ success: true, url: fileUrl });

    } catch (err) {
        console.error("Kiosk Save Error:", err);
        res.status(500).json({ error: 'Server failed to write files.' });
    }
}
