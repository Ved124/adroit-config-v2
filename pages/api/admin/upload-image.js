import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error parsing form data' });
    }

    try {
      // formidable v3 puts files in an array, v2 might not. Handle both.
      const fileObj = Array.isArray(files.image) ? files.image[0] : files.image;
      if (!fileObj || !fileObj.filepath) {
        return res.status(400).json({ message: 'No image provided' });
      }

      // Upload directly to Cloudinary
      const result = await cloudinary.uploader.upload(fileObj.filepath, {
        folder: 'adroit_configurator',
        resource_type: 'auto'
      });

      // Optionally, clean up the temporary file
      fs.unlinkSync(fileObj.filepath);

      return res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error('Upload Error:', error);
      return res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
  });
}
