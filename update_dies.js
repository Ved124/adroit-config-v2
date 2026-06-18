const fs = require('fs');

let content = fs.readFileSync('src/data/dies.ts', 'utf-8');

// We want to replace the techDesc of every die that has dieFamily: "aba"
let newContent = content.replace(/{\s*id: "die-aba[^}]+techDesc: {[^}]+},/gs, (match) => {
  let diameterMatch = match.match(/diameterMm:\s*(\d+)/);
  if (!diameterMatch) return match;
  let diam = diameterMatch[1];
  
  let newTechDesc = `techDesc: {
      "Material of Construction": "Hardened high strength alloy steel.",
      "Surface Treatment": "Hard chrome plated & highly polished melt paths.",
      "Die Size": "${diam} mm.",
      "Die setting": "Die adjusting bolts will be provided.",
      "Distribution": "Spiral distribution.",
      "Heating Zones": "03 Nos.",
      "Heating System": "Ceramic band heaters"
    },`;
    
  return match.replace(/techDesc:\s*{[^}]+},/s, newTechDesc);
});

fs.writeFileSync('src/data/dies.ts', newContent);
console.log('Done!');
