const fs = require('fs');
const path = 'src/data/modelPresets.ts';
let content = fs.readFileSync(path, 'utf8');

const replacements = [
    [/id: "cf-pbt-wide"/g, 'id: "cf-pbt-dynamic"'],
    [/id: "cf-pbt-mono"/g, 'id: "cf-pbt-dynamic"'],
    [/id: "cf-slat-motorized"/g, 'id: "cf-pbt-dynamic"'],
    [/id: "cf-heavy-duty"/g, 'id: "cf-pbt-dynamic"'],
    [/id: "cf-wooden"/g, 'id: "cf-pbt-dynamic"']
];

replacements.forEach(([regex, replacement]) => {
    content = content.replace(regex, replacement);
});

fs.writeFileSync(path, content);
console.log('Successfully updated modelPresets.ts');
