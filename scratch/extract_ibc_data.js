const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const dir = 'sample pdf/ibc proposals';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.docx'));

async function processFile(file) {
    try {
        const data = fs.readFileSync(path.join(dir, file));
        const zip = await JSZip.loadAsync(data);
        const docXml = await zip.file('word/document.xml').async('string');
        // Simple regex to get text from xml tags, preserving some structure
        const text = docXml
            .replace(/<\/w:p>/g, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        console.log(`--- ${file} ---`);
        console.log(text.trim());
        console.log('\n========================================================\n');
    } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
    }
}

(async () => {
    for (const file of files) {
        await processFile(file);
    }
})();
