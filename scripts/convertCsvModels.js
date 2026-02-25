const fs = require("fs");
const Papa = require("papaparse");
const path = require("path");

function csvToJson(csvFileName, outFileName) {
  const csvPath = path.join(__dirname, "..", "csv", csvFileName);
  const outPath = path.join(__dirname, "..", "data", outFileName);

  if (!fs.existsSync(csvPath)) {
    console.error("❌ CSV FILE NOT FOUND:", csvPath);
    return;
  }

  const csv = fs.readFileSync(csvPath, "utf8");
  const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

  fs.writeFileSync(outPath, JSON.stringify(parsed.data, null, 2), "utf8");
  console.log("✔️ Converted:", csvFileName, "→", outFileName);
}

csvToJson("Unoflex Monolayer Models.csv", "monoModels.json");
csvToJson("Duoflex ABA Models.csv", "abaModels.json");
csvToJson("Innoflex 3 Layer Machine Models.csv", "threeLayerModels.json");
// If you want the 2nd file too:
csvToJson("Innoflex_3_Layer_Machine_Models_2.csv", "threeLayerModels.json");
