const fs = require('fs');
let c = fs.readFileSync('src/ConfigContext.jsx', 'utf8');

// 1. Update getIdx to be 3-layer aware with SOS ordering
// Find the old getIdx function
const oldGetIdx = `    const getIdx = (item) => {
      const n = String(item.name || "").toLowerCase();
      const d = String(item.desc || item.description || "").toLowerCase();
      const combined = n + " " + d;

      if (n.includes("extruder")) return 1;
      if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
      if (n.includes("die")) return 3;
      if (combined.includes("air ring") || combined.includes("airring")) return 4;
      if (combined.includes("ibc")) return 5;
      if (n.includes("tower") || n.includes("platform")) return 11;
      if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 6;
      if (combined.includes("collapsing frame") || combined.includes("collapsing") || combined.includes("haul-off") || combined.includes("hauloff") || combined.includes("main nip") || (combined.includes("haul") && combined.includes("off"))) return 7;
      if (combined.includes("idler")) return 8;
      if (combined.includes("secondary nip")) return 9;
      if (combined.includes("winder")) return 10;

      return 90;
    };`;

const newGetIdx = `    const is3or5Layer = machineType === "3layer" || machineType === "5layer";

    const getIdx = (item) => {
      const n = String(item.name || "").toLowerCase();
      const d = String(item.desc || item.description || "").toLowerCase();
      const combined = n + " " + d;

      if (is3or5Layer) {
        // 3/5-layer SOS order:
        // extruder → extrusion control → die → air ring → bubble cage →
        // haul-off → collapsing frame (only if die rotation) → idler → secondary nip → winder → tower
        if (n.includes("extruder")) return 1;
        if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
        if (n.includes("die")) return 3;
        if (combined.includes("air ring") || combined.includes("airring")) return 4;
        if (combined.includes("ibc")) return 4.5;
        if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 5;
        if (combined.includes("haul-off") || combined.includes("hauloff") || (combined.includes("haul") && combined.includes("off"))) return 6;
        if (combined.includes("collapsing frame") || combined.includes("collapsing")) return 7;
        if (combined.includes("idler")) return 8;
        if (combined.includes("secondary nip")) return 9;
        if (combined.includes("winder")) return 10;
        if (n.includes("tower") || n.includes("platform")) return 11;
        return 90;
      }

      // Default order (mono / aba)
      if (n.includes("extruder")) return 1;
      if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
      if (n.includes("die")) return 3;
      if (combined.includes("air ring") || combined.includes("airring")) return 4;
      if (combined.includes("ibc")) return 5;
      if (n.includes("tower") || n.includes("platform")) return 11;
      if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 6;
      if (combined.includes("collapsing frame") || combined.includes("collapsing") || combined.includes("haul-off") || combined.includes("hauloff") || combined.includes("main nip") || (combined.includes("haul") && combined.includes("off"))) return 7;
      if (combined.includes("idler")) return 8;
      if (combined.includes("secondary nip")) return 9;
      if (combined.includes("winder")) return 10;

      return 90;
    };`;

if (c.includes(oldGetIdx)) {
  c = c.replace(oldGetIdx, newGetIdx);
  console.log('Updated getIdx in ConfigContext');
} else {
  console.log('getIdx pattern NOT found in ConfigContext');
}

// 2. Update merge block to skip for 3-layer/5-layer
const oldMerge = `    if (hauloffIdx !== -1 && collapsingIdx !== -1) {
      const cfItem = preCombineScope[collapsingIdx];
      const hoItem = preCombineScope[hauloffIdx];
      
      preCombineScope[hauloffIdx] = {
        ...hoItem,
        name: "Haul-Off and Collapsing Frame",
        desc: \`\${cfItem.desc || cfItem.description || ""}\\n\${hoItem.desc || hoItem.description || ""}\`,
        techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }
      };
      preCombineScope.splice(collapsingIdx, 1);
    }`;

const newMerge = `    // For 3-layer/5-layer: keep haul-off and collapsing frame as separate SOS entries.
    if (!is3or5Layer && hauloffIdx !== -1 && collapsingIdx !== -1) {
      const cfItem = preCombineScope[collapsingIdx];
      const hoItem = preCombineScope[hauloffIdx];
      
      preCombineScope[hauloffIdx] = {
        ...hoItem,
        name: "Haul-Off and Collapsing Frame",
        desc: \`\${cfItem.desc || cfItem.description || ""}\\n\${hoItem.desc || hoItem.description || ""}\`,
        techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }
      };
      preCombineScope.splice(collapsingIdx, 1);
    }`;

if (c.includes(oldMerge)) {
  c = c.replace(oldMerge, newMerge);
  console.log('Updated merge block in ConfigContext');
} else {
  console.log('Merge block pattern NOT found in ConfigContext');
  // Show what we have
  const idx = c.indexOf('hauloffIdx !== -1 && collapsingIdx');
  if (idx >= 0) {
    console.log('Found at:', idx, '- snippet:');
    console.log(JSON.stringify(c.slice(idx, idx + 400)));
  }
}

fs.writeFileSync('src/ConfigContext.jsx', c, 'utf8');
console.log('Done');
