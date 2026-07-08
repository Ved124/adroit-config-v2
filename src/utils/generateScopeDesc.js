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

  // kW → HP: map standard kW ratings to their HP equivalents
  function kwToHp(kw) {
    const val = parseFloat(kw);
    if (isNaN(val)) return null;
    const map = [
      [0.75, "1"], [1.1, "1.5"], [1.5, "2"], [2.2, "3"], [3.7, "5"],
      [4.0, "5.5"], [5.6, "7.5"], [7.5, "10"], [11.2, "15"],
      [15, "20"], [18.5, "25"], [22.5, "30"], [30, "40"], [37, "50"],
    ];
    // Find closest match
    let best = null, bestDiff = Infinity;
    for (const [kwVal, hp] of map) {
      const diff = Math.abs(val - kwVal);
      if (diff < bestDiff) { bestDiff = diff; best = hp; }
    }
    return best;
  }

  // Motor HP — extract digits from "Main Drive" or "Drive" tech field
  const allDrives = extruders
    .map((ext, idx) => {
      const driveStr = td(ext, "main drive", "drive") || "";
      // Prefer HP match, then kW (converted to HP)
      const hpMatch = driveStr.match(/(\d+(?:\.\d+)?)\s*HP/i);
      if (hpMatch) return hpMatch[1];
      const kwMatch = driveStr.match(/(\d+(?:\.\d+)?)\s*kW/i);
      if (kwMatch) return kwToHp(kwMatch[1]) || kwMatch[1];

      // Fallback: If techDesc is missing, try to parse from machineModel.motorsHp (e.g. "50/100/50")
      if (machineModel && machineModel.motorsHp) {
        const hpParts = machineModel.motorsHp.split("/");
        if (hpParts.length === totalQty) {
          const part = hpParts[idx].trim();
          const pm = part.match(/(\d+)/);
          return pm ? pm[1] : null;
        }
      }
      // Last resort: use machineModel.extruderMotorKw and convert to HP
      if (machineModel && machineModel.extruderMotorKw) {
        const kwParts = machineModel.extruderMotorKw.split("/");
        if (kwParts.length === totalQty) {
          return kwToHp(kwParts[idx].trim());
        }
      }
      return null;
    });

  // Parse sizes from machineModel.screwDiameter if available (authoritative source, e.g. "35/45 MM")
  let modelSizes = null;
  if (machineModel && machineModel.screwDiameter) {
    const parts = machineModel.screwDiameter.split("/").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parts.length === totalQty) modelSizes = parts;
  }

  const combined = [];
  extruders.forEach((ext, idx) => {
    const q = ext.qty || 1;
    let sz;
    if (modelSizes) {
      // Use machine model's authoritative screw diameter
      sz = modelSizes[idx];
    } else {
      sz = ext.sizeMm;
      if (!sz) {
        const m = (ext.name || "").match(/\b(\d{2,3})\s*mm/i);
        if (m) sz = parseInt(m[1], 10);
      }
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

  const isAba = machineModel && machineModel.machineType === "aba";

  let materialLine = material.toLowerCase().includes("nitro")
    ? "Nitro Alloy screw & barrel"
    : material;

  if (numBimetallic > 0) {
    if (numBimetallic >= totalQty) {
      materialLine = "Bi-metallic screw & barrel";
    } else {
      // Mixed case
      const nitroCount = totalQty - numBimetallic;
      const nitroText = "Nitro Alloy screw & barrel";
      materialLine = `${numWord(numBimetallic)} with Bi-metallic screw & barrel, ${numWord(nitroCount)} with ${nitroText}`;
    }
  }

  const driveStr = driveList.some(d => d && d !== "?") ? driveList.join("/") : "";

  // Screen changer
  const isLeverUpgrade = (selectedAddons || []).some(a => a.id === "addon-lever-screen-changer");
  const scRaw =
    td(firstItem, "screen changer") ||
    td(firstItem, "screen") ||
    "Candle type";
  
  let scType = scRaw.split(",")[0].trim(); // e.g. "Candle type"
  if (isLeverUpgrade) {
    scType = "Lever type";
  }

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

function generateDieHead(item, machineModel) {
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
    layerStr = "Three Layer ";
  } else if (
    name.toLowerCase().includes("mono") ||
    item.dieFamily === "mono"
  ) {
    layerStr = "Monolayer ";
  } else if (item.dieFamily === "5layer" || name.toLowerCase().includes("five")) {
    layerStr = "Five Layer ";
  }

  const distribution = td(item, "distribution") || "Spiral";
  const distStr = distribution.toLowerCase().includes("spiral") || distribution.toLowerCase() === "hidden"
    ? "Spiral Mandrel"
    : distribution;

  const isIbc = name.toLowerCase().includes("ibc") || (item.id || "").toLowerCase().includes("ibc");
  const ibcSuffix = isIbc ? " and IBC provision" : "";

  const isRotationModel = machineModel && ((machineModel.code || "").toLowerCase().includes("dr") || (machineModel.label || "").toLowerCase().includes("dr"));
  const isRotation = item.isRotationSelected || name.toLowerCase().includes("rotation") || (item.id || "").toLowerCase().includes("-dr") || (item.id || "").includes("dr-") || isRotationModel;
  const rotationSuffix = isRotation ? " Die with Rotation." : "";

  const isMonoOrAba = machineModel && (machineModel.machineType === "mono" || machineModel.machineType === "aba" || (machineModel.code && (machineModel.code.includes("UNO") || machineModel.code.includes("DUO"))));
  let diamStr = diam ? ` with lip diameter of ${diam}` : "";
  if (isMonoOrAba || name.toLowerCase().includes("mono") || name.toLowerCase().includes("aba")) {
    diamStr = " with lip diameter as per width";
  }

  return (
    `${numWord(qty)} ${surfaceStr}${layerStr}${distStr} Die` +
    diamStr +
    ` complete with die adapters and carriage${ibcSuffix}.${rotationSuffix}`
  );
}

function generateAirRing(item) {
  const hpFromTech = td(item, "blower");
  let hp = "High Pressure";
  if (hpFromTech) {
    const match = hpFromTech.match(/([0-9.]+)\s*HP/i);
    if (match) {
      hp = `${match[1]} HP`;
    } else {
      hp = hpFromTech.includes("HP") ? hpFromTech : `${hpFromTech} HP`;
    }
  } else if (item.blowerPowerHP) {
    hp = `${item.blowerPowerHP} HP`;
  }

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
  let baseDesc = item.scopeDesc || "";

  // If there's no predefined scopeDesc, build a fallback that safely avoids reading the nip's bearing text
  if (!baseDesc) {
    let rollerType = "Segmented PBT";
    const cfVal = td(item.techDesc, "collapsing frames", "collapsing frame");
    if (cfVal) {
      rollerType = cfVal.replace(/rollers?\.?/gi, "").trim();
    } else if (item.techDesc && item.techDesc["Type"]) {
      rollerType = item.techDesc["Type"].replace(/rollers?\.?/gi, "").trim();
    }
    
    // Check if it's a combined unit by looking for nip motor
    const motorStr = td(item.techDesc, "nip roller drive", "nip drive", "motor");
    const hpMatch = motorStr ? motorStr.match(/(\d+)\s*HP/i) : null;
    
    if (hpMatch) {
      baseDesc = `Collapsing frame with ${rollerType} rollers, side guides, Main Nip with ${hpMatch[1]} HP AC Drive.`;
    } else {
      baseDesc = `Collapsing frame with ${rollerType} rollers, complete with side guides.`;
    }
  }

  // Take care of dynamic elements in the scopeDesc (like dynamic HP based on width)
  const motorRaw = td(item.techDesc, "nip roller drive", "nip drive", "motor");
  const hpMatch = motorRaw ? motorRaw.match(/(\d+)\s*HP/i) : null;
  if (hpMatch && baseDesc.match(/\d+\s*HP/i)) {
    baseDesc = baseDesc.replace(/\d+\s*HP/i, `${hpMatch[1]} HP`);
  }

  return baseDesc;
}

/**
 * MAIN NIP — for models which separate the Nip from the Collapsing Frame.
 */
function generateMainNip(item) {
  if (item.scopeDesc) return item.scopeDesc;
  // Derive motor HP from techDesc as fallback/override
  const nipDriveRaw = td(item, "nip roller drive", "nip drive", "drive") || "";
  const hpMatch = nipDriveRaw.match(/(\d+)\s*HP/i);
  const motorStr = hpMatch ? `${hpMatch[1]} HP AC` : "2 HP AC";

  return `Collapsing frame with Segmented PBT Roller, side guides, Main Nip with ${motorStr} Drive.`;
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

  // Dynamic HP calculation based on width if not explicitly found or if it needs enforcement
  const widthRaw = td(item, "hauloff size", "nip roller width", "size") || (item.size ? `${item.size} mm` : "");
  const width = parseInt(widthRaw.replace(/\D/g, '')) || 0;

  let motorStr = "AC";
  const hpMatch = motorRaw.match(/(\d+)\s*HP/i);

  if (width > 2000) {
    motorStr = "5 HP AC";
  } else if (hpMatch) {
    motorStr = `${hpMatch[1]} HP AC`;
  } else if (width > 0) {
    if (width <= 1450) motorStr = "2 HP AC";
    else motorStr = "3 HP AC";
  }

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
    typeLabel = "Surface Winder";
  }

  const widthRaw =
    td(item.techDesc, "maximum web width", "web width", "film width") || "";
  let widthStr = widthRaw.match(/\d+/)
    ? widthRaw.match(/\d+/)[0] + " mm"
    : widthRaw || "";

  // If not found in keys, check values for "web width of XXX mm" (generated by ConfigContext)
  if (!widthStr && item.techDesc) {
    for (const val of Object.values(item.techDesc)) {
      if (typeof val === "string") {
        const m = val.match(/web width of (\d+)\s*mm/i);
        if (m) {
          widthStr = m[1] + " mm";
          break;
        }
      }
    }
  }

  // If still no width, try item.size or item.currentSize, converting roller width to film width
  if (!widthStr && (item.size || item.currentSize)) {
    const s = parseInt(item.size || item.currentSize) || 0;
    // If size matches standard machine widths (1000, 1250, 1350, 1500, etc), it might already be film width
    // but the safest fallback is just s
    const diff = (s === 1450) ? 100 : 120;
    const maxFilmWidth = s > 500 ? (s - diff) : s;
    widthStr = `${maxFilmWidth} mm`;
  }

  const widthNum = parseInt(widthStr) || 0;
  let hpLabel = "2 HP";
  if (widthNum >= 1500 && widthNum <= 2000) hpLabel = "3 HP";
  else if (widthNum > 2000) hpLabel = "5 HP";

  const prefix = "";

  const hasLoadcell = (selectedAddons || []).some(a => a.id === "addon-loadcell-tension");
  const isIBC = (machineModel?.name || "").toLowerCase().includes("ibc") || (item.name || "").toLowerCase().includes("ibc");

  const tensionStr = (hasLoadcell || isIBC) ? "automatic tension control through Loadcell" : "tension control through Torque";

  const qWord = (qty === 1 && (typeLabel.toLowerCase().startsWith("two") || typeLabel.toLowerCase().startsWith("back")))
    ? ""
    : `${numWord(qty)} `;

  if (isBackToBack) {
    const isMonoOrAba = machineModel && (machineModel.machineType === "mono" || machineModel.machineType === "aba");
    const hasAirShaft = (selectedAddons || []).some(a => a.id === "addon-air-shaft-dynamic");
    
    let shaftStr = "04 nos.- 3” Air shaft";
    let gearMotorStr = "Post Extrusion Gear Motors will be Bonvario or Equivalent.";

    if (isMonoOrAba) {
      shaftStr = hasAirShaft ? "04 nos.- 3” Air shaft" : "04 nos.- 3” Mechanical shaft";
      gearMotorStr = ""; 
    }

    const parts = [
      "Manual roll change over mechanism",
      tensionStr,
      "digital length counter",
      shaftStr,
      "bow roller",
      `${hpLabel} AC Motor and Drive`
    ].filter(Boolean);

    let res = prefix + `${qWord}${typeLabel} of ${widthStr} film width. ` + parts.join(", ") + ".";
    if (gearMotorStr) {
      res += " " + gearMotorStr;
    }
    return res;
  }

  if (isTwoSeparate) {
    const mechanism = isAutomatic ? "Automatic" : "Manual";
    const airShaftLabel = isAutomatic ? "airshaft" : "Resource Air shaft";
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
      parts.join(", ") + `. Post Extrusion Gear motor will be ${gearMotorMake}, Italy or Equivalent.`;
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
  "Die Head": (item, allSelected, machineModel) => generateDieHead(item, machineModel),
  "Air Ring": (item) => generateAirRing(item),
  "Bubble Cage": (item) => generateBubbleCage(item),
  "Collapsing Frame": (item) => generateCollapsingFrame(item),
  "Haul-Off": (item, allSelected, machineModel) => generateHaulOff(item, machineModel),
  "Main Nip": (item) => generateMainNip(item),
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
      return generateDieHead(item, machineModel);
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
