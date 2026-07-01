const fs = require('fs');
let c = fs.readFileSync('pages/summary.jsx', 'utf8');

const targetStr = `      sortedAnnexure[cfIdxAnnex] = {
        ...cfItem,
        name: "Main Nip and Collapsing Frame",
        techDesc: { ...cfItem.techDesc, ...mnItem.techDesc }
      };`;

const replacementStr = `      sortedAnnexure[cfIdxAnnex] = {
        ...cfItem,
        name: "Main Nip and Collapsing Frame",
        techDesc: { ...cfItem.techDesc, ...mnItem.techDesc },
        image2: mnItem.image || "/images/MainNip/MainNipMultiL.png"
      };`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replacementStr);
    fs.writeFileSync('pages/summary.jsx', c, 'utf8');
    console.log("Successfully replaced summary.jsx logic.");
} else {
    console.log("Could not find target string.");
}
