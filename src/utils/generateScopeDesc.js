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
function td(source, ...keyHints) {
  if (!source) return null;

  // Consolidate search target: merge base techDesc and metadata overrides
  const baseTD = source.techDesc || (typeof source === "object" && !source.id ? source : {});
  const metaTD = (source.metadata && source.metadata.techDesc) ? source.metadata.techDesc : {};
  const techDesc = { ...baseTD, ...metaTD };

  if (!techDesc || typeof techDesc !== "object") return null;

  for (const hint of keyHints) {
    const h = hint.toLowerCase();
    const entry = Object.entries(techDesc).find(([k]) =>
      k.toLowerCase().includes(h)
    );
    if (entry && entry[1]) {
      const val = String(entry[1]);
      if (val.includes("?") || val.toUpperCase().includes("TBD")) return null;
      return val;
    }
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
function generateExtruder(firstItem, allSelected, machineModel, selectedAddons = []) {
  const extruders = (allSelected || []).filter(
    (it) =>
      it &&
      (it.category === "Extruder" ||
        (it.name || "").toLowerCase().includes("extruder") ||
        (it.id || "").includes("ext-"))
  );

  const totalQty = extruders.reduce((sum, it) => sum + (it.qty || 1), 0);

  // Motor HP — extract digits from "Main Drive" or "Drive" tech field
  const allDrives = extruders
    .map((ext, idx) => {
      const driveStr = td(ext, "main drive", "drive") || "";
      const m = driveStr.match(/(\d+)\s*HP/i) || driveStr.match(/(\d+)\s*kW/i);
      if (m) return m[1];

      // Fallback: If techDesc is missing, try to parse from machineModel.motorsHp (e.g. "50/100/50")
      if (machineModel && machineModel.motorsHp) {
        const hpParts = machineModel.motorsHp.split("/");
        if (hpParts.length === totalQty) {
          const part = hpParts[idx].trim();
          const pm = part.match(/(\d+)/);
          return pm ? pm[1] : null;
        }
      }
      return null;
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

  // const totalQty = sizes.length; // Already defined above
  const qtyWord = numWord(totalQty);
  const sizeStr = sizes.join("/");
  const plural = totalQty > 1;

  // L/D from first extruder's techDesc, machineModel fallback, or default
  const ldRaw = td(firstItem, "l/d", "ld ratio") || (machineModel ? machineModel.ldRatio : "") || "30:1";
  // clean up to bare ratio e.g. "30 : 1" → "30:1"
  const ld = ldRaw.replace(/\s*:\s*/g, ":").split(" ")[0];

  // Material
  const material = td(firstItem, "material") || "Nitro Alloy";

  // Check for bimetallic addons in selectedAddons
  const bimetallicAddons = (selectedAddons || []).filter(a => a.id.startsWith("bimetallic-upgrade-"));
  const numBimetallic = bimetallicAddons.reduce((sum, a) => sum + (a.qty || 1), 0);

  let materialLine = material.toLowerCase().includes("nitro")
    ? "Imported Nitro Alloy screw & barrel"
    : material;

  if (numBimetallic > 0) {
    if (numBimetallic >= totalQty) {
      materialLine = "Imported Bi-metallic screw & barrel";
    } else {
      // Mixed case
      const nitroCount = totalQty - numBimetallic;
      materialLine = `${numWord(numBimetallic)} with Bi-metallic screw & barrel, ${numWord(nitroCount)} with Imported Nitro Alloy screw & barrel`;
    }
  }

  const driveStr = driveList.some(d => d && d !== "?") ? driveList.join("/") : "";

  // Screen changer
  const scRaw =
    td(firstItem, "screen changer") ||
    td(firstItem, "screen") ||
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

  // All Adroit dies are Chrome plated.
  const surfaceStr = "Chrome plated ";

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

  const distribution = td(item, "distribution") || "Spiral";
  const distStr = distribution.toLowerCase().includes("spiral")
    ? "Spiral Mandrel"
    : distribution;

  const isIbc = name.toLowerCase().includes("ibc") || (item.id || "").toLowerCase().includes("ibc");
  const ibcSuffix = isIbc ? " and IBC provision" : "";

  return (
    `${numWord(qty)} Imported Canadian design ${surfaceStr}${layerStr}${distStr} Die` +
    (diam ? ` with lip diameter of ${diam}` : "") +
    `, complete with die adapters and carriage${ibcSuffix}.`
  );
}

function generateAirRing(item) {
  const hpFromTech = td(item, "blower");
  const hp = hpFromTech
    ? (hpFromTech.includes("HP") ? hpFromTech : `${hpFromTech} HP`)
    : (item.blowerPowerHP ? `${item.blowerPowerHP} HP` : "High Pressure");

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
  const size = item.size || "";
  const name = (item.name || "").toLowerCase();
  const id = (item.id || "").toLowerCase();

  // Specific statement for Up Down Bubble Cage (UD BC)
  if (name.includes("up down") || id.includes("up-down")) {
    return (
      "One Bubble Stabilizing Basket with Silicon roller cage. " +
      "Motorized Up Down and Open-Close with Liner Actuator. "
    );
  }

  // Specific statement for Manual Bubble Cage
  if (name.includes("manual") || id.includes("manual")) {
    return (
      "One Bubble Stabilizing Basket with PBT roller cage. " +
      "Manual open-close operation. "
    );
  }

  // Specific statement for Open Close Bubble Cage (OC BC)
  if (name.includes("open close") || id.includes("open-close")) {
    return (
      "One Bubble Stabilizing Basket with Silicon roller cage. " +
      "Motorized Open-Close operation. "
    );
  }

  return (
    "One Bubble Stabilizing Basket. " +
    (size ? `For bubble diameter up to ${size} mm.` : "")
  );
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
function generateHaulOff(item, machineModel) {
  const qty = item.qty || 1;
  const name = (item.name || "").toLowerCase();

  const isOscillating =
    name.includes("oscillat") ||
    item.variant === "oscillating" ||
    (td(item, "type") || "").toLowerCase().includes("oscillat");

  // Extract motor HP from techDesc or machineModel fallback
  const motorRawFromTech = td(item, "nip drive", "main drive", "nip roller drive");
  const motorRaw = motorRawFromTech || (machineModel ? machineModel.mainNipDrive : "") || "";

  const hpMatch = motorRaw.match(/(\d+)\s*HP/i);
  const motorStr = hpMatch ? `${hpMatch[1]} HP AC` : "AC";

  const prefix = isOscillating
    ? `One 360-degree rotation bottom supported Horizontal Oscillating Haul Off.`
    : `${numWord(qty)} Haul Off.`;

  const lineSpeedFromTech = td(item, "line speed");
  const lineSpeed = lineSpeedFromTech || (machineModel ? machineModel.lineSpeed : "") || "";
  const speedSuffix = lineSpeed ? ` Linespeed is ${lineSpeed}.` : "";

  return (
    `${prefix} Collapsing frame with Segmented PBT Roller, side guides, Main Nip with ${motorStr} Drive.${speedSuffix}`
  );
}


/**
 * WINDER
 * @param {object} item 
 * @param {object} machineModel 
 * @param {object} [options]
 * @param {boolean} [options.includeNipPrefix=true] 
 */
export function generateWinder(item, machineModel = null, { includeNipPrefix = true, selectedAddons = [] } = {}) {
  const qty = item.qty || 1;
  const variant = item.variant || "";
  const nameLc = (item.name || "").toLowerCase();

  // Type label and specific template selection
  let typeLabel = "Surface Winder";
  const isBackToBack = nameLc.includes("back to back");
  const isTwoSeparate = nameLc.includes("two separate") || nameLc.includes("separate surface");
  const isAutomatic = nameLc.includes("automatic");

  if (variant.includes("turret") || nameLc.includes("turret")) {
    typeLabel = "Turret Winder";
  } else if (isAutomatic && isTwoSeparate) {
    typeLabel = "Two Separate Automatic Surface Winder";
  } else if (isBackToBack) {
    typeLabel = "Back to Back Surface Winder";
  } else if (isTwoSeparate) {
    typeLabel = "Two Separate Surface Winder";
  } else if (isAutomatic) {
    typeLabel = "Automatic Surface Winder";
  } else if (variant.includes("semi") || nameLc.includes("surface")) {
    typeLabel = "Semi-Automatic Surface Winder";
  }

  const widthRaw =
    td(item.techDesc, "maximum web width", "web width", "film width") || "";
  let widthStr = widthRaw.match(/\d+/)
    ? widthRaw.match(/\d+/)[0] + " mm"
    : widthRaw || "";

  // If still no width, try item.size or item.currentSize
  if (!widthStr && (item.size || item.currentSize)) {
    widthStr = `${item.size || item.currentSize} mm`;
  }

  const prefix = includeNipPrefix
    ? `One Secondary nip with edge slitting assembly and edge trimming assembly. `
    : "";

  const hasLoadcell = (selectedAddons || []).some(a => a.id === "addon-loadcell-tension");
  const isIBC = (machineModel?.name || "").toLowerCase().includes("ibc") || (item.name || "").toLowerCase().includes("ibc");
  
  const tensionStr = (hasLoadcell || isIBC) ? "automatic tension control through Loadcell" : "tension control through Torque";

  const qWord = (qty === 1 && (typeLabel.toLowerCase().startsWith("two") || typeLabel.toLowerCase().startsWith("back")))
    ? ""
    : `${numWord(qty)} `;

  if (isBackToBack) {
    const parts = [
      "Manual roll change over mechanism",
      tensionStr,
      "digital length counter",
      "04 nos.- 3” Air shaft",
      "bow roller",
      "2 HP AC Motor and Drive"
    ].filter(Boolean);

    return prefix + `${qWord}${typeLabel} of ${widthStr} film width. ` +
      parts.join(", ") + ". Post Extrusion Gear Motors will be Bonvario, Italy.";
  }

  if (isTwoSeparate) {
    const mechanism = isAutomatic ? "Automatic" : "Manual";
    const airShaftLabel = isAutomatic ? "airshaft" : "Resource Air shaft";
    const hpLabel = isAutomatic ? "3 HP" : "2 HP";
    const gearMotorMake = "Bonvario";

    const parts = [
      `${mechanism} roll change over mechanism`,
      tensionStr,
      "digital length counter",
      `04 nos.- 3” ${airShaftLabel}`,
      "bow roller",
      `${hpLabel} AC Motor and Drive`
    ].filter(Boolean);

    return prefix + `${qWord}${typeLabel} of ${widthStr} film width. ` +
      parts.join(", ") + `. Post Extrusion Gear motor will be ${gearMotorMake}, Italy.`;
  }

  const changeover = variant.includes("auto")
    ? "Automatic roll change over mechanism"
    : "Manual roll change over mechanism";

  const parts = [changeover, tensionStr].filter(Boolean);
  return prefix + `${qWord}${typeLabel} of ${widthStr} film width with ` + parts.join(" and ") + ".";
}

export function generateSecondaryNip(item, machineModel) {
  return `One Secondary nip with edge slitting assembly and edge trimming assembly.`;
}

function generateElectricalPanel(item) {
  const control =
    td(item, "control system", "controller", "control") ||
    "PID Controller";
  return `Complete extrusion controls on main panel with Cold start protection. Control Syst4em: ${control}.`;
}

function generateTower(item) {
  return `Tower Structure to support and mount Bubble stabilizing Basket, Collapsing Frame, Oscillating Haul Off, Secondary Nip etc.`;
}

function generateIBC(item) {
  return `Complete IBC package and Controls. IBC hardware, manifolds, Inlet and Outlet blower controls etc. will be provided.`;
}

// ─── Category → generator map ────────────────────────────────────────────────

const GENERATORS = {
  Extruder: generateExtruder,
  Filter: (item) => generateFilter(item),
  "Die Head": (item) => generateDieHead(item),
  "Air Ring": (item) => generateAirRing(item),
  "Bubble Cage": (item) => generateBubbleCage(item),
  "Collapsing Frame": (item) => generateCollapsingFrame(item),
  "Haul-Off": (item, allSelected, machineModel) => generateHaulOff(item, machineModel),
  Winder: (item, allSelected, machineModel, selectedAddons) => generateWinder(item, machineModel, { selectedAddons }),
  "Tower / Platform": (item) => generateTower(item),
  "Electrical & Control Panel": (item) => generateElectricalPanel(item),
  IBC: (item) => generateIBC(item),
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * generateScopeDesc(item, allSelected, machineModel?, selectedAddons?)
 *
 * @param {object}  item         – the selected component object
 * @param {object[]} allSelected – the full `selected` array
 * @param {object}  [machineModel] – currentMachineModel from ConfigContext (optional)
 * @param {object[]} [selectedAddons] – the list of selected addons (optional)
 * @returns {string}
 */
export function generateScopeDesc(item, allSelected = [], machineModel = null, selectedAddons = []) {
  if (!item) return "";

  // ① Manual scopeDesc always wins
  if (item.scopeDesc && typeof item.scopeDesc === "string" && item.scopeDesc.trim()) {
    return item.scopeDesc.trim();
  }

  const category = item.category || "";

  try {
    // ② Category-specific generator
    const gen = GENERATORS[category];
    if (gen) {
      // Extruder is special — needs allSelected for multi-extruder grouping
      if (category === "Extruder") {
        return generateExtruder(item, allSelected, machineModel, selectedAddons);
      }
      if (
        category === "Winder" &&
        (item.variant === "secondary-nip" ||
          ((item.name || "").toLowerCase().includes("secondary") && !(item.name || "").toLowerCase().includes("winder")))
      ) {
        return generateSecondaryNip(item, machineModel);
      }
      if (category === "Winder") {
        return generateWinder(item, machineModel, { selectedAddons });
      }
      return gen(item, allSelected, machineModel, selectedAddons);
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
    if (nameLc.includes("ibc")) {
      return generateIBC(item);
    }
    if (nameLc.includes("die")) {
      return generateDieHead(item);
    }
    if (nameLc.includes("air ring")) {
      return generateAirRing(item);
    }
    if (nameLc.includes("winder")) {
      return generateWinder(item, machineModel, { selectedAddons });
    }
  } catch (e) {
    console.warn("[generateScopeDesc] error during generation:", category, item.name, e);
  }

  // ④ Fallback to existing static fields
  return item.shortDesc || item.cardDesc || item.desc || item.name || "";
}
