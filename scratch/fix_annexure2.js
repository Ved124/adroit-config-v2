const fs = require('fs');
let c = fs.readFileSync('pages/summary.jsx', 'utf8');

const target1 = `  const sortedAnnexure = getSortedScope(annexureComponents, "annexure").filter(item => {
    return Object.keys(item.techDesc || {}).length > 0;
  });`;

const newCode1 = `  let sortedAnnexure = getSortedScope(annexureComponents, "annexure").filter(item => {
    return Object.keys(item.techDesc || {}).length > 0;
  });

  // For 3-layer/5-layer Annexure: Combine Main Nip + Collapsing Frame and remove Nip from Winder (only if no haul-off)
  const isMultiLayerAnnex = machineType === "3layer" || machineType === "5layer";
  const hauloffIdxAnnex = sortedAnnexure.findIndex(i => i && ((i.category||"").toLowerCase().includes("haul") || (i.name||"").toLowerCase().includes("haul")));
  
  if (isMultiLayerAnnex && hauloffIdxAnnex === -1) {
    const mainNipIdxAnnex = sortedAnnexure.findIndex(i => i && ((i.category||"").toLowerCase().includes("main nip") || (i.name||"").toLowerCase().includes("main nip")));
    const cfIdxAnnex = sortedAnnexure.findIndex(i => {
      if (!i) return false;
      const cat = (i.category||"").toLowerCase();
      const n = (i.name||"").toLowerCase();
      return (cat.includes("collapsing") || n.includes("collapsing")) && !cat.includes("main nip") && !n.includes("main nip");
    });
    
    if (mainNipIdxAnnex !== -1 && cfIdxAnnex !== -1) {
      const mnItem = sortedAnnexure[mainNipIdxAnnex];
      const cfItem = sortedAnnexure[cfIdxAnnex];
      sortedAnnexure[cfIdxAnnex] = {
        ...cfItem,
        name: "Main Nip and Collapsing Frame",
        techDesc: { ...cfItem.techDesc, ...mnItem.techDesc }
      };
      sortedAnnexure.splice(mainNipIdxAnnex, 1);
    } else if (cfIdxAnnex !== -1) {
      sortedAnnexure[cfIdxAnnex].name = "Main Nip and Collapsing Frame";
    }

    sortedAnnexure.forEach(w => {
      if (w && ((w.category||"").toLowerCase().includes("winder") || (w.name||"").toLowerCase().includes("winder"))) {
        if (w.techDesc) {
          const newTech = { ...w.techDesc };
          Object.keys(newTech).forEach(k => {
            if (k.toLowerCase().includes("nip")) delete newTech[k];
          });
          w.techDesc = newTech;
        }
      }
    });
  }`;

if (c.includes(target1)) {
  c = c.replace(target1, newCode1);
  console.log("Successfully replaced sortedAnnexure logic.");
  fs.writeFileSync('pages/summary.jsx', c, 'utf8');
} else {
  console.log("Could not find sortedAnnexure target.");
}
