// src/utils/generateScopeDesc.js
// ─────────────────────────────────────────────────────────────────────────────
// Hybrid Scope-of-Supply description generator.
//
// Priority order:
//   1. item.scopeDesc (manually set override — always wins)
//   2. Category-specific auto-generator using item.techDesc + item fields
//   3. item.shortDesc or item.cardDesc (existing fallback text)
//   4. item.name
// ─────────────────────────────────────────────────────────────────────────────

const NUM_WORDS = {
  1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
  6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
};

/** "one" / "two" / etc. or plain number string */
function numWord(n) {
  return NUM_WORDS[n] || String(n);
}

/**
 * Search techDesc object for a value by any of the supplied key-fragment hints.
 * Case-insensitive partial match on the key name.
 * Returns the first matching value string, or null.
 */
function td(techDesc, ...keyHints) {
  if (!techDesc || typeof techDesc !== "object") return null;
  for (const hint of keyHints) {
    const h = hint.toLowerCase();
    const entry = Object.entries(techDesc).find(([k]) =>
      k.toLowerCase().includes(h)
    );
    if (entry && entry[1]) return String(entry[1]);
  }
  return null;
}

// ─── Per-category generators ─────────────────────────────────────────────────

/**
 * EXTRUDER  ─ merges ALL extruder items in allSelected into one line.
 * e.g.  "Three Nos. Extruders of 45/55/45 mm screw diameter and L/D ratio of
 *        30:1, Imported Nitro Alloy screw & barrel, Ceramic Heater,
 *        20/40/20 HP AC Motor & AC variable frequency Drive.
 *        Three Candle type Manual Screen Changers for 45/55/45 mm Extruders."
 *
 * Expects callers to pass the FIRST extruder item + the FULL allSelected list
 * so we can group them. The caller must skip duplicate extruders.
 */
function generateExtruder(firstItem, allSelected) {
  const extruders = (allSelected || []).filter(
    (it) =>
      it &&
      (it.category === "Extruder" ||
        (it.name || "").toLowerCase().includes("extruder") ||
        (it.id || "").includes("ext-"))
  );

  // Motor HP — extract digits from "Main Drive" or "Drive" tech field
  const allDrives = extruders
    .map((ext) => {
      const driveStr = td(ext.techDesc, "main drive", "drive") || "";
      const m = driveStr.match(/(\d+)\s*HP/i) || driveStr.match(/(\d+)\s*kW/i);
      return m ? m[1] : null;
    });

  const combined = [];
  extruders.forEach((ext, idx) => {
    const q = ext.qty || 1;
    let sz = ext.sizeMm;
    if (!sz) {
      const m = (ext.name || "").match(/\b(\d{2,3})\s*mm/i);
      if (m) sz = parseInt(m[1], 10);
    }
    const hp = allDrives[idx] || null;
    for (let i = 0; i < q; i++) {
        combined.push({ sz: sz || "?", hp: hp || "?" });
    }
  });

  // Reorder for 3, 5, 7 layers to place the largest screws in the middle
  let ordered = [...combined];
  if (ordered.length >= 3 && ordered.length % 2 !== 0) {
    const sorted = [...combined].sort((a, b) => (parseInt(b.sz) || 0) - (parseInt(a.sz) || 0));
    let temp = [];
    let placeLeft = false;
    for (let i = 0; i < sorted.length; i++) {
        if (i === 0) {
            temp.push(sorted[i]);
        } else {
            if (placeLeft) temp.unshift(sorted[i]);
            else temp.push(sorted[i]);
            placeLeft = !placeLeft;
        }
    }
    ordered = temp;
  }

  const sizes = ordered.map(o => o.sz);
  const driveList = ordered.map(o => o.hp);

  const totalQty = sizes.length;
  const qtyWord = numWord(totalQty);
  const sizeStr = sizes.join("/");
  const plural = totalQty > 1;

  // L/D from first extruder's techDesc or default
  const ldRaw = td(firstItem.techDesc, "l/d", "ld ratio") || "30:1";
  // clean up to bare ratio e.g. "30 : 1" → "30:1"
  const ld = ldRaw.replace(/\s*:\s*/g, ":").split(" ")[0];

  // Material
  const material = td(firstItem.techDesc, "material") || "Nitro Alloy";
  const materialLine = material.toLowerCase().includes("nitro")
    ? "Imported Nitro Alloy screw & barrel"
    : material;

  const driveStr = driveList.some(d => d && d !== "?") ? driveList.join("/") : "";

  // Screen changer
  const scRaw =
    td(firstItem.techDesc, "screen changer") ||
    td(firstItem.techDesc, "screen") ||
    "Candle type";
  const scType = scRaw.split(",")[0].trim(); // e.g. "Candle type"

  let desc =
    `${qtyWord} No${plural ? "s" : ""}. Extruder${plural ? "s" : ""}` +
    (sizeStr !== "?" ? ` of ${sizeStr} mm screw diameter` : "") +
    ` and L/D ratio of ${ld}` +
    `, ${materialLine}, Ceramic Heater` +
    (driveStr
      ? `, ${driveStr} HP AC Motor & AC variable frequency Drive`
      : "") +
    `.`;

  if (scType) {
    desc += ` ${qtyWord} ${scType} Manual Screen Changer${plural ? "s" : ""}` +
      (sizeStr !== "?" ? ` for ${sizeStr} mm Extruder${plural ? "s" : ""}` : "") +
      ".";
  }

  return desc;
}

function generateFilter(item) {
  const qty = item.qty || 1;
  const type =
    td(item.techDesc, "type", "filter type") ||
    (item.name || "Screen Changer");
  return `${numWord(qty)} No${qty > 1 ? "s" : ""}. ${type}.`;
}

function generateDieHead(item) {
  const qty = item.qty || 1;
  // diameter — prefer diameterMm field, else parse from techDesc or name
  let diam = item.diameterMm ? `${item.diameterMm} mm` : null;
  if (!diam) {
    const raw = td(item.techDesc, "die size", "diameter") || item.lipsDesc || "";
    const m = raw.match(/(\d+)\s*mm/i);
    diam = m ? `${m[1]} mm` : raw || null;
  }

  const surface =
    td(item.techDesc, "surface treatment", "surface") || "Nickel plated";
  const isNickel = surface.toLowerCase().includes("nickel");
  const nickelStr = isNickel ? "Nickel plated " : "";

  // Layer count from dieFamily or name
  const name = item.name || "";
  let layerStr = "";
  if (name.toLowerCase().includes("three layer") || item.dieFamily === "3layer") {
    layerStr = "Three Layer ";
  } else if (name.toLowerCase().includes("aba") || item.dieFamily === "aba") {
    layerStr = "ABA / AB Co-extrusion ";
  } else if (
    name.toLowerCase().includes("mono") ||
    item.dieFamily === "mono"
  ) {
    layerStr = "Monolayer ";
  } else if (item.dieFamily === "5layer" || name.toLowerCase().includes("five")) {
    layerStr = "Five Layer ";
  }

  const distribution = td(item.techDesc, "distribution") || "Spiral";
  const distStr = distribution.toLowerCase().includes("spiral")
    ? "Spiral Mandrel"
    : distribution;

  return (
    `${numWord(qty)} Imported Canadian design ${nickelStr}${layerStr}${distStr} Die` +
    (diam ? ` with lip diameter of ${diam}` : "") +
    `, complete with die adapters and carriage.`
  );
}

function generateAirRing(item) {
  const hp = item.blowerPowerHP
    ? `${item.blowerPowerHP} HP`
    : (() => {
      const raw = td(item.techDesc, "blower") || "";
      const m = raw.match(/(\d+)\s*HP/i);
      return m ? `${m[1]} HP` : "High Pressure";
    })();

  const lipType =
    item.type === "dual" || (item.name || "").toLowerCase().includes("dual")
      ? "Dual Lip"
      : "Single Lip";

  return (
    `Advanced design ${lipType} Air Ring Package consisting of highly efficient air ring, ` +
    `distributor manifold, ${hp} Blower with AC Frequency drive.`
  );
}

function generateBubbleCage(item) {
  const type = td(item.techDesc, "type") || "PBT roller cage";
  const isMotorized = type.toLowerCase().includes("motorized");
  const cageControl = isMotorized ? "Motorized Bubble Cage" : "Manual Bubble Cage";
  return `One Bubble Stabilizing Basket with ${type}. ${cageControl} with Diameter adjustment.`;
}

function generateCollapsingFrame(item) {
  const rollerType =
    td(item.techDesc, "roller", "type") || "Segmented PBT";
  return `Collapsing Frame with ${rollerType} rollers, complete with side guides.`;
}

/**
 * HAUL-OFF — generates description matching exact wording of real quotation.
 * Standard:     "One Haul Off. Collapsing frame with Segmented PBT Roller,
 *                side guides, Main Nip with AC Drive."
 * Oscillating:  "One 360-degree rotation bottom supported Horizontal Oscillating
 *                Haul Off. Collapsing frame with Segmented PBT Roller, side guides,
 *                Main Nip with AC Drive."
 */
function generateHaulOff(item) {
  const qty = item.qty || 1;
  const name = (item.name || "").toLowerCase();

  const isOscillating =
    name.includes("oscillat") ||
    (td(item.techDesc, "type") || "").toLowerCase().includes("oscillat");

  // Extract motor HP from techDesc if present
  const motorRaw =
    td(item.techDesc, "main nip", "nip drive", "main drive") || "";
  const hpMatch = motorRaw.match(/(\d+)\s*HP/i);
  const motorStr = hpMatch ? `${hpMatch[1]} HP AC` : "AC";

  const prefix = isOscillating
    ? `One 360-degree rotation bottom supported Horizontal Oscillating Haul Off.`
    : `${numWord(qty)} Haul Off.`;

  return (
    `${prefix} Collapsing frame with Segmented PBT Roller, side guides, Main Nip with ${motorStr} Drive.`
  );
}


function generateWinder(item) {
  const qty = item.qty || 1;
  const variant = item.variant || "";

  // Type label
  let typeLabel = "Surface Winder";
  if (variant.includes("turret") || (item.name || "").toLowerCase().includes("turret")) {
    typeLabel = "Turret Winder";
  } else if (variant.includes("semi")) {
    typeLabel = "Semi-Automatic Surface Winder";
  } else if (variant.includes("auto") && !variant.includes("semi")) {
    typeLabel = "Automatic Surface Winder";
  }

  const widthRaw =
    td(item.techDesc, "maximum web width", "web width", "film width") || "";
  const widthStr = widthRaw.match(/\d+/)
    ? widthRaw.match(/\d+/)[0] + " mm"
    : widthRaw || "";

  const changeover = variant.includes("auto")
    ? "Automatic roll change over mechanism"
    : "Manual roll change over mechanism";

  const tension =
    td(item.techDesc, "tension") || "Torque mode";

  let desc =
    `${numWord(qty)} ${typeLabel}` +
    (widthStr ? ` of ${widthStr} film width` : "") +
    `. ${changeover}, Manual length counter, 4 nos.- 3" Resource Air shaft, bow roller, 2 HP AC Motor and Drive.` +
    ` Tension Control through ${tension}.`;

  return desc;
}

function generateSecondaryNip(item, machineModel) {
  const speed =
    (machineModel && (machineModel.lineSpeed || machineModel["Line Speed"])) ||
    td(item.techDesc, "speed", "line speed") ||
    "80 MPM";
  return (
    `One Secondary nip with edge slitting assembly and edge trimming assembly.` +
    ` Max line speed ${speed}.`
  );
}

function generateElectricalPanel(item) {
  const control =
    td(item.techDesc, "control system", "controller", "control") ||
    "PID Controller";
  return `Complete extrusion controls on main panel with Cold start protection. Control System: ${control}.`;
}

function generateTower(item) {
  return `Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame,
Oscillating Haul Off, Secondary Nip, Web aligner, Corona Treater etc.`;
}

// ─── Category → generator map ────────────────────────────────────────────────

const GENERATORS = {
  Extruder: generateExtruder,
  Filter: (item) => generateFilter(item),
  "Die Head": (item) => generateDieHead(item),
  "Air Ring": (item) => generateAirRing(item),
  "Bubble Cage": (item) => generateBubbleCage(item),
  "Collapsing Frame": (item) => generateCollapsingFrame(item),
  "Haul-Off": (item) => generateHaulOff(item),
  Winder: (item) => generateWinder(item),
  "Tower / Platform": (item) => generateTower(item),
  "Electrical & Control Panel": (item) => generateElectricalPanel(item),
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * generateScopeDesc(item, allSelected, machineModel?)
 *
 * @param {object}  item         – the selected component object
 * @param {object[]} allSelected – the full `selected` array (needed for extruder grouping)
 * @param {object}  [machineModel] – currentMachineModel from ConfigContext (optional)
 * @returns {string}
 */
export function generateScopeDesc(item, allSelected = [], machineModel = null) {
  if (!item) return "";

  // ① Manual scopeDesc always wins
  if (item.scopeDesc && typeof item.scopeDesc === "string" && item.scopeDesc.trim()) {
    return item.scopeDesc.trim();
  }

  const category = item.category || "";

  // ② Category-specific generator
  const gen = GENERATORS[category];
  if (gen) {
    try {
      // Extruder is special — needs allSelected for multi-extruder grouping
      if (category === "Extruder") {
        return generateExtruder(item, allSelected);
      }
      // Secondary Nip gets machine model for line speed
      if (
        category === "Winder" &&
        (item.variant === "secondary-nip" ||
          (item.name || "").toLowerCase().includes("secondary") ||
          (item.name || "").toLowerCase().includes("nip"))
      ) {
        return generateSecondaryNip(item, machineModel);
      }
      return gen(item);
    } catch (e) {
      console.warn("[generateScopeDesc] generator error for", category, e);
    }
  }

  // ③ Name-based heuristics for items without a strict category match
  const nameLc = (item.name || "").toLowerCase();

  if (nameLc.includes("idler")) {
    return "Aluminum Idler rollers as per layout drawing.";
  }
  if (nameLc.includes("secondary") || (nameLc.includes("nip") && !nameLc.includes("main"))) {
    return generateSecondaryNip(item, machineModel);
  }
  if (nameLc.includes("tower") || nameLc.includes("platform")) {
    return generateTower(item);
  }
  if (nameLc.includes("panel") || nameLc.includes("electrical")) {
    return generateElectricalPanel(item);
  }
  if (nameLc.includes("die")) {
    return generateDieHead(item);
  }
  if (nameLc.includes("air ring")) {
    return generateAirRing(item);
  }
  if (nameLc.includes("winder")) {
    return generateWinder(item);
  }

  // ④ Fallback to existing static fields
  return item.shortDesc || item.cardDesc || item.desc || item.name || "";
}
