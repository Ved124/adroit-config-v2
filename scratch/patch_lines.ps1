$file = "pages\summary.jsx"
$lines = [System.IO.File]::ReadAllLines($file, [System.Text.Encoding]::UTF8)

# Lines are 0-indexed
# Merge block: lines 766-778 (inclusive)
# Function: lines 791-820 (inclusive)

# New merge block replacement (lines 766-778)
$newMerge = @(
  "  // For 3-layer and 5-layer: keep haul-off and collapsing frame as SEPARATE SOS entries.",
  "  // Collapsing frame only appears if die rotation is selected (controlled by selected items).",
  "  // Do NOT merge them - just sort them in the right order.",
  "  const isMultiLayer = machineType === `"3layer`" || machineType === `"5layer`";",
  "",
  "  if (!isMultiLayer && hauloffIdx !== -1 && collapsingIdx !== -1) {",
  "    const cfItem = preCombineScope[collapsingIdx];",
  "    const hoItem = preCombineScope[hauloffIdx];",
  "",
  "    preCombineScope[hauloffIdx] = {",
  "      ...hoItem,",
  "      name: `"Haul-Off and Collapsing Frame`",",
  "      shortDesc: ``${cfItem.shortDesc}\n${hoItem.shortDesc}``,",
  "      scopeDesc: ``${cfItem.scopeDesc || cfItem.shortDesc}\n${hoItem.scopeDesc || hoItem.shortDesc}``,",
  "      techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }",
  "    };",
  "    preCombineScope.splice(collapsingIdx, 1);",
  "  }"
)

# New function replacement (lines 791-820)
$newFn = @(
  "  // Sort scope items with mode-aware ordering for 3-layer/5-layer machines.",
  "  // Mode `"sos`": scope of supply list  |  Mode `"annexure`": detailed component descriptions.",
  "  function getSortedScope(items, mode = `"sos`") {",
  "    const is3or5Layer = machineType === `"3layer`" || machineType === `"5layer`";",
  "",
  "    const getSortOrder = (item) => {",
  "      if (!item) return 99;",
  "      const n = String(item.name || `"`").toLowerCase();",
  "      const d = String(item.shortDesc || item.description || `"`").toLowerCase();",
  "      const combined = n + `" `" + d;",
  "",
  "      if (is3or5Layer && mode === `"sos`") {",
  "        // 3/5-layer SOS: extruder -> control -> die -> air ring -> bubble cage ->",
  "        // haul-off -> collapsing frame (only if die rotation) -> idler -> secondary nip -> winder -> tower",
  "        if (n.includes(`"extruder`")) return 1;",
  "        if (n.includes(`"control`") || n.includes(`"panel`") || combined.includes(`"extrusion control`")) return 2;",
  "        if (n.includes(`"die`")) return 3;",
  "        if (combined.includes(`"air ring`") || combined.includes(`"airring`")) return 4;",
  "        if (combined.includes(`"ibc`")) return 4.5;",
  "        if (combined.includes(`"bubble cage`") || combined.includes(`"cage`") || combined.includes(`"basket`")) return 5;",
  "        if (combined.includes(`"haul-off`") || combined.includes(`"hauloff`") || (combined.includes(`"haul`") && combined.includes(`"off`"))) return 6;",
  "        if (combined.includes(`"collapsing frame`") || combined.includes(`"collapsing`")) return 7;",
  "        if (combined.includes(`"idler`")) return 8;",
  "        if (combined.includes(`"secondary nip`")) return 9;",
  "        if (combined.includes(`"winder`")) return 10;",
  "        if (n.includes(`"tower`") || n.includes(`"platform`")) return 11;",
  "        return 90;",
  "      }",
  "",
  "      if (is3or5Layer && mode === `"annexure`") {",
  "        // 3/5-layer detailed desc: Extruder -> Die/Air Ring -> Bubble Cage ->",
  "        // Main Nip + Collapsing Frame -> Haul-Off -> Winder -> Tower",
  "        if (n.includes(`"extruder`")) return 1;",
  "        if (n.includes(`"die`")) return 3;",
  "        if (combined.includes(`"air ring`") || combined.includes(`"airring`")) return 3;",
  "        if (combined.includes(`"ibc`")) return 3.5;",
  "        if (combined.includes(`"bubble cage`") || combined.includes(`"cage`") || combined.includes(`"basket`")) return 4;",
  "        if (combined.includes(`"main nip`") || combined.includes(`"collapsing frame`") || combined.includes(`"collapsing`")) return 5;",
  "        if (combined.includes(`"haul-off`") || combined.includes(`"hauloff`") || (combined.includes(`"haul`") && combined.includes(`"off`"))) return 6;",
  "        if (combined.includes(`"secondary nip`")) return 6.5;",
  "        if (combined.includes(`"winder`")) return 7;",
  "        if (n.includes(`"tower`") || n.includes(`"platform`")) return 8;",
  "        if (combined.includes(`"idler`")) return 8.5;",
  "        if (n.includes(`"control`") || n.includes(`"panel`") || combined.includes(`"extrusion control`")) return 9;",
  "        return 90;",
  "      }",
  "",
  "      // Default order (mono / aba / other machine types)",
  "      if (n.includes(`"extruder`")) return 1;",
  "      if (n.includes(`"control`") || n.includes(`"panel`") || combined.includes(`"extrusion control`")) return 2;",
  "      if (n.includes(`"die`")) return 3;",
  "      if (combined.includes(`"air ring`") || combined.includes(`"airring`")) return 4;",
  "      if (combined.includes(`"ibc`")) return 5;",
  "      if (combined.includes(`"bubble cage`") || combined.includes(`"cage`") || combined.includes(`"basket`")) return 6;",
  "      if (n.includes(`"tower`") || n.includes(`"platform`")) return 6.5;",
  "      if (combined.includes(`"collapsing frame`") || combined.includes(`"collapsing`") || combined.includes(`"haul-off`") || combined.includes(`"hauloff`") || combined.includes(`"main nip`") || (combined.includes(`"haul`") && combined.includes(`"off`"))) return 7;",
  "      if (combined.includes(`"idler`")) return 8;",
  "      if (combined.includes(`"secondary nip`")) return 9;",
  "      if (combined.includes(`"winder`")) return 10;",
  "      return 90;",
  "    };",
  "",
  "    return [...items].sort((a, b) => {",
  "      const orderA = getSortOrder(a);",
  "      const orderB = getSortOrder(b);",
  "      if (orderA !== orderB) return orderA - orderB;",
  "      return (a.name || `"`").localeCompare(b.name || `"`");",
  "    });",
  "  }"
)

# Build new lines array:
# Keep lines 0..765 (before merge block)
# Insert new merge lines
# Keep lines 779..790 (between merge end and function start)
# Insert new function lines
# Keep lines 821..end (after function)

$newLines = @()
$newLines += $lines[0..765]
$newLines += $newMerge
$newLines += $lines[779..790]
$newLines += $newFn
$newLines += $lines[821..($lines.Count - 1)]

[System.IO.File]::WriteAllLines($file, $newLines, [System.Text.Encoding]::UTF8)
Write-Host "Done. New line count: $($newLines.Count)"

# Verify
$verify = [System.IO.File]::ReadAllLines($file, [System.Text.Encoding]::UTF8)
$checkMerge = $verify | Select-String "isMultiLayer" | Select-Object -First 1
$checkFn = $verify | Select-String 'mode = "sos"' | Select-Object -First 1
Write-Host "isMultiLayer found: $($checkMerge -ne $null)"
Write-Host "mode param found: $($checkFn -ne $null)"
