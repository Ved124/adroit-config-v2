const fs = require('fs');

function updateMonoModels() {
    let content = fs.readFileSync('data/monoModels.ts', 'utf8');
    content = content.replace(/code:\s*"UNOFLEX-([^"]+)",\s*family:\s*"Monolayer",\s*label:\s*"([^"]+)",[\s\S]*?screwDiameter:\s*"([^"]+) MM"/g, (match, code, label, screw) => {
        const size = code.split('-')[0] === 'UNOFLEX' ? code.replace('UNOFLEX-', '').split('-')[0] : code;
        const newLabel = Unoflex_\\"_mm;
        console.log(label + ' -> ' + newLabel);
        return match.replace(/label:\s*"[^"]+"/, label: "");
    });
    fs.writeFileSync('data/monoModels.ts', content);
}

function updateAbaModels() {
    let content = fs.readFileSync('data/abaModels.ts', 'utf8');
    content = content.replace(/code:\s*"DUOFLEX-([^"]+)",\s*family:\s*"ABA",\s*label:\s*"([^"]+)",[\s\S]*?screwDiameter:\s*"([^"]+) MM"/g, (match, code, label, screw) => {
        const size = code.split('-')[0] === 'DUOFLEX' ? code.replace('DUOFLEX-', '').split('-')[0] : code;
        const screwStr = screw.replace('/', '*');
        const newLabel = Duoflex_\\"_mm;
        console.log(label + ' -> ' + newLabel);
        return match.replace(/label:\s*"[^"]+"/, label: "");
    });
    fs.writeFileSync('data/abaModels.ts', content);
}

updateMonoModels();
updateAbaModels();
