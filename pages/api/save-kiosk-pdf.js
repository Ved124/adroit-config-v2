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
        // This allows a phone on the same Wi-Fi to access the file
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;

        // Logic: In dev/kiosk mode, 'host' might be 'localhost'. 
        // We need the Network IP (e.g., 192.168.1.5) so the phone can reach it.
        const networkIp = ip.address();
        const port = host.split(':')[1] || ''; // keep port if exists

        // Construct robust URL
        const fileUrl = `${protocol}://${networkIp}${port ? ':' + port : ''}/downloads/${filename}`;

        res.status(200).json({ url: fileUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save PDF' });
    }
}
