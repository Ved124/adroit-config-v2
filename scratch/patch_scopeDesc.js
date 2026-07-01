const fs = require("fs");
let content = fs.readFileSync("src/data/modelPresets.ts", "utf8");

// We want to replace lines like:
// scopeDesc: "One Chrome plated Three Layer ABA Spiral Mandrel Die and lip diameter of 100 mm, complete with die adapters and carriage.",
// with just nothing, or comment them out.

content = content.replace(/scopeDesc:\s*"One [Cc]hrome plated [^"]+ Die (and|with) lip diameter of [^"]+",\n?/g, "");

fs.writeFileSync("src/data/modelPresets.ts", content, "utf8");
console.log("Removed hardcoded scopeDesc from modelPresets.ts");
