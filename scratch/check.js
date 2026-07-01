const fs = require("fs");
let content = fs.readFileSync("src/data/modelPresets.ts", "utf8");

const regex = /("[UD][A-Z]+-[^"]+":\s*\{\s*machineType:\s*"(?:mono|aba)",[\s\S]*?components:\s*\[)([\s\S]*?)(\],)/g;

let count = 0;
content = content.replace(regex, (match, prefix, components, suffix) => {
  // Let's replace the broken Winder and Bubble Cage objects.
  // A broken object might look like:
  // {
  //   category: "Winder",
  //   qty: 1,
  //   metadata: { ... }
  // },
  // We can use a regex to match { category: "Winder" ... } up to the matching }
  // Since metadata can have nested braces, it's a bit tricky with regex.
  
  // Better approach: remove anything from 'category: "Winder"' back to '{' and forward to the balancing '}'
  // But wait! We already know the exact lines from the diffs!
  
  return match;
});

// Let's just output how many broken winders we see
let brokenWinderRegex = /\{\s*category:\s*"Winder",\s*qty:\s*1,\s*metadata:\s*\{[\s\S]*?\}\s*\}/g;
let brokenBCRegex = /\{\s*category:\s*"Bubble Cage",\s*qty:\s*1,\s*metadata:\s*\{[\s\S]*?\}\s*\}/g;

console.log("Broken Winders:", (content.match(brokenWinderRegex) || []).length);
console.log("Broken BCs:", (content.match(brokenBCRegex) || []).length);
