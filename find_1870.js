const fs = require('fs');
const lines = fs.readFileSync('src/data/modelPresets.ts', 'utf8').split('\n');
for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('"INNOFLEX-1870 IBC":')) {
        console.log(i+1);
        break;
    }
}
