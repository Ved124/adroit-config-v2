const fs = require('fs');

let content = fs.readFileSync('src/data/modelPresets.ts', 'utf-8');

// Regex to find presets with machineType: "aba"
// We will manually replace the text inside the DUOFLEX objects since we know what they are.

const abaModels = [
  "DUOFLEX-750", "DUOFLEX-1000", "DUOFLEX-1250", "DUOFLEX-1750",
  "DUOFLEX-26", "DUOFLEX-32", "DUOFLEX-40", "DUOFLEX-50", "DUOFLEX-60", "DUOFLEX-65", "DUOFLEX-75"
];

let lines = content.split('\n');
let inAbaPreset = false;
let currentPreset = "";

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const match = line.match(/^\s*"([^"]+)":\s*\{\s*$/);
  if (match) {
    currentPreset = match[1];
  }
  
  if (line.includes('machineType: "aba"')) {
    inAbaPreset = true;
  }
  if (line.includes('machineType: "mono"') || line.includes('machineType: "3layer"') || line.includes('machineType: "5layer"')) {
    inAbaPreset = false;
  }
  
  if (inAbaPreset) {
    if (line.includes('"bc-manual-dynamic"')) {
      lines[i] = line.replace('"bc-manual-dynamic"', '"bc-manual-dynamic-aba"');
    }
    if (line.includes('"airring-g-dynamic"') || line.includes('"airring-dr-dynamic"')) {
      lines[i] = line.replace(/"airring-[a-z-]+-dynamic"/, '"airring-dr-dynamic-aba"');
    }
    if (line.includes('"techDesc":')) {
      // If it's the Air Ring techDesc, we should delete the override
      if (lines[i-1] && lines[i-1].includes('customName') && lines[i-1].includes('Air Ring')) {
        lines[i] = ""; // remove the techDesc override for Air Ring
      }
      if (lines[i-1] && lines[i-1].includes('customName') && lines[i-1].includes('BC')) {
        lines[i] = ""; // remove the techDesc override for Bubble Cage
      }
    }
  }
}

fs.writeFileSync('src/data/modelPresets.ts', lines.join('\n'));
console.log("Updated modelPresets.ts successfully");
