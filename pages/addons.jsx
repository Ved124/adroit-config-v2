"use client";

import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { ConfigContext } from "../src/ConfigContext";
import { motion } from "framer-motion";
import { CORONA_PRICES, CORONA_BRANDS } from "../src/data/corona";
import { WEB_GUIDE_PRICES, WEB_GUIDE_BRANDS } from "../src/data/webGuide";
import { PRASAD_AIR_CHILLER_PRICES, PRASAD_WATER_CHILLER_PRICES, CHILLER_BRANDS, CONAIR_AIR_CHILLER_PRICES, CONAIR_WATER_CHILLER_PRICES } from "../src/data/chiller";
import { HEAT_EXCHANGER_PRICES, HEAT_EXCHANGER_BRANDS, HEAT_EXCHANGER_UNO_PRICES, HEAT_EXCHANGER_DUO_PRICES } from "../src/data/heatExchanger";
import { MIXER_DRYER_PRICES, MIXER_DRYER_BRANDS, MIXER_PRICES } from "../src/data/materialHandling";
import { SCREW_SIZES } from "../src/data/bimetallic";
import { DIE_ROTATION_PRICES, ADDITIONAL_LIP_PRICES } from "../src/data/dieAddons";
import { EPC_COMPONENTS, EPC_BRANDS, EPC_PRICES } from "../src/data/epc";
import { BACK_TO_BACK_PRICES, AIR_SHAFT_PRICES } from "../src/data/winderAddons";
import { HOPPER_LOADER_UNO_PRICES, HOPPER_LOADER_DUO_PRICES, HOPPER_LOADER_MULTI, HOPPER_DRYER_B_PRICES } from "../src/data/materialHandling";

export default function AddonsPage() {
  const router = useRouter();
  const {
    // data
    filteredAddons,      // ✅ already filtered by machine type + model/custom
    customer,
    machineType,

    // selection state
    selectedAddons,
    addAddon,
    removeAddon,
    setAddonQty,
    openModal,

    // global price toggle
    showPrices,
    setShowPrices,

    selectedMachineModelLabel, // 👈 ADD THIS
    applyModelPreset,
  } = useContext(ConfigContext);


  const handleResetToPreset = () => {
    if (!selectedMachineModelLabel) return;
    applyModelPreset(selectedMachineModelLabel);
  };


  const getSelectedAddon = (id) =>
    selectedAddons?.find((x) => x.id === id) || null;

  return (
    <div className="min-h-screen bg-brand-light text-slate-900 pt-24 sm:pt-28">
      {/* Navbar is global */}

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 py-6"
      >
        {/* Top bar */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-6">
          <div className="text-sm text-slate-600">
            <div className="font-bold text-brand-blue text-lg">
              {customer?.company || customer?.name || "Customer"} {"-"} {customer?.city || ""}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {customer?.machineModel ||
                customer?.machineFamily ||
                machineType ||
                "Machine not selected"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => setShowPrices((prev) => !prev)}
                className="flex items-center gap-1 px-3 py-1 rounded-full  hover:bg-slate-100 text-slate-300"
              >
                <span>{!showPrices ? <FaEyeSlash /> : <FaEye />}</span>
                {/* <span>{showPrices ? "" : ""}</span> */}
              </button>
              {customer?.machineModel && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedMachineModelLabel) {
                      applyModelPreset(selectedMachineModelLabel);
                    }
                  }}
                  className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Reset to model preset
                </button>

              )}
            </label>
          </div>
        </div>

        {/* Add-ons by category */}
        {Object.keys(filteredAddons).length === 0 ? (
          <div className="text-sm text-slate-500 italic p-8 text-center bg-white rounded-2xl border border-slate-200">
            No optional items defined for this machine type / model.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredAddons).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-lg font-bold mb-4 text-brand-blue border-b border-slate-200 pb-2">
                  {category}
                </h2>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <AddonCard
                      key={item.id}
                      item={item}
                      category={category}
                      getSelectedAddon={getSelectedAddon}
                      showPrices={showPrices}
                      addAddon={addAddon}
                      removeAddon={removeAddon}
                      setAddonQty={setAddonQty}
                      openModal={openModal}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-3 border-t border-slate-200 pt-6">
          <button
            onClick={() => router.push("/selection")}
            className="flex-1 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 text-sm font-medium transition-all shadow-sm"
          >
            ← Back to Selection
          </button>
          <button
            onClick={() => router.push("/summary")}
            className="flex-1 px-8 py-3 rounded-xl bg-brand-blue text-white hover:bg-brand-dark text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            Go to Summary →
          </button>
        </div>
      </motion.main>
    </div>
  );
}

function AddonCard({
  item,
  category,
  getSelectedAddon,
  showPrices,
  addAddon,
  removeAddon,
  setAddonQty,
  openModal,
}) {
  const line = getSelectedAddon(item.id);
  const isSelected = !!line;
  const qty = line?.qty || 0;

  // Determine which data to use based on item
  const isCorona = item.id === "corona-dynamic";
  const isWebGuide = item.id === "webguide-dynamic";
  const isAirChiller = item.id === "chiller-air-dynamic";
  const isWaterChiller = item.id === "chiller-water-dynamic";
  const isChiller = (isAirChiller || isWaterChiller) && item.isDynamic;
  const isMixerDryer = item.id === "mixer-dryer-dynamic";
  const isMixer = item.id === "mixer-dynamic";
  const isHeatExchanger = item.type === "heat-exchanger";
  const isHeatExchangerUno = item.id === "heat-exchanger-uno";
  const isHeatExchangerDuo = item.id === "heat-exchanger-duo";
  const isBimetallic = item.id.startsWith("bimetallic-upgrade-");
  const isDieRotation = item.id === "die-rotation-addon";
  const isEpC = item.id === "epc-dynamic";
  
  const isBackToBack = item.id === "winder-manual-back-to-back-dynamic";
  const isAirShaft = item.id === "addon-air-shaft-dynamic";
  const isHopperLoaderUno = item.id === "hopper-loader-uno-dynamic";
  const isHopperLoaderDuo = item.id === "hopper-loader-duo-dynamic";
  const isHopperLoaderTrio = item.id === "hopper-loader-300kg";
  const isHopperDryerB = item.id === "hopper-dryer-b";
  const isAdditionalLip = item.id === "additional-lip-set-addon";
  const isOptionalFeature = item.category === "Optional Features";

  const brands = isCorona ? CORONA_BRANDS : (isWebGuide ? WEB_GUIDE_BRANDS : (isChiller ? CHILLER_BRANDS : ((isMixerDryer || isMixer) ? MIXER_DRYER_BRANDS : (isHeatExchanger ? HEAT_EXCHANGER_BRANDS : (isDieRotation ? ["Adroit"] : (isEpC ? EPC_BRANDS : []))))));

  // Local state for dynamic config
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || "Adroit");
  const isConAir = selectedBrand === "Conair" || selectedBrand === "Con Air";

  const chillerPrices = isAirChiller
    ? (isConAir ? CONAIR_AIR_CHILLER_PRICES : PRASAD_AIR_CHILLER_PRICES)
    : (isConAir ? CONAIR_WATER_CHILLER_PRICES : PRASAD_WATER_CHILLER_PRICES);

  let displayImage = item.image;
  if (isChiller) {
    if (selectedBrand === "Prasad") {
      displayImage = isAirChiller ? "/images/Acessories/prasad_air_chiller.png" : "/images/Acessories/prasad_water_chiller.png";
    } else if (isConAir) {
      displayImage = isAirChiller ? "/images/Acessories/conair_air_chiller.png" : "/images/Acessories/conair_water_chiller.png";
    }
  }

  let prices = {};
  if (isCorona) prices = CORONA_PRICES;
  else if (isWebGuide) prices = WEB_GUIDE_PRICES;
  else if (isChiller) prices = chillerPrices;
  else if (isMixerDryer) prices = MIXER_DRYER_PRICES;
  else if (isMixer) prices = MIXER_PRICES;
  else if (isHeatExchanger) {
    if (item.name === "Heat Exchanger Uno") prices = HEAT_EXCHANGER_UNO_PRICES;
    else if (item.name === "Heat Exchanger Duo") prices = HEAT_EXCHANGER_DUO_PRICES;
    else prices = HEAT_EXCHANGER_PRICES;
  }
  else if (isBimetallic) {
    prices = SCREW_SIZES.reduce((acc, s) => ({ ...acc, [s]: item.price }), {});
  } else if (isDieRotation) {
    prices = DIE_ROTATION_PRICES;
  }
  else if (isEpC) {
    prices = EPC_PRICES;
  }
  else if (isBackToBack) prices = BACK_TO_BACK_PRICES;
  else if (isAirShaft) prices = AIR_SHAFT_PRICES;
  else if (isHopperLoaderUno) prices = HOPPER_LOADER_UNO_PRICES;
  else if (isHopperLoaderDuo) prices = HOPPER_LOADER_DUO_PRICES;
  else if (isHopperLoaderTrio) prices = HOPPER_LOADER_MULTI;
  else if (isHopperDryerB) prices = HOPPER_DRYER_B_PRICES;
  else if (isAdditionalLip) prices = ADDITIONAL_LIP_PRICES;
  // Generic fallback: use item.prices if supplied on the data object
  else if (item.prices && Object.keys(item.prices).length > 0) prices = item.prices;

  // UI customization based on component type
  const isOutputBased = isMixerDryer || isMixer || isHeatExchanger;
  const isCapacityBased = isChiller && Object.keys(prices).length > 0 && Object.keys(prices)[0].includes("TR");
  const selectorLabel = isChiller ? (isCapacityBased ? "Cooling Capacity" : "Machine Size") : (isOutputBased ? "Output" : (isBimetallic ? "Screw Size" : (isDieRotation ? "Die Size" : "Size")));
  
  const hideBrandDropdown = isDieRotation || isBimetallic || isBackToBack || isAirShaft || isAdditionalLip || isHopperLoaderUno || isHopperLoaderDuo || isHopperLoaderTrio || isHopperDryerB || isHeatExchangerUno || isHeatExchangerDuo || isOptionalFeature;
  const unit = isHeatExchanger || isMixerDryer || isMixer ? "kg" : (isOutputBased ? "kg/hr" : "mm");
  // For optional features the key is now a plain mm size — uses the standard formatter below
  const formatSize = (s) => (s && (s.includes("TR") || s.includes('"'))) ? s : `${s} ${unit}`;
  // EPC: price is keyed by brand — use selectedBrand as the effective size key
  const epcPrice = isEpC ? (EPC_PRICES[selectedBrand] || 0) : null;


  const [selectedSize, setSelectedSize] = useState(
    line?.size || line?.metadata?.size || item.metadata?.size || Object.keys(prices)[0] || ""
  );

  // The EFFECTIVE size shown in UI: always prefer the saved value when selected
  // This avoids the race condition where useEffects fire in the wrong order
  const effectiveSize = isSelected
    ? (line?.size || line?.metadata?.size || selectedSize)
    : selectedSize;

  // Reset size if brand changes and the current chiller size becomes invalid
  useEffect(() => {
    if (!isSelected && isChiller) {
      const validSizes = Object.keys(prices);
      if (!validSizes.includes(selectedSize)) {
        setSelectedSize(validSizes[0] || "");
      }
    }
  }, [selectedBrand, prices, isChiller, isSelected, selectedSize]);

  // Sync local state when the saved addon changes (e.g. after localStorage loads)
  useEffect(() => {
    if (isSelected && item.isDynamic && line) {
      const savedSize = line.size || line.metadata?.size;
      const savedBrand = line.brand || line.metadata?.brand;
      if (savedSize && savedSize !== selectedSize) setSelectedSize(savedSize);
      if (savedBrand && savedBrand !== selectedBrand) setSelectedBrand(savedBrand);
    }
  }, [isSelected, item.isDynamic, line?.size, line?.brand, line?.metadata]);

  // Reset brand/size for unselected non-chiller items only when item identity changes
  useEffect(() => {
    if (!isSelected && item.isDynamic && !isChiller) {
      setSelectedBrand(brands[0] || "Adroit");
      setSelectedSize(item.metadata?.size || Object.keys(prices)[0] || "");
    }
    // Only reset when item.id changes (user switches item), not when isSelected changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const currentPrice = item.isDynamic
    ? (isEpC ? (epcPrice || 0) : (prices[effectiveSize] || 0))
    : item.price || 0;


  const handleAdd = () => {
    if (item.isDynamic) {
      let customName = `${item.name} (${selectedBrand})`;

      if (isCorona) {
        // Example: Corona Treater Jain Electrotech make
        customName = `${item.name} ${selectedBrand} make`;
      } else if (isWebGuide) {
        if (selectedBrand === "Adroit") {
          // Example: Digital Edge Guide Adroit make
          customName = `Digital Edge Guide Adroit make`;
        } else {
          // Example: E+L Web Guide
          customName = `E+L Web Guide`;
        }
      } else if (isChiller) {
        // Example: Air Cooled Air Chiller Prasad make
        customName = `${item.name} ${selectedBrand} make`;
      } else if (isMixerDryer || isMixer) {
        // Include capacity in name: e.g. "300 kg Vertical Granule Mixer with Dryer (Adroit make)"
        customName = `${selectedSize} kg ${item.name} (${selectedBrand} make)`;
      } else if (isHeatExchanger) {
        // Example: Heat Exchanger Adroit make
        customName = `${item.name} ${selectedBrand} make`;
      } else if (isBimetallic) {
        // Example: Bi-metallic Screw Barrel Upgrade
        customName = `${item.name.split(' (')[0]}`;
      } else if (isDieRotation) {
        // Example: Die Rotation System
        customName = `Die Rotation System`;
      }
      else if (isEpC) {
        // EPC: brand-only, no size
        customName = `Extrusion Process Control With Trio Loader (${selectedBrand})`;
      } else if (isAdditionalLip) {
        customName = `Additional Lip Set with Inserts`;
      } else if (isOptionalFeature) {
        // Optional Features: name with mm size e.g. "PLC Control in Place of POTs (1350 mm)"
        customName = `${item.name} (${selectedSize} mm)`;
      }

      addAddon(category, item, {
        brand: (isDieRotation || isBimetallic || isOptionalFeature) ? undefined : selectedBrand,
        size: isEpC ? undefined : selectedSize,
        price: isEpC ? epcPrice : currentPrice,
        customName: customName,
        image: displayImage,
        techDesc: {
          ...item.techDesc,
          ...((isDieRotation || isBimetallic || isBackToBack || isAirShaft || isHopperLoaderUno || isHopperLoaderDuo || isHopperDryerB || isAdditionalLip || isOptionalFeature) ? {} : { "Brand": selectedBrand }),
          ...(isEpC ? {} : { [selectorLabel]: formatSize(selectedSize) }),
        }
      });
    } else {
      addAddon(category, item);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`rounded-xl border p-4 bg-white transition-all duration-200 flex flex-col shadow-sm hover:shadow-md ${isSelected
        ? "border-brand-blue ring-1 ring-brand-blue bg-blue-50/30"
        : "border-slate-200"
        }`}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 relative">
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt={item.name}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <span style={{ display: 'none' }} className="text-[10px] text-slate-400 font-medium text-center px-1">
                No image
              </span>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium text-center px-1">
              No image
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-slate-800 truncate" title={item.name}>
            {item.name}
          </div>
          {showPrices && (
            <div className="text-xs font-bold text-emerald-600 mt-1">
              ₹{currentPrice.toLocaleString("en-IN")}
            </div>
          )}
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.cardDesc || item.shortDesc || item.desc || ""}
          </div>
        </div>
      </div>

      {/* Dynamic Selectors */}
      {item.isDynamic && (
        <div className="mt-4 grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
          {!hideBrandDropdown && (
            <div className={`flex flex-col gap-1 ${isEpC ? "col-span-2" : ""}`}>
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Brand</span>
              <select
                disabled={isSelected}
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:ring-1 focus:ring-brand-blue outline-none disabled:opacity-60"
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}
          {!isEpC && (
            <div className={`flex flex-col gap-1 ${hideBrandDropdown ? "col-span-2" : ""}`}>
              <span className="text-[10px] font-bold text-slate-500 uppercase px-1">{selectorLabel}</span>
              <select
                disabled={isSelected}
                value={effectiveSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:ring-1 focus:ring-brand-blue outline-none disabled:opacity-60"
              >
                {Object.keys(prices).map(s => <option key={s} value={s}>{formatSize(s)}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-slate-100 min-h-[50px]">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              openModal({
                category,
                item,
              })
            }
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Specs
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isSelected && !item.isDynamic && (
            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  setAddonQty(
                    item.id,
                    Math.max(1, (qty || 1) - 1)
                  )
                }
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                −
              </button>
              <div className="text-xs w-6 text-center font-medium text-slate-800 border-x border-slate-200 h-7 flex items-center justify-center">
                {qty}
              </div>
              <button
                type="button"
                onClick={() =>
                  setAddonQty(item.id, (qty || 1) + 1)
                }
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() =>
              isSelected
                ? removeAddon(item.id)
                : handleAdd()
            }
            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-colors ${isSelected
              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
              : "bg-brand-blue text-white hover:bg-brand-dark"
              }`}
          >
            {isSelected ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
