const fs = require("fs");
let content = fs.readFileSync("src/data/modelPresets.ts", "utf8");

// We know the exact regex to match these broken objects because we saw the counts matched perfectly (16 winders, 14 cages).
// Wait, is it 16 winders and 14 cages?
let brokenWinderRegex = /\{\s*category:\s*"Winder",\s*qty:\s*1,\s*metadata:\s*\{[\s\S]*?\}\s*\}/g;
let brokenBCRegex = /\{\s*category:\s*"Bubble Cage",\s*qty:\s*1,\s*metadata:\s*\{[\s\S]*?\}\s*\}/g;

// Also some broken cages might not have metadata? Wait, count was 14. 
// Total mono + aba models = 16. Two of them might have had a different bubble cage that was completely deleted, or didn't have a bubble cage at all? Or didn't have metadata.
let brokenWinderNoMetadata = /\{\s*category:\s*"Winder",\s*qty:\s*1\s*\}/g;
let brokenBCNoMetadata = /\{\s*category:\s*"Bubble Cage",\s*qty:\s*1\s*\}/g;

let count = 0;
content = content.replace(brokenWinderRegex, () => { count++; return ""; });
content = content.replace(brokenBCRegex, () => { count++; return ""; });
content = content.replace(brokenWinderNoMetadata, () => { count++; return ""; });
content = content.replace(brokenBCNoMetadata, () => { count++; return ""; });

// Now clean up any double commas or empty array gaps like `, ,` or `,\s*,`
content = content.replace(/,\s*,/g, ",");
content = content.replace(/\[\s*,/g, "[");

fs.writeFileSync("src/data/modelPresets.ts", content, "utf8");
console.log("Removed broken blocks:", count);
