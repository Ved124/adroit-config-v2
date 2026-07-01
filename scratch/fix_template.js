const fs = require('fs');
let c = fs.readFileSync('pages/summary.jsx', 'utf8');

// Fix the mangled shortDesc and scopeDesc template literals in the merge block
// Current (wrong): shortDesc: `\n`,
// Should be:       shortDesc: `${cfItem.shortDesc}\n${hoItem.shortDesc}`,

const badShortDesc = 'shortDesc: `\n`,\r\n      scopeDesc: `\n`,';
const goodShortDesc = 'shortDesc: `${cfItem.shortDesc}\\n${hoItem.shortDesc}`,\r\n      scopeDesc: `${cfItem.scopeDesc || cfItem.shortDesc}\\n${hoItem.scopeDesc || hoItem.shortDesc}`,';

if (c.includes(badShortDesc)) {
  c = c.replace(badShortDesc, goodShortDesc);
  console.log('Fixed shortDesc/scopeDesc template literals');
} else {
  // Try without \r
  const badShortDesc2 = 'shortDesc: `\n`,\n      scopeDesc: `\n`,';
  const goodShortDesc2 = 'shortDesc: `${cfItem.shortDesc}\\n${hoItem.shortDesc}`,\n      scopeDesc: `${cfItem.scopeDesc || cfItem.shortDesc}\\n${hoItem.scopeDesc || hoItem.shortDesc}`,';
  if (c.includes(badShortDesc2)) {
    c = c.replace(badShortDesc2, goodShortDesc2);
    console.log('Fixed shortDesc/scopeDesc template literals (LF variant)');
  } else {
    console.log('Pattern not found - current content around "Haul-Off":');
    const idx = c.indexOf('Haul-Off and Collapsing Frame');
    console.log(JSON.stringify(c.slice(idx, idx + 250)));
  }
}

fs.writeFileSync('pages/summary.jsx', c, 'utf8');
console.log('Done');
