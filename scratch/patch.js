const fs = require('fs');

let content = fs.readFileSync('src/data/modelPresets.ts', 'utf8');

const regex = /("[UD][A-Z]+-[^"]+":\s*\{\s*machineType:\s*"(?:mono|aba)",[\s\S]*?components:\s*\[)([\s\S]*?)(\],)/g;

let count = 0;
content = content.replace(regex, (match, prefix, components, suffix) => {
  count++;
  let newComponents = components.split('\n').filter(line => {
    if (line.includes('"winder-')) return false;
    if (line.includes('"bc-')) return false;
    if (line.includes('"die-rotation-addon"')) return false;
    return true;
  }).join('\n');
  
  const toAdd = `      { category: "Winder", id: "winder-single-surface-only-dynamic", qty: 1 },
      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 }`;
      
  // Ensure we don't have dangling commas or bad formatting, but string replace is fine.
  return prefix + newComponents + (newComponents.trim().endsWith(',') ? '' : ',') + '\n' + toAdd + '\n    ' + suffix;
});

fs.writeFileSync('src/data/modelPresets.ts', content, 'utf8');
console.log(`Updated ${count} mono/aba presets.`);

let addonsContent = fs.readFileSync('src/data/winderAddons.ts', 'utf8');
if (!addonsContent.includes('winder-manual-back-to-back-dynamic')) {
  addonsContent = addonsContent.replace(/(export const WINDER_ADDONS[^\[]*\[)/, `$1
  {
    id: "winder-manual-back-to-back-dynamic",
    name: "Two back to back Surface Winder",
    category: "Winder Addons",
    machineTypes: ["mono", "aba", "3layer", "5layer"],
    image: "/images/Winder/Back to back winder.png",
    cardDesc: "Add a two back-to-back surface winder for efficient winding.",
    price: 350000,
    techDesc: {
      "Type": "Two back to back Surface Winder",
      "Actuation": "Manual Changeover."
    }
  },`);
  fs.writeFileSync('src/data/winderAddons.ts', addonsContent, 'utf8');
  console.log('Updated winderAddons.ts');
}
