"use client";

import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaChevronDown } from "react-icons/fa";
import { ConfigContext } from "../src/ConfigContext";
import { motion } from "framer-motion";
import { CORONA_PRICES, CORONA_BRANDS } from "../src/data/corona";
import { WEB_GUIDE_PRICES, WEB_GUIDE_BRANDS } from "../src/data/webGuide";
import { CHILLER_PRICES, CHILLER_BRANDS } from "../src/data/chiller";
import { HEAT_EXCHANGER_PRICES, HEAT_EXCHANGER_BRANDS } from "../src/data/heatExchanger";
import { MIXER_DRYER_PRICES, MIXER_DRYER_BRANDS } from "../src/data/materialHandling";

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
  const isChiller = item.id.includes("chiller") && item.isDynamic;
  const isMixerDryer = item.id === "mixer-dryer-dynamic";
  const isHeatExchanger = item.id === "heat-exchanger-dynamic";

  const brands = isCorona ? CORONA_BRANDS : (isWebGuide ? WEB_GUIDE_BRANDS : (isChiller ? CHILLER_BRANDS : (isMixerDryer ? MIXER_DRYER_BRANDS : (isHeatExchanger ? HEAT_EXCHANGER_BRANDS : []))));
  const prices = isCorona ? CORONA_PRICES : (isWebGuide ? WEB_GUIDE_PRICES : (isChiller ? CHILLER_PRICES : (isMixerDryer ? MIXER_DRYER_PRICES : (isHeatExchanger ? HEAT_EXCHANGER_PRICES : {}))));

  // UI customization based on component type
  const isOutputBased = isChiller || isMixerDryer || isHeatExchanger;
  const selectorLabel = isOutputBased ? "Output" : "Max Roller";
  const unit = isHeatExchanger ? "kg" : (isOutputBased ? "kg/hr" : "mm");

  // Local state for dynamic config
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || "");
  const [selectedSize, setSelectedSize] = useState(Object.keys(prices)[0] || "");

  // Sync if already selected
  useEffect(() => {
    if (isSelected && item.isDynamic && line.metadata) {
      if (line.metadata.brand) setSelectedBrand(line.metadata.brand);
      if (line.metadata.size) setSelectedSize(line.metadata.size);
    }
  }, [isSelected, item.isDynamic, line?.metadata]);

  // Handle case where brands might change if multiple dynamic items exist
  useEffect(() => {
    if (!isSelected && item.isDynamic) {
      setSelectedBrand(brands[0] || "");
      setSelectedSize(Object.keys(prices)[0] || "");
    }
  }, [item.id, item.isDynamic, isSelected]);

  const currentPrice = item.isDynamic
    ? prices[selectedSize] || 0
    : item.price || 0;

  const handleAdd = () => {
    if (item.isDynamic) {
      let customName = `${item.name} (${selectedBrand}) - ${selectedSize}mm`;

      if (isCorona) {
        // Example: Corona Treater Jain Electrotech make - 1350mm
        customName = `${item.name} ${selectedBrand} make - ${selectedSize}mm`;
      } else if (isWebGuide) {
        if (selectedBrand === "Adroit") {
          // Example: Digital Edge Guide Adroit make - 1350mm
          customName = `Digital Edge Guide Adroit make - ${selectedSize}mm`;
        } else {
          // Example: E+L Web Guide - 1350mm
          customName = `E+L Web Guide - ${selectedSize}mm`;
        }
      } else if (isChiller) {
        // Example: Air Cooled Air Chiller Prasad make - 300 kg/hr
        customName = `${item.name} ${selectedBrand} make - ${selectedSize} kg/hr`;
      } else if (isMixerDryer) {
        // Example: Vertical Granule Mixer with Dryer Adroit make - 300 kg/hr
        customName = `${item.name} ${selectedBrand} make - ${selectedSize} kg/hr`;
      } else if (isHeatExchanger) {
        // Example: Heat Exchanger Adroit make - 150 kg
        customName = `${item.name} ${selectedBrand} make - ${selectedSize} kg`;
      }

      addAddon(category, item, {
        brand: selectedBrand,
        size: selectedSize,
        price: currentPrice,
        customName: customName,
        techDesc: {
          ...item.techDesc,
          "Brand": selectedBrand,
          [selectorLabel]: `${selectedSize} ${unit}`,
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
        <div className="w-20 h-20 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">
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
          <div className="flex flex-col gap-1">
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
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase px-1">{selectorLabel}</span>
            <select
              disabled={isSelected}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:ring-1 focus:ring-brand-blue outline-none disabled:opacity-60"
            >
              {Object.keys(prices).map(s => <option key={s} value={s}>{s} {unit}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-slate-100 min-h-[50px]">
        <div className="flex gap-2">
          {/* {!item.isDynamic && (
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
              Details
            </button>
          )} */}
          {item.isDynamic && isSelected && (
            <button
              type="button"
              onClick={() => removeAddon(item.id)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Change
            </button>
          )}
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
