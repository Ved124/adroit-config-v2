const fs = require("fs");
let code = fs.readFileSync("src/data/modelPresets.ts", "utf8");

const regex = /("[UD][A-Z]+-[^"]+":\s*\{\s*machineType:\s*"(?:mono|aba)",[\s\S]*?components:\s*\[)([\s\S]*?)(\],)/g;

code = code.replace(regex, (match, prefix, components, suffix) => {
  let newComps = "";
  let i = 0;
  
  while (i < components.length) {
    if (components[i] === '{') {
      let start = i;
      let depth = 1;
      i++;
      while (i < components.length && depth > 0) {
        if (components[i] === '{') depth++;
        if (components[i] === '}') depth--;
        i++;
      }
      let end = i;
      let block = components.slice(start, end);
      
      if (!block.includes('category: "Winder"') && 
          !block.includes('category: "Bubble Cage"') &&
          !block.includes('id: "die-rotation-addon"')) {
        newComps += block;
      } else {
        // block is removed. If the next characters are commas, we might skip them or just clean up later.
      }
    } else {
      newComps += components[i];
      i++;
    }
  }
  
  // Clean up double commas that might result from deleting blocks
  newComps = newComps.replace(/,\s*,/g, ',');
  newComps = newComps.replace(/^\s*,/, ''); // leading comma
  
  const toAdd = `\n      { category: "Winder", id: "winder-single-surface-only-dynamic", qty: 1 },\n      { category: "Bubble Cage", id: "bc-manual-dynamic", qty: 1 }`;
      
  if (newComps.trim().length > 0 && !newComps.trim().endsWith(',')) {
    newComps += ",";
  }
  
  return prefix + newComps + toAdd + '\n    ' + suffix;
});

fs.writeFileSync("src/data/modelPresets.ts", code, "utf8");
console.log("Fixed modelPresets.ts cleanly!");
