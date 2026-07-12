const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'machines');

async function compressImages() {
  const files = fs.readdirSync(imagesDir);

  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const filePath = path.join(imagesDir, file);
      const tempFilePath = path.join(imagesDir, `temp_${file}`);

      try {
        const stats = fs.statSync(filePath);
        const originalSizeMB = stats.size / (1024 * 1024);

        // Compress keeping the same format (usually png for machines to preserve transparency)
        if (file.endsWith('.png')) {
           await sharp(filePath)
            .resize({ width: 1200, withoutEnlargement: true })
            .png({ quality: 80, compressionLevel: 9 })
            .toFile(tempFilePath);
        } else {
           await sharp(filePath)
            .resize({ width: 1200, withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toFile(tempFilePath);
        }

        const newStats = fs.statSync(tempFilePath);
        const newSizeMB = newStats.size / (1024 * 1024);

        // If the new file is smaller, replace the old one
        if (newStats.size < stats.size) {
           fs.renameSync(tempFilePath, filePath);
           console.log(`Compressed ${file}: ${originalSizeMB.toFixed(2)}MB -> ${newSizeMB.toFixed(2)}MB`);
        } else {
           // If somehow larger, just delete temp
           fs.unlinkSync(tempFilePath);
           console.log(`Skipped ${file}: Compression did not reduce size.`);
        }

      } catch (err) {
        console.error(`Failed to compress ${file}:`, err);
      }
    }
  }
}

compressImages();
