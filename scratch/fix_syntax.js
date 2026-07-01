const fs = require('fs');
let content = fs.readFileSync('src/data/modelPresets.ts', 'utf8');

// The regex I used earlier broke the winder strings. Let's fix them.
const brokenStrings = [
  '          mechanical Shaft – 04 Nos.",\n',
  '          mechanical Shaft - 02 Nos.",\n',
  '          Mechanical shaft, bow roller, 0.5 HP Torque Motor and Drive.",\n',
  '          Mechanical shaft, bow roller, 0.5 HP AC Motor and Drive.",\n',
  '          Air shaft, bow roller, 2 HP AC Motor and Drive. Post Extrusion Gear Motors will be Bonvario or Equivalent.",\n',
  '          Mechanical shaft, bow roller, 1 HP AC Motor and Drive.",\n',
  '          mechanical Shaft – 04 Nos.",\r\n',
  '          mechanical Shaft - 02 Nos.",\r\n',
  '          Mechanical shaft, bow roller, 0.5 HP Torque Motor and Drive.",\r\n',
  '          Mechanical shaft, bow roller, 0.5 HP AC Motor and Drive.",\r\n',
  '          Air shaft, bow roller, 2 HP AC Motor and Drive. Post Extrusion Gear Motors will be Bonvario or Equivalent.",\r\n',
  '          Mechanical shaft, bow roller, 1 HP AC Motor and Drive.",\r\n',
];

for (const bs of brokenStrings) {
  content = content.replace(bs, '');
}

fs.writeFileSync('src/data/modelPresets.ts', content);
console.log('Fixed syntax error');
