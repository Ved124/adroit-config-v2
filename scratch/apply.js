const fs = require("fs");
const path = require("path");

const presetsFile = path.join(__dirname, "src/data/modelPresets.ts");
let content = fs.readFileSync(presetsFile, "utf8");

content = content.replace(/export const MODEL_PRESETS = (\[[\s\S]*?\n\]);/, (match, arrStr) => {
  let arr = eval(`(${arrStr})`);
  arr = arr.map(preset => {
    if (preset.id.startsWith("UNOFLEX-") || preset.id.startsWith("DUOFLEX-")) {
      // Keep everything except winders, bubble cages, and die rotation
      let comps = preset.components.filter(c => 
        !c.id.startsWith("winder-") &&
        !c.id.startsWith("bc-") &&
        c.id !== "die-rotation-addon"
      );
      // Add the defaults
      comps.push({ category: "Winder", id: "winder-single-surface-only-dynamic", qty: 1 });
      comps.push({ category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 });
      
      preset.components = comps;
    }
    return preset;
  });

  // Convert back to string (we need to stringify nicely)
  return "export const MODEL_PRESETS = " + JSON.stringify(arr, null, 2) + ";";
});

fs.writeFileSync(presetsFile, content, "utf8");
console.log("Updated modelPresets.ts");
