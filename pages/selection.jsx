import { useContext, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ConfigContext } from "../src/ConfigContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ALL_MODELS } from "../src/data/catalogRegistry";
import { MONO_ABA_MAIN_NIP_PRICES } from "../src/data/mainNip";
import { MONO_ABA_TOWER_PRICES } from "../src/data/tower";
import { MONO_ABA_MANUAL_BC_PRICES } from "../src/data/bubbleCages";
import { MONO_PANEL_PRICES, ABA_PANEL_PRICES } from "../src/data/electricalPanel";
import { MONO_AIR_RING_PRICES, ABA_AIR_RING_PRICES } from "../src/data/airRing";
export default function SelectionPage() {
  const router = useRouter();
  const {
    filteredComponents,
    customer,
    machineType,
    customMode,
    selectedMachineModelLabel,
    selected,
    addComponent,
    removeComponent,
    setQty,
    openModal,
    applyModelPreset,
  } = useContext(ConfigContext);

  const modelSizeMm = useMemo(() => {
    if (selectedMachineModelLabel) {
      if (selectedMachineModelLabel.startsWith("UNOFLEX-")) {
        return "U" + selectedMachineModelLabel.split("-")[1].split(" ")[0];
      }
      if (selectedMachineModelLabel.startsWith("DUOFLEX-")) {
        return "D" + selectedMachineModelLabel.split("-")[1].split(" ")[0];
      }
      if (selectedMachineModelLabel.startsWith("INNOFLEX-")) {
         const model = ALL_MODELS.find(m => m.code === selectedMachineModelLabel || m.label === selectedMachineModelLabel);
         if (model && model.layflatWidthMm) return String(model.layflatWidthMm);
      }
    }
    return null;
  }, [selectedMachineModelLabel]);

  const [showPrices, setShowPrices] = useState(false);

  const getSelectedLineItem = (id) =>
    selected?.find((x) => x.id === id) || null;

  return (
    <div className="min-h-screen bg-brand-light pt-24 sm:pt-28">
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Top info */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-5">
          <div className="text-sm text-slate-700">
            <div className="font-semibold text-brand-blue uppercase tracking-tight">
              {customer?.company || customer?.name || "Customer"} {"-"} {customer?.city || ""}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {customer?.machineModel ||
                customer?.machineFamily ||
                machineType ||
                (customMode ? "Custom Mode" : "Machine not selected")}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-700">
            <button
              type="button"
              onClick={() => setShowPrices((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-1 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
            >
              <span>{showPrices ? <FaEyeSlash /> : <FaEye />}</span>
            </button>
            {selectedMachineModelLabel && !customMode && (
              <button
                type="button"
                onClick={() => applyModelPreset(selectedMachineModelLabel)}
                className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 text-[11px] font-medium transition-colors"
              >
                Reset to model preset
              </button>
            )}
          </div>
        </div>

        {/* Components by category */}
        {Object.keys(filteredComponents).length === 0 ? (
          <div className="text-sm text-slate-500 italic p-10 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            No components match this machine type / model.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredComponents).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-xs font-bold mb-4 text-brand-blue uppercase tracking-widest px-1">
                  {category}
                </h2>

                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {(() => {
                    let renderItems = items;
                    if (category === "Extruder") {
                      renderItems = [];
                      const count = machineType === "aba" ? 2 : machineType === "3layer" ? 3 : machineType === "5layer" ? 5 : 1;
                      const labels = ["A", "B", "C", "D", "E"];
                      items.forEach(baseItem => {
                        if (baseItem.isDynamic) {
                          for (let i = 0; i < count; i++) {
                            renderItems.push({
                              ...baseItem,
                              id: `${baseItem.id}-${labels[i]}`,
                              name: count > 1 ? `${baseItem.name} ${labels[i]}` : baseItem.name,
                            });
                          }
                        } else {
                          renderItems.push(baseItem);
                        }
                      });
                    }
                    return renderItems.map((item) => (
                      <ComponentCard
                        key={item.id}
                      item={item}
                      category={category}
                      line={getSelectedLineItem(item.id)}
                      showPrices={showPrices}
                      addComponent={addComponent}
                      removeComponent={removeComponent}
                      setQty={setQty}
                      openModal={openModal}
                      customMode={customMode}
                      selectedMachineModelLabel={selectedMachineModelLabel}
                      modelSizeMm={modelSizeMm}
                      machineType={machineType}
                    />
                    ));
                  })()}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-slate-200">
          <button
            onClick={() => router.push("/machinetype")}
            className="flex-1 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 py-4 text-sm font-bold transition-all"
          >
            ← Back to Machine Type
          </button>
          <button
            onClick={() => router.push("/addons")}
            className="flex-1 rounded-2xl bg-brand-blue hover:bg-brand-dark text-white py-4 text-sm font-bold transition-all shadow-lg hover:shadow-brand-blue/25"
          >
            Go to Optional Add-ons →
          </button>
        </div>
      </main>
    </div>
  );
}

function ComponentCard({
  item,
  category,
  line,
  showPrices,
  addComponent,
  removeComponent,
  setQty,
  openModal,
  customMode,
  selectedMachineModelLabel,
  modelSizeMm,
  machineType,
}) {
  const isSelected = !!line;
  const qty = line?.qty || 0;

  // Air Ring Size Mappings
  const isGAirRing = item.id === "airring-g-dynamic";
  const isStandardAirRing = item.id === "airring-standard-dynamic";
  const isDRAirRing = item.id === "airring-dr-dynamic" || item.id === "airring-dr-dynamic-aba";
  const isManualBC = item.id === "bc-manual-dynamic";
  const isOCBC = item.id === "bc-open-close-dynamic";
  const isUDBC = item.id === "bc-up-down-dynamic";
  const isDynamicHauloff = item.id === "haul-horizontal-dynamic";
  const isDynamicMainNip = item.id === "main-nip-dynamic" || item.id === "main-nip-dynamic-multi" || item.id === "main-nip-cf-dynamic";
  const isDynamicTower = item.id === "tower-dynamic";
  const isManualWinder = item.id === "winder-manual-back-to-back-dynamic";
  const isSurfaceWinder = item.id === "winder-surface-dynamic";
  const isSingleSurfaceWinder = item.id === "winder-single-surface-only-dynamic";
  const isAutoWinder = item.id === "winder-automatic-dynamic";
  const is3LayerPanel = item.id === "panel-3layer-dynamic";
  const isCollapsingFrame = item.id === "cf-pbt-dynamic";

  const isMonoAbaCard = machineType === "mono" || machineType === "aba";
  // Main Nip/Tower/Manual Bubble Cage/Panel/Air Ring are shared library entries also
  // used by 3-layer/5-layer models — swap in the mono/ABA-specific table here so a
  // custom mono/ABA build gets the right price without touching those shared entries.
  const monoAbaOverridePrices = !isMonoAbaCard ? null
    : item.id === "main-nip-cf-dynamic" ? MONO_ABA_MAIN_NIP_PRICES
    : item.id === "tower-dynamic" ? MONO_ABA_TOWER_PRICES
    : item.id === "bc-manual-dynamic" || item.id === "bc-manual-dynamic-aba" ? MONO_ABA_MANUAL_BC_PRICES
    : item.id === "panel-dynamic" ? (machineType === "mono" ? MONO_PANEL_PRICES : ABA_PANEL_PRICES)
    : (item.id === "airring-g-dynamic" || item.id === "airring-standard-dynamic" || item.id === "airring-dr-dynamic-aba")
      ? (machineType === "mono" ? MONO_AIR_RING_PRICES : ABA_AIR_RING_PRICES)
    : null;

  const prices = item.pricingType === 'size' || item.pricingType === 'brand' || item.pricingType === 'dropdown'
    ? (monoAbaOverridePrices || item.prices || {})
    : {};

  const nearestToModelSize = (priceMap, modelSizeMm) => {
    if (!modelSizeMm) return null;
    const keys = Object.keys(priceMap);
    if (keys.length === 0) return null;

    const exactMatch = keys.find(k => k === modelSizeMm || k === `${modelSizeMm}"` || k === `${modelSizeMm} mm`);
    if (exactMatch) return exactMatch;

    const targetPrefix = modelSizeMm.match(/^[UD]/)?.[0] || null;
    const targetStr = modelSizeMm.replace(/[^UD0-9]/g, '');
    const strMatch = keys.find(k => k.replace(/[^UD0-9]/g, '') === targetStr && (k.match(/^[UD]/)?.[0] || null) === targetPrefix);
    if (strMatch) return strMatch;

    const target = parseInt(modelSizeMm.replace(/[^\d]/g, ''), 10);
    if (isNaN(target)) return null;

    // When the target has a U/D prefix (mono/ABA), only match keys with the SAME
    // prefix — otherwise a missing ABA (D) size could silently fall back to a mono
    // (U) price (or vice versa) just because the numbers happen to be close.
    const sizes = keys
      .map(k => ({ key: k, num: parseInt(k.replace(/[^\d]/g, ''), 10), prefix: k.match(/^[UD]/)?.[0] || null }))
      .filter(x => !isNaN(x.num) && (!targetPrefix || x.prefix === targetPrefix))
      .sort((a, b) => a.num - b.num);

    if (sizes.length === 0) return null;
    const chosen = sizes.find((s) => s.num >= target) ?? sizes[sizes.length - 1];
    return chosen.key;
  };

  const sizes = Object.keys(prices);
  const defaultSize = item.isDynamic && modelSizeMm ? (nearestToModelSize(prices, modelSizeMm) || sizes[0] || "") : (sizes[0] || "");

  // Local state for dynamic size
  const [selectedSize, setSelectedSize] = useState(defaultSize);

  // Sync if already selected
  useEffect(() => {
    const activeSize = line?.size || line?.metadata?.size;
    if (isSelected && item.isDynamic && activeSize) {
      setSelectedSize(activeSize);
    }
  }, [isSelected, item.isDynamic, line?.size, line?.metadata?.size]);

  const currentPrice = item.isDynamic ? (prices[selectedSize] || 0) : (item.price || 0);

  const handleAdd = (sizeOverride) => {
    const useSize = sizeOverride || selectedSize;
    if (item.isDynamic) {
      const customName = item.sizeDetails?.[useSize]?.name || `${item.name} - ${useSize} mm`;
      const baseTechDesc = item.sizeDetails?.[useSize]?.techDesc || item.techDesc;
      addComponent(category, item, {
        size: useSize,
        price: item.isDynamic ? (prices[useSize] || 0) : currentPrice,
        customName: customName,
        techDesc: {
          ...baseTechDesc,
          [isGAirRing || isStandardAirRing || isDRAirRing ? "Die Size" : (isDynamicHauloff ? "Hauloff Size" : (isDynamicMainNip ? "Main Nip Size" : (isDynamicTower ? "Tower Size" : (item.category === "Winder" ? "Winder Size" : (is3LayerPanel ? "Panel Size" : (isCollapsingFrame ? "Machine Size" : "Cage Size"))))))]: `${useSize} mm`,
          ...(item.category === "Winder" ? {
            "film width": `${useSize} mm`,
            "Winder Size": `${useSize} mm`,
            "Nip roller width": `${parseInt(useSize) + 125} mm`,
            [isAutoWinder ? "Surface Winders (02 Nos.)" : "Surface Winders (01 No.)"]: `Maximum web width of ${useSize} mm with ${isAutoWinder ? "Automatic" : "Manual"} Changeover.`
          } : {}),
          ...(isDynamicHauloff || isDynamicMainNip ? { "Nip roller width": `${parseInt(useSize) + 125} mm` } : {}),
          ...(isDynamicTower ? { "Idler rollers": `Set of 150 mm diameter idler aluminium rollers of ${parseInt(useSize) + 200} mm face width.` } : {})
        }
      });
    } else {
      addComponent(category, item);
    }
  };

  return (
    <div
      className={`rounded-3xl border p-4 bg-white transition-all duration-300 flex flex-col hover:border-brand-blue/30 hover:shadow-xl hover:shadow-slate-200/50 ${isSelected ? "border-brand-blue shadow-lg ring-1 ring-brand-blue/10 bg-blue-50/10" : "border-slate-200"
        }`}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0 relative">
          {item.image ? (
            <>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'block';
                  }
                }}
              />
              <span style={{ display: 'none' }} className="text-[10px] text-slate-400 font-bold uppercase text-center px-1">No Image</span>
            </>
          ) : (
            <span className="text-[10px] text-slate-400 font-bold uppercase text-center px-1">No Image</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-[13px] font-bold text-slate-900 leading-tight truncate" title={isSelected && item.isDynamic ? line.customName : item.name}>
              {isSelected && item.isDynamic ? line.customName : item.name}
            </div>
            {item.isRecommended && !customMode && selectedMachineModelLabel && (
              <span className="shrink-0 bg-blue-100 text-brand-blue text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                Standard
              </span>
            )}
          </div>
          {showPrices && (
            <div className="text-[11px] font-bold text-emerald-600 mt-0.5">
              ₹{currentPrice.toLocaleString("en-IN")}
            </div>
          )}
          <div className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed h-7">
            {item.shortDesc || item.cardDesc || ""}
          </div>
        </div>
      </div>

      {/* Dynamic Size Dropdown */}
      {item.isDynamic && (
        <div className="mt-4 p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">
            {isGAirRing || isStandardAirRing || isDRAirRing ? "Die Size" : (isDynamicHauloff ? "Hauloff Size" : (isDynamicMainNip ? "Main Nip Size" : (isDynamicTower ? "Tower Size" : (item.category === "Winder" ? "Winder Size" : (is3LayerPanel ? "Panel Model/Size" : (isCollapsingFrame ? "Machine Size" : "Cage Size"))))))}
          </label>
          <select
            disabled={isSelected}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none disabled:bg-slate-100 disabled:text-slate-500 transition-all font-medium"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}{is3LayerPanel ? "" : " mm"}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {item.isDynamic && isSelected ? (
            <button
              type="button"
              onClick={() => removeComponent(item.id)}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              Change
            </button>
          ) : (
            <button
              type="button"
                onClick={() => openModal({ category, item: isSelected ? { ...item, ...line, techDesc: { ...item.techDesc, ...(line?.techDesc || {}) } } : { ...item, techDesc: item.sizeDetails?.[selectedSize]?.techDesc || item.techDesc, name: item.sizeDetails?.[selectedSize]?.name || item.name } })}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              Specs
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSelected && !item.isDynamic && (
            <div className="flex items-center bg-slate-100 rounded-xl px-1">
              <button
                type="button"
                onClick={() => setQty(item.id, Math.max(1, (qty || 1) - 1))}
                className="w-7 h-7 text-slate-600 hover:text-brand-blue text-xs font-black transition-colors"
              >
                −
              </button>
              <div className="text-xs w-5 text-center font-bold text-slate-800">
                {qty}
              </div>
              <button
                type="button"
                onClick={() => setQty(item.id, (qty || 1) + 1)}
                className="w-7 h-7 text-slate-600 hover:text-brand-blue text-xs font-black transition-colors"
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => isSelected ? removeComponent(item.id) : handleAdd()}
            className={`px-5 py-2 rounded-xl text-white text-[11px] font-black tracking-tight transition-all shadow-sm ${isSelected
              ? "bg-red-500 hover:bg-red-600 shadow-red-200"
              : "bg-brand-blue hover:bg-brand-dark shadow-blue-200"
              }`}
          >
            {isSelected ? "REMOVE" : "ADD TO LINE"}
          </button>
        </div>
      </div>
    </div>
  );
}
