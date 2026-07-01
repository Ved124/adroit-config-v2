$file = "pages\summary.jsx"
$c = Get-Content $file -Raw -Encoding UTF8

# 1. Replace haul-off/collapsing merge block to skip for 3-layer / 5-layer
$oldMerge = @'
  if (hauloffIdx !== -1 && collapsingIdx !== -1) {
    const cfItem = preCombineScope[collapsingIdx];
    const hoItem = preCombineScope[hauloffIdx];

    preCombineScope[hauloffIdx] = {
      ...hoItem,
      name: "Haul-Off and Collapsing Frame",
      shortDesc: `${cfItem.shortDesc}\n${hoItem.shortDesc}`,
      scopeDesc: `${cfItem.scopeDesc || cfItem.shortDesc}\n${hoItem.scopeDesc || hoItem.shortDesc}`,
      techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }
    };
    preCombineScope.splice(collapsingIdx, 1);
  }
'@

$newMerge = @'
  // For 3-layer and 5-layer: keep haul-off and collapsing frame as SEPARATE SOS entries.
  // Collapsing frame only appears if die rotation is selected (controlled by selected items).
  // Do NOT merge them and do NOT inject a standalone Main Nip item in the SOS.
  const isMultiLayer = machineType === "3layer" || machineType === "5layer";

  if (!isMultiLayer && hauloffIdx !== -1 && collapsingIdx !== -1) {
    const cfItem = preCombineScope[collapsingIdx];
    const hoItem = preCombineScope[hauloffIdx];

    preCombineScope[hauloffIdx] = {
      ...hoItem,
      name: "Haul-Off and Collapsing Frame",
      shortDesc: `${cfItem.shortDesc}\n${hoItem.shortDesc}`,
      scopeDesc: `${cfItem.scopeDesc || cfItem.shortDesc}\n${hoItem.scopeDesc || hoItem.shortDesc}`,
      techDesc: { ...cfItem.techDesc, ...hoItem.techDesc }
    };
    preCombineScope.splice(collapsingIdx, 1);
  }
'@

$c = $c.Replace($oldMerge, $newMerge)

# 2. Replace getSortedScope function with mode-aware version
$oldFn = @'
  // Refine SORT_ORDER index logic to put panel/control at the absolute bottom
  function getSortedScope(items) {
    const getSortOrder = (item) => {
      if (!item) return 99;
      const n = String(item.name || "").toLowerCase();
      const d = String(item.shortDesc || item.description || "").toLowerCase();
      const combined = n + " " + d;

      if (n.includes("extruder")) return 1;
      if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
      if (n.includes("die")) return 3;
      if (combined.includes("air ring") || combined.includes("airring")) return 4;
      if (combined.includes("ibc")) return 5;
      if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 6;
      if (combined.includes("collapsing frame") || combined.includes("collapsing") || combined.includes("haul-off") || combined.includes("hauloff") || (combined.includes("haul") && combined.includes("off"))) return 7;
      if (combined.includes("idler")) return 8;
      if (combined.includes("secondary nip")) return 9;
      if (combined.includes("winder")) return 10;
      if (n.includes("tower") || n.includes("platform")) return 11;

      return 90;
    };

    return [...items].sort((a, b) => {
      const orderA = getSortOrder(a);
      const orderB = getSortOrder(b);
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "");
    });
  }
'@

$newFn = @'
  // Sort scope items. Mode can be "sos" (scope of supply list) or "annexure" (detailed component descriptions).
  // For 3-layer and 5-layer machines, separate orderings apply per mode.
  function getSortedScope(items, mode = "sos") {
    const is3or5Layer = machineType === "3layer" || machineType === "5layer";

    const getSortOrder = (item) => {
      if (!item) return 99;
      const n = String(item.name || "").toLowerCase();
      const d = String(item.shortDesc || item.description || "").toLowerCase();
      const combined = n + " " + d;

      if (is3or5Layer && mode === "sos") {
        // 3/5-layer SOS order:
        // extruder → extrusion control → die → air ring → bubble cage →
        // haul-off → collapsing frame (only if die rotation) → idler rollers → secondary nip → winder → tower
        if (n.includes("extruder")) return 1;
        if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
        if (n.includes("die")) return 3;
        if (combined.includes("air ring") || combined.includes("airring")) return 4;
        if (combined.includes("ibc")) return 4.5;
        if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 5;
        // haul-off comes before collapsing frame
        if (combined.includes("haul-off") || combined.includes("hauloff") || (combined.includes("haul") && combined.includes("off"))) return 6;
        // collapsing frame standalone (only present when die rotation is selected)
        if (combined.includes("collapsing frame") || combined.includes("collapsing")) return 7;
        if (combined.includes("idler")) return 8;
        if (combined.includes("secondary nip")) return 9;
        if (combined.includes("winder")) return 10;
        if (n.includes("tower") || n.includes("platform")) return 11;
        return 90;
      }

      if (is3or5Layer && mode === "annexure") {
        // 3/5-layer detailed component description order:
        // Extruder → Die / Air Ring → Bubble Cage → Main Nip + Collapsing Frame →
        // Haul-Off → Winder → Tower
        if (n.includes("extruder")) return 1;
        if (n.includes("die")) return 3;
        if (combined.includes("air ring") || combined.includes("airring")) return 3;
        if (combined.includes("ibc")) return 3.5;
        if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 4;
        // main nip and collapsing frame together
        if (combined.includes("main nip") || combined.includes("collapsing frame") || combined.includes("collapsing")) return 5;
        // haul-off after main nip / collapsing
        if (combined.includes("haul-off") || combined.includes("hauloff") || (combined.includes("haul") && combined.includes("off"))) return 6;
        if (combined.includes("secondary nip")) return 6.5;
        if (combined.includes("winder")) return 7;
        if (n.includes("tower") || n.includes("platform")) return 8;
        if (combined.includes("idler")) return 8.5;
        // control panel goes at end for annexure
        if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 9;
        return 90;
      }

      // Default order (mono / aba / other machine types)
      if (n.includes("extruder")) return 1;
      if (n.includes("control") || n.includes("panel") || combined.includes("extrusion control")) return 2;
      if (n.includes("die")) return 3;
      if (combined.includes("air ring") || combined.includes("airring")) return 4;
      if (combined.includes("ibc")) return 5;
      if (combined.includes("bubble cage") || combined.includes("cage") || combined.includes("basket")) return 6;
      if (n.includes("tower") || n.includes("platform")) return 6.5;
      if (combined.includes("collapsing frame") || combined.includes("collapsing") || combined.includes("haul-off") || combined.includes("hauloff") || combined.includes("main nip") || (combined.includes("haul") && combined.includes("off"))) return 7;
      if (combined.includes("idler")) return 8;
      if (combined.includes("secondary nip")) return 9;
      if (combined.includes("winder")) return 10;
      return 90;
    };

    return [...items].sort((a, b) => {
      const orderA = getSortOrder(a);
      const orderB = getSortOrder(b);
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "");
    });
  }
'@

$c = $c.Replace($oldFn, $newFn)

Set-Content $file $c -Encoding UTF8 -NoNewline
"Done. New length: $($c.Length)"
