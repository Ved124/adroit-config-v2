"use client";

import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ConfigContext } from "../src/ConfigContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SelectionPage() {
  const router = useRouter();
  const {
    // data from context
    filteredComponents,   // ✅ already filtered by machineType / model / customMode
    customer,
    machineType,
    customMode,
    selectedMachineModelLabel,

    // selection state
    selected,
    addComponent,
    removeComponent,
    setQty,
    openModal,
    applyModelPreset,
    resetToModelPreset,
  } = useContext(ConfigContext);

  const handleResetToPreset = () => {
    if (!selectedMachineModelLabel) return;
    applyModelPreset(selectedMachineModelLabel);
  };



  // local show/hide price toggle (eye button)
  const [showPrices, setShowPrices] = useState(false);

  const getSelectedLineItem = (id) =>
    selected?.find((x) => x.id === id) || null;

  return (
    <div className="min-h-screen bg-brand-light pt-24 sm:pt-28">
      {/* Navbar is global */}

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Top info + eye button */}
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-5">
          <div className="text-sm text-slate-700">
            <div className="font-semibold text-brand-blue">
              {customer?.company || customer?.name || "Customer"} {"-"} {customer?.city || ""}
            </div>
            <div className="text-xs text-slate-500">
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
              className="flex items-center gap-1 px-3 py-1 rounded-full  hover:bg-slate-100 text-slate-300"
            >
              <span>{showPrices ? <FaEyeSlash /> : <FaEye />}</span>
            </button>
            {selectedMachineModelLabel && !customMode && (
              <button
                type="button"
                onClick={() => {
                  if (selectedMachineModelLabel) {
                    applyModelPreset(selectedMachineModelLabel);
                  }
                }}
                className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 text-[11px]"
              >
                Reset to model preset
              </button>
            )}
          </div>
        </div>

        {/* Components by category */}
        {Object.keys(filteredComponents).length === 0 ? (
          <div className="text-sm text-slate-500">
            No components match this machine type / model.
            (Ensure <code>machineTypes</code> and <code>usedInModels</code> are set in COMPONENTS_DATA.)
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredComponents).map(
              ([category, items]) => (
                <section key={category}>
                  <h2 className="text-sm font-semibold mb-3 text-brand-blue">
                    {category}
                  </h2>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => {
                      const line = getSelectedLineItem(item.id);
                      const isSelected = !!line;
                      const qty = line?.qty || 0;

                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-3 bg-white hover:shadow-md transition flex flex-col ${isSelected
                            ? "border-brand-blue shadow-sm"
                            : "border-slate-200"
                            }`}
                        >
                          <div className="flex gap-3">
                            <div className="w-20 h-20 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span className="text-xs text-slate-500">
                                  No image
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold truncate text-slate-900">
                                {item.name}
                              </div>
                              {showPrices && (
                                <div className="text-xs text-emerald-600 mt-1">
                                  ₹{(item.price || 0).toLocaleString("en-IN")}
                                </div>
                              )}
                              <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                {item.shortDesc || item.desc || ""}
                              </div>

                              {/* Key Specs Preview */}
                              {item.techDesc && (
                                <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                                  {["Screw Diameter", "L/D ratio", "Main Drive", "Output"].map((key) => {
                                    // Handle case-insensitive matching or exact matching
                                    const val = item.techDesc[key] ||
                                      Object.entries(item.techDesc).find(([k]) => k.toLowerCase() === key.toLowerCase())?.[1];

                                    if (!val) return null;

                                    // Truncate long values for the card
                                    const shortVal = val.length > 25 ? val.substring(0, 25) + "..." : val;

                                    return (
                                      <div key={key} className="flex justify-between text-[10px]">
                                        <span className="text-slate-500 font-medium">{key}:</span>
                                        <span className="text-slate-700 font-mono" title={val}>{shortVal}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openModal({
                                    category,
                                    item,
                                  })
                                }
                                className="px-2 py-1 rounded-lg text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800"
                              >
                                Details
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setQty(
                                        item.id,
                                        Math.max(1, (qty || 1) - 1)
                                      )
                                    }
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center text-xs"
                                  >
                                    −
                                  </button>
                                  <div className="text-xs w-6 text-center">
                                    {qty}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setQty(item.id, (qty || 1) + 1)
                                    }
                                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center text-xs"
                                  >
                                    +
                                  </button>
                                </>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  isSelected
                                    ? removeComponent(item.id)
                                    : addComponent(category, item)
                                }
                                className={`px-3 py-1 rounded-lg text-white text-[11px] ${isSelected
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-blue-600 hover:bg-blue-500"
                                  }`}
                              >
                                {isSelected ? "Remove" : "Add"}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            )}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-3">
          <button
            onClick={() => router.push("/machinetype")}
            className="flex-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 text-sm font-medium"
          >
            ← Back to Machine Type
          </button>
          <button
            onClick={() => router.push("/addons")}
            className="flex-1 rounded-xl bg-brand-blue hover:bg-brand-dark text-white py-3 text-sm font-medium"
          >
            Go to Optional Add-ons →
          </button>
        </div>
      </main>
    </div>
  );
}
