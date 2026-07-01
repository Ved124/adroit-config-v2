const fs = require('fs');
let content = fs.readFileSync('src/data/modelPresets.ts', 'utf8');

content = content.replace(/("UNOFLEX-[^"]+":\s*{[\s\S]*?label:\s*)"([^"]+)"([\s\S]*?extruder:\s*"([^"]+)")/g, (match, prefix, oldLabel, suffix, screw) => {
    let codeMatch = match.match(/"UNOFLEX-([^"]+)"/);
    if (!codeMatch) return match;
    let size = codeMatch[1].split('-')[0];
    const newLabel = Unoflex_\\"_mm;
    console.log('Preset Mono: ' + oldLabel + ' -> ' + newLabel);
    return prefix + '"' + newLabel + '"' + suffix;
});

content = content.replace(/("DUOFLEX-[^"]+":\s*{[\s\S]*?label:\s*)"([^"]+)"([\s\S]*?extruder:\s*"([^"]+)")/g, (match, prefix, oldLabel, suffix, screw) => {
    let codeMatch = match.match(/"DUOFLEX-([^"]+)"/);
    if (!codeMatch) return match;
    let size = codeMatch[1].split('-')[0];
    const screwStr = screw.replace('/', '*');
    const newLabel = Duoflex_\\"_mm;
    console.log('Preset ABA: ' + oldLabel + ' -> ' + newLabel);
    return prefix + '"' + newLabel + '"' + suffix;
});

fs.writeFileSync('src/data/modelPresets.ts', content);
