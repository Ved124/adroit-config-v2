import fs from 'fs';
import path from 'path';
import { put } from '@vercel/blob';
import { getNetworkIP } from '../../src/lib/networkIp';

const CRM_ENABLED = !!(process.env.CRM_WEBHOOK_URL && process.env.CRM_WEBHOOK_SECRET);
if (CRM_ENABLED) console.log('CRM integration: enabled');

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
    const { pdfBase64, pdfUrl: alreadyUploadedPdfUrl, fullContextData } = req.body;

    // Naming Logic: Quoteref_customername_city
    const quoteRef = fullContextData?.quotation?.refNo || fullContextData?.quotation?.ref_no ||
                     fullContextData?.customer?.quotationRef || fullContextData?.customer?.ref || 'NoRef';
    const company = fullContextData?.customer?.company || fullContextData?.customer?.company_name || 'Visitor';
    const city = fullContextData?.customer?.city || 'NoCity';

    const safeRef = String(quoteRef).replace(/[^a-z0-9]/gi, '_');
    const safeCompany = String(company).replace(/[^a-z0-9]/gi, '_');
    const safeCity = String(city).replace(/[^a-z0-9]/gi, '_');

    // Add a short timestamp to prevent caching issues
    const ts = Date.now().toString().slice(-6);
    const baseFileName = `${safeRef}_${safeCompany}_${safeCity}_${ts}`;
    const pdfName = `${baseFileName}.pdf`;
    const jsonName = `${baseFileName}.json`;

    // The PDF may already be uploaded (client-direct-to-Blob, used for large
    // multi-page proposals that would otherwise exceed the platform request
    // body limit here — see pages/api/blob-upload-token.js). Only build a
    // buffer from pdfBase64 when we actually need to upload it ourselves.
    const pdfBuffer = alreadyUploadedPdfUrl
      ? null
      : Buffer.from(pdfBase64.replace(/^data:application\/pdf;base64,/, ""), 'base64');
    const jsonString = JSON.stringify(fullContextData, null, 2);
    const jsonBuffer = Buffer.from(jsonString, 'utf-8');

    // 2. CHECK MODE
    const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
    const VERCEL_ENV = process.env.VERCEL;

    if (BLOB_TOKEN && VERCEL_ENV) {
      // === CLOUD MODE ===
      let blob;
      if (alreadyUploadedPdfUrl) {
        blob = { url: alreadyUploadedPdfUrl };
        await put(`data/${jsonName}`, jsonString, {
          access: 'public',
          contentType: 'application/octet-stream',
          contentDisposition: `attachment; filename="${jsonName}"`
        });
      } else {
        // Speed up by parallelizing the two uploads
        [blob] = await Promise.all([
          put(`downloads/${pdfName}`, pdfBuffer, { access: 'public', contentType: 'application/pdf' }),
          put(`data/${jsonName}`, jsonString, {
            access: 'public',
            contentType: 'application/octet-stream',
            contentDisposition: `attachment; filename="${jsonName}"`
          })
        ]);
      }

      // ── Enhanced CRM Webhook ────────────────────────────────
      if (process.env.CRM_WEBHOOK_URL && process.env.CRM_WEBHOOK_SECRET) {
        try {
          // Extract machine details from fullContextData
          const machineData = {
            type: fullContextData?.machineType ||
                  fullContextData?.machine?.type ||
                  fullContextData?.selectedMachine?.machineType || '',
            code: fullContextData?.selectedMachine?.code ||
                  fullContextData?.machine?.code ||
                  fullContextData?.quotation?.modelCode || '',
            label: fullContextData?.selectedMachine?.label ||
                   fullContextData?.machine?.label || '',
            widthMm: fullContextData?.selectedMachine?.widthMm ||
                     fullContextData?.machine?.widthMm || 0,
            outputKgHr: fullContextData?.selectedMachine?.outputKgHr ||
                        fullContextData?.machine?.outputKgHr || '',
          }

          const quotationData = {
            refNo: fullContextData?.quotation?.refNo ||
                   fullContextData?.quotation?.ref_no ||
                   fullContextData?.customer?.ref || quoteRef,
            totalPrice: fullContextData?.quotation?.totalPrice ||
                        fullContextData?.pricing?.total || 0,
            basePrice: fullContextData?.quotation?.basePrice ||
                       fullContextData?.pricing?.base || 0,
            addonTotal: fullContextData?.quotation?.addonTotal ||
                        fullContextData?.pricing?.addons || 0,
            date: new Date().toISOString(),
          }

          const webhookPayload = {
            quoteData: {
              customer: {
                name:    fullContextData?.customer?.name || '',
                company: fullContextData?.customer?.company ||
                         fullContextData?.customer?.company_name || '',
                phone:   fullContextData?.customer?.phone ||
                         fullContextData?.customer?.mobile || '',
                email:   fullContextData?.customer?.email || '',
                city:    fullContextData?.customer?.city || '',
                state:   fullContextData?.customer?.state || '',
                address: fullContextData?.customer?.address || '',
                region:  fullContextData?.customer?.region || 'DOM',
              },
              machine: machineData,
              components: fullContextData?.components ||
                          fullContextData?.selectedComponents || [],
              addons: fullContextData?.addons ||
                      fullContextData?.selectedAddons || [],
              quotation: quotationData,
            },
            pdfUrl: `downloads/${pdfName}`,
            jsonUrl: `data/${jsonName}`,
            timestamp: new Date().toISOString(),
          }

          const crmResponse = await fetch(
            `${process.env.CRM_WEBHOOK_URL}/api/quotes/webhook`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-webhook-secret': process.env.CRM_WEBHOOK_SECRET,
              },
              body: JSON.stringify(webhookPayload),
              signal: AbortSignal.timeout(2000), // 2 second timeout
            }
          )

          if (crmResponse.ok) {
            const crmResult = await crmResponse.json()
            console.log('CRM webhook success:', crmResult)
            // Return CRM IDs alongside blob URLs for frontend use
            return res.status(200).json({
              url: blob.url,
              mode: 'cloud',
              crm: {
                contactId: crmResult.contact?.id,
                leadId: crmResult.lead?.id,
                quoteId: crmResult.quote?.id,
                quoteNumber: crmResult.quote?.quoteNumber,
                isNewContact: crmResult.contact?.isNew,
                isNewLead: crmResult.lead?.isNew,
              }
            })
          }
        } catch (webhookErr) {
          // Silent fail — never break quote generation
          console.log('CRM webhook failed (silent):', webhookErr.message)
        }
      }

      // Default return if no webhook or webhook failed
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

      const fileUrl = `${protocol}://${networkIp}:${port}/api/downloads/${pdfName}`;

      console.log("Local PDF generated:", fileUrl); // Check terminal to verify
      return res.status(200).json({ url: fileUrl, mode: "local" });
    }

  } catch (err) {
    console.error("Save Error:", err);
    res.status(500).json({ error: 'Processing failed' });
  }
}
