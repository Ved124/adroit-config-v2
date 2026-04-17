import { useContext, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ConfigContext } from "../src/ConfigContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { G_AIR_RING_PRICES, AIR_RING_PRICES, DR_AIR_RING_PRICES } from "../src/data/airRing";
import { MANUAL_BC_PRICES, OPEN_CLOSE_BC_PRICES, UP_DOWN_BC_PRICES } from "../src/data/bubbleCages";
import { HAULOFF_PRICES } from "../src/data/hauloffs";
import { TOWER_PRICES } from "../src/data/tower";
import { MANUAL_BACK_TO_BACK_PRICES, SURFACE_WINDER_PRICES, AUTOMATIC_WINDER_PRICES } from "../src/data/winders";
import { PANEL_3LAYER_PRICES } from "../src/data/electricalPanel";


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
                  {items.map((item) => (
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
                    />
                  ))}
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
}) {
  const isSelected = !!line;
  const qty = line?.qty || 0;

  // Air Ring Size Mappings
  const isGAirRing = item.id === "airring-g-dynamic";
  const isStandardAirRing = item.id === "airring-standard-dynamic";
  const isDRAirRing = item.id === "airring-dr-dynamic";
  const isManualBC = item.id === "bc-manual-dynamic";
  const isOCBC = item.id === "bc-open-close-dynamic";
  const isUDBC = item.id === "bc-up-down-dynamic";
  const isDynamicHauloff = item.id === "haul-horizontal-dynamic";
  const isDynamicTower = item.id === "tower-dynamic";
  const isManualWinder = item.id === "winder-manual-back-to-back-dynamic";
  const isSurfaceWinder = item.id === "winder-surface-dynamic";
  const isAutoWinder = item.id === "winder-automatic-dynamic";
  const is3LayerPanel = item.id === "panel-3layer-dynamic";

  let prices = {};
  if (isGAirRing) prices = G_AIR_RING_PRICES;
  else if (isStandardAirRing) prices = AIR_RING_PRICES;
  else if (isDRAirRing) prices = DR_AIR_RING_PRICES;
  else if (isManualBC) prices = MANUAL_BC_PRICES;
  else if (isOCBC) prices = OPEN_CLOSE_BC_PRICES;
  else if (isUDBC) prices = UP_DOWN_BC_PRICES;
  else if (isDynamicHauloff) prices = HAULOFF_PRICES;
  else if (isDynamicTower) prices = TOWER_PRICES;
  else if (isManualWinder) prices = MANUAL_BACK_TO_BACK_PRICES;
  else if (isSurfaceWinder) prices = SURFACE_WINDER_PRICES;
  else if (isAutoWinder) prices = AUTOMATIC_WINDER_PRICES;
  else if (is3LayerPanel) prices = PANEL_3LAYER_PRICES;

  const sizes = Object.keys(prices);

  // Local state for dynamic size
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");

  // Sync if already selected
  useEffect(() => {
    const activeSize = line?.size || line?.metadata?.size;
    if (isSelected && item.isDynamic && activeSize) {
      setSelectedSize(activeSize);
    }
  }, [isSelected, item.isDynamic, line?.size, line?.metadata?.size]);

  const currentPrice = item.isDynamic ? (prices[selectedSize] || 0) : (item.price || 0);

  const handleAdd = () => {
    if (item.isDynamic) {
      const customName = `${item.name} - ${selectedSize} mm`;
      addComponent(category, item, {
        size: selectedSize,
        price: currentPrice,
        customName: customName,
        techDesc: {
          ...item.techDesc,
          [isGAirRing || isStandardAirRing || isDRAirRing ? "Die Size" : (isDynamicHauloff ? "Hauloff Size" : (isDynamicTower ? "Tower Size" : (item.category === "Winder" ? "Winder Size" : (is3LayerPanel ? "Panel Size" : "Cage Size"))))]: `${selectedSize} mm`,
          ...(item.category === "Winder" ? { 
            "film width": `${selectedSize} mm`,
            "Winder Size": `${selectedSize} mm`,
            "Nip roller width": `${parseInt(selectedSize) + 125} mm`,
            [isAutoWinder ? "Surface Winders (02 Nos.)" : "Surface Winders (01 No.)"]: `Maximum web width of ${selectedSize} mm with ${isAutoWinder ? "Automatic" : "Manual"} Changeover.`
          } : {}),
          ...(isDynamicHauloff ? { "Nip roller width": `${parseInt(selectedSize) + 125} mm` } : {}),
          ...(isDynamicTower ? { "Idler rollers": `Set of 150 mm diameter idler aluminium rollers of ${parseInt(selectedSize) + 200} mm face width.` } : {})
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
        <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-[10px] text-slate-400 font-bold uppercase">No Image</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-slate-900 leading-tight">
            {isSelected && item.isDynamic ? line.customName : item.name}
          </div>
          {showPrices && (
            <div className="text-[11px] font-bold text-emerald-600 mt-1">
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
            {isGAirRing || isStandardAirRing || isDRAirRing ? "Die Size" : (isDynamicHauloff ? "Hauloff Size" : (isDynamicTower ? "Tower Size" : (item.category === "Winder" ? "Winder Size" : (is3LayerPanel ? "Panel Model/Size" : "Cage Size"))))}
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

      {/* Key Specs Preview (Non-dynamic or if selected) */}
      {!item.isDynamic && item.techDesc && (
        <div className="mt-4 pt-4 border-t border-slate-50 space-y-1.5">
          {["Screw Diameter", "L/D ratio", "Main Drive", "Output"].map((key) => {
            const val = item.techDesc[key] ||
              Object.entries(item.techDesc).find(([k]) => k.toLowerCase() === key.toLowerCase())?.[1];

            if (!val) return null;
            const shortVal = val.length > 25 ? val.substring(0, 25) + "..." : val;

            return (
              <div key={key} className="flex justify-between text-[10px] items-center">
                <span className="text-slate-400 font-bold uppercase tracking-tighter">{key}</span>
                <span className="text-slate-700 font-mono font-bold" title={val}>{shortVal}</span>
              </div>
            );
          })}
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
              onClick={() => openModal({ category, item })}
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
