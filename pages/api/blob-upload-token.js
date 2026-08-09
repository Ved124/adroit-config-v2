// pages/api/blob-upload-token.js
// Authorizes client-direct uploads to Vercel Blob for large proposal PDFs.
// The full multi-page proposal (rendered at 2x scale, multiple pages) can
// exceed Vercel's platform-level request body limit when POSTed through a
// normal API route as base64 — that limit applies to the inbound request to
// the function itself and can't be raised via next.config, regardless of
// the api.bodyParser.sizeLimit set on the route. Uploading directly from
// the browser to Blob storage bypasses that function body entirely; this
// route only ever handles the small token-exchange handshake.
import { handleUpload } from "@vercel/blob/client";

export default async function handler(request, response) {
  // Client-direct uploads only make sense in Cloud Mode. Exhibition WiFi
  // (local) Mode intentionally keeps everything on the laptop's disk
  // instead of Blob, and isn't running behind Vercel's edge in the first
  // place, so it never hits the body-size limit this route exists to work
  // around — refuse here and let the caller fall back to the original
  // same-request upload path.
  if (!process.env.VERCEL || !process.env.BLOB_READ_WRITE_TOKEN) {
    return response.status(400).json({ error: "Client-direct upload not available in local mode" });
  }

  try {
    const jsonResponse = await handleUpload({
      body: request.body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["application/pdf"],
        addRandomSuffix: false,
      }),
      onUploadCompleted: async () => {},
    });
    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: error.message || "Upload token generation failed" });
  }
}
