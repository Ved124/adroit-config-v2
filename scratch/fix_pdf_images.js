const fs = require('fs');
let c = fs.readFileSync('src/components/quotation/AdroitQuotation.jsx', 'utf8');

const targetStr = '<Img src={item.image} style={{ maxWidth: "100%", maxHeight: "272px" }} />';
const replacementStr = `<>
                            {item.image && <Img src={item.image} style={{ maxWidth: item.image2 ? "48%" : "100%", maxHeight: "272px" }} />}
                            {item.image2 && <Img src={item.image2} style={{ maxWidth: item.image ? "48%" : "100%", maxHeight: "272px" }} />}
                        </>`;

if (c.includes(targetStr)) {
    c = c.replace(targetStr, replacementStr);
    c = c.replace('overflow: "hidden",', 'overflow: "hidden", gap: "20px",');
    c = c.replace('{item.image\n                    ?', '{item.image || item.image2\n                    ?');
    fs.writeFileSync('src/components/quotation/AdroitQuotation.jsx', c, 'utf8');
    console.log("Successfully replaced image tags.");
} else {
    console.log("Could not find target string.");
}
