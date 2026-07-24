const fs = require("fs");
const JSZip = require("jszip");

const file = process.argv[2];

async function main() {
  const data = fs.readFileSync(file);
  const zip = await JSZip.loadAsync(data);
  const xml = await zip.file("word/document.xml").async("string");
  let text = xml
    .replace(/<\/w:p>/g, "\n")
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
  console.log(text);
}

main();
