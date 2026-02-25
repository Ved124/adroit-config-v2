"use client";

import { useRouter } from "next/router";
import { useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ConfigContext } from "../src/ConfigContext";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-brand-light text-slate-900 pt-28">
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
                  {items.map((item) => {
                    const line = getSelectedAddon(item.id);
                    const isSelected = !!line;
                    const qty = line?.qty || 0;

                    return (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        key={item.id}
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
                                ₹{(item.price || 0).toLocaleString("en-IN")}
                              </div>
                            )}
                            <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {item.shortDesc || item.desc || ""}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
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
                              Details
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected && (
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
                                  : addAddon(category, item)
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
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <div className="mt-10 flex justify-between gap-4 border-t border-slate-200 pt-6">
          <button
            onClick={() => router.push("/selection")}
            className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 text-sm font-medium transition-all shadow-sm"
          >
            ← Back to Selection
          </button>
          <button
            onClick={() => router.push("/summary")}
            className="px-8 py-3 rounded-xl bg-brand-blue text-white hover:bg-brand-dark text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Go to Summary →
          </button>
        </div>
      </motion.main>
    </div>
  );
}
