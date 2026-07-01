const fs = require('fs');
let content = fs.readFileSync('src/data/modelPresets.ts', 'utf8');

// Remove all scopeDesc keys inside metadata for Winder
content = content.replace(/scopeDesc:\s*(["`])[^\1]*?\1,?\s*/g, (match) => {
  // We only want to remove scopeDesc if it's describing a winder or die
  if (match.toLowerCase().includes("winder") || match.toLowerCase().includes("die")) {
    return "";
  }
  return match; 
});

fs.writeFileSync('src/data/modelPresets.ts', content);
console.log("Done");
