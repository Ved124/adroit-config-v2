const fs = require("fs");

let ctx = fs.readFileSync("src/ConfigContext.jsx", "utf8");

// Line 603
ctx = ctx.replace(
  'const diff = (rollerNum === 1450) ? 100 : 120;',
  'const diff = isMonoOrAba ? 50 : ((rollerNum === 1450) ? 100 : 120);'
);

// For the other 3 places, we can just replace the whole block because `displaySize` and `maxFilmWidth` logic also needs a fix.
// Wait, isMonoOrAba is defined at the top of the function. So we can just replace the 3 occurrences of:
// const diff = (rollerNum === 1450) ? 100 : 120;
// const displaySize = (rollerNum > 500) ? rollerNum : chosenSize;
// const maxFilmWidth = (rollerNum > 500) ? (rollerNum - diff) : chosenSize;
// with a new block that handles Mono/ABA!

const target = `const diff = (rollerNum === 1450) ? 100 : 120;
          const displaySize = (rollerNum > 500) ? rollerNum : chosenSize;
          const maxFilmWidth = (rollerNum > 500) ? (rollerNum - diff) : chosenSize;`;

const replacement = `const displaySize = (rollerNum > 0) ? (isMonoOrAba ? (rollerNum * 25) : rollerNum) : chosenSize;
          const diff = isMonoOrAba ? 50 : ((displaySize === 1450) ? 100 : 120);
          const maxFilmWidth = (rollerNum > 0) ? (displaySize - diff) : chosenSize;`;

ctx = ctx.split(target).join(replacement);

fs.writeFileSync("src/ConfigContext.jsx", ctx, "utf8");

let gsd = fs.readFileSync("src/utils/generateScopeDesc.js", "utf8");
const gsdTarget = `const diff = (s === 1450) ? 100 : 120;
    const maxFilmWidth = s > 500 ? (s - diff) : s;`;
const gsdReplacement = `const isMono = machineModel && (machineModel.machineType === "mono" || machineModel.machineType === "aba" || (machineModel.code && (machineModel.code.includes("UNO") || machineModel.code.includes("DUO"))));
    const diff = isMono ? 50 : ((s === 1450) ? 100 : 120);
    const maxFilmWidth = s > 0 ? (s - diff) : s;`;

gsd = gsd.split(gsdTarget).join(gsdReplacement);
fs.writeFileSync("src/utils/generateScopeDesc.js", gsd, "utf8");

console.log("Patched sizes!");
