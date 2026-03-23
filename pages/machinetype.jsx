"use client";

import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { ConfigContext } from "../src/ConfigContext";
import { motion } from "framer-motion";

function getModelLabel(model, index) {
  if (!model) return `Model ${index + 1}`;
  if (model.code) return model.code;
  if (model.EQUIPMENT) return model.EQUIPMENT;
  if (model.model) return model.model;
  if (model.name) return model.name;
  return `Model ${index + 1}`;
}

function getModelHighlights(model) {
  if (!model || typeof model !== "object") return [];

  const candidates = [
    "Layflat Width (mm)",
    "WIDTH",
    "Width",
    "width",
    "Width (mm)",
    "Thichness Range (micron)",
    "THICKNESS",
    "Thickness",
    "thickness",
    "OUTPUT",
    "Output",
    "Max. Output (kg/hr)",
  ];

  const lines = [];

  for (const key of candidates) {
    if (model[key] != null) {
      lines.push(`${key}: ${model[key]}`);
    }
    if (lines.length >= 3) break;
  }

  if (lines.length === 0) {
    Object.entries(model)
      .slice(0, 3)
      .forEach(([k, v]) => {
        if (typeof v === "string" || typeof v === "number") {
          lines.push(`${k}: ${v}`);
        }
      });
  }

  return lines;
}

export default function MachineTypePage() {
  const router = useRouter();
  const {
    customer,
    setCustomer,
    machineType,
    setMachineType,
    machineModels,
    machineModelIndex,
    setMachineModelIndex,
    customMode,
    setCustomMode,
    selectedMachineModelLabel,
    setSelectedMachineModelLabel,
    applyModelPreset,
  } = useContext(ConfigContext);

  const [modalModel, setModalModel] = useState(null);

  const families = [
    { key: "mono", label: "Unoflex Monolayer" },
    { key: "aba", label: "Duoflex ABA / AB" },
    { key: "3layer", label: "Innoflex 3 Layer" },
    { key: "5layer", label: "Innoflex 5 Layer (coming soon)", disabled: true },
  ];

  const activeFamily = machineType || "mono";

  const handleQuotationRefChange = (e) => {
    const value = e.target.value;
    setCustomer((prev) => ({
      ...prev,
      quotationRef: value,
      ref: value, // keep both for exports
    }));
  };


  const handleFamilyClick = (key) => {
    if (key === "5layer") return;
    setMachineType(key);
    setMachineModelIndex(null);
    setSelectedMachineModelLabel("");
    setCustomMode(false);
  };

  // When user chooses a ready model -> auto fill components & go to ADD-ONS
  const handleSelectModel = (model, index) => {
    const label = getModelLabel(model, index);
    const familyKey = machineType || "mono";

    setMachineModelIndex(index);
    setSelectedMachineModelLabel(label);
    setCustomMode(false);

    setCustomer({
      ...customer,
      machineFamily: familyKey,
      machineModel: label,
      customMachine: false,
    });

    // IMPORTANT: use label (or whatever key you use in MODEL_PRESETS)
    const ok = applyModelPreset(label);

    // Always go to Add-ons so user can tweak options
    if (ok) {
      router.push("/addons");
    } else {
      // fallback: if no preset exists for that model
      router.push("/selection");
    }
  };





  // Customise yourself: go to Selection with family only
  const handleCustomiseYourself = () => {
    setMachineModelIndex(null);
    setCustomMode(true);
    setSelectedMachineModelLabel("");

    setCustomer({
      ...customer,
      machineFamily: activeFamily,
      machineModel: `Custom ${activeFamily.toUpperCase()} configuration`,
      customMachine: true,
    });

    router.push("/selection");
  };

  return (
    <div className="min-h-screen bg-brand-light text-slate-900 pt-28">
      {/* Navbar is global */}

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 py-6"
      >
        {/* Quotation ref row */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-600 whitespace-nowrap">
              Quotation Ref No.
            </label>
            <input
              type="text"
              value={customer?.quotationRef || customer?.ref || ""}
              onChange={handleQuotationRefChange}
              className="h-9 w-64 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-blue shadow-sm"
              placeholder="e.g. AET/DOM/25/1123/001"
            />
          </div>
        </div>

        {/* Family tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {families.map((fam) => (
            <button
              key={fam.key}
              disabled={fam.disabled}
              onClick={() => handleFamilyClick(fam.key)}
              className={[
                "px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm",
                fam.key === activeFamily
                  ? "bg-brand-blue text-white shadow-md transform scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
                fam.disabled ? "opacity-40 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {fam.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-6">
          {/* Left: main machine image + customise button */}
          <div className="md:w-1/3 w-full">
            <div className="bg-white rounded-2xl p-6 flex items-center justify-center h-72 shadow-soft border border-slate-100">
              {activeFamily === "mono" && (
                <img
                  src="/images/machines/3layer.png"
                  alt="Unoflex Monolayer"
                  className="max-h-60 w-auto object-contain"
                />
              )}
              {activeFamily === "aba" && (
                <img
                  src="/images/machines/3layer.png"
                  alt="Duoflex ABA/AB"
                  className="max-h-60 w-auto object-contain"
                />
              )}
              {activeFamily === "3layer" && (
                <img
                  src="/images/machines/3layer.png"
                  alt="Innoflex 3 Layer"
                  className="max-h-60 w-auto object-contain"
                />
              )}
              {activeFamily === "5layer" && (
                <img
                  src="/images/machines/3layer.png"
                  alt="Innoflex 5 Layer"
                  className="max-h-60 w-auto object-contain opacity-50"
                />
              )}
            </div>
            <button
              onClick={handleCustomiseYourself}
              className="mt-4 w-full rounded-xl bg-white border-2 border-dashed border-slate-300 text-slate-600 hover:border-brand-blue hover:text-brand-blue text-sm font-medium py-3 transition-colors duration-200"
            >
              Customize this family yourself
            </button>
          </div>

          {/* Right: list of models */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 text-brand-blue">
              Available Models ({machineModels.length})
            </h2>

            {machineModels.length === 0 ? (
              <div className="text-sm text-slate-500 italic">
                No CSV models loaded for this family yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {machineModels.map((model, index) => {
                  const label = getModelLabel(model, index);
                  const highlights = getModelHighlights(model);
                  const isActive = index === machineModelIndex;

                  return (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      key={index}
                      className={[
                        "rounded-xl border p-5 cursor-pointer transition-all duration-200 shadow-sm group",
                        isActive
                          ? "border-brand-blue bg-blue-50/50 ring-1 ring-brand-blue"
                          : "border-slate-200 bg-white hover:border-brand-blue/50 hover:shadow-md",
                      ].join(" ")}
                      onClick={() => handleSelectModel(model, index)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-base mb-2 text-slate-800 group-hover:text-brand-blue transition-colors">
                            {label}
                          </div>
                          <div className="text-xs text-slate-500 space-y-1.5">
                            {highlights.map((line, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-brand-blue/50"></span>
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            type="button"
                            className="px-4 py-2 rounded-lg text-xs font-medium bg-brand-blue text-white shadow-sm hover:bg-brand-dark transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectModel(model, index);
                            }}
                          >
                            Select
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalModel({ model, label });
                            }}
                            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.main>

      {/* DETAILS MODAL for model CSV data - KEEPING DARK THEME AS REQUESTED */}
      {modalModel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black rounded-2xl border border-slate-700 max-w-3xl w-full max-h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="font-semibold text-sm text-white">
                {modalModel.label} – Technical Specification
              </div>
              <button
                onClick={() => setModalModel(null)}
                className="text-slate-400 hover:text-white text-xl transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-auto text-xs custom-scrollbar">
              <table className="w-full border-separate border-spacing-y-2">
                <tbody>
                  {Object.entries(modalModel.model)
                    .filter(([k]) => !["image", "photo", "id", "family", "machineType"].includes(k))
                    .map(([key, value]) => {
                      if (value === null || value === undefined || value === "") return null;

                      // Format key: camelCase to Title Case
                      const label = key
                        .replace(/([A-Z])/g, " $1") // insert space before caps
                        .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
                        .replace(/Mm/g, " (mm)") // fix units
                        .replace(/Kg Hr/g, " (kg/hr)")
                        .replace(/Kw/g, " (kW)")
                        .trim();

                      return (
                        <tr key={key} className="hover:bg-slate-900/50 transition-colors">
                          <td className="align-top pr-4 py-1 text-slate-400 whitespace-nowrap font-medium w-1/3">
                            {label}
                          </td>
                          <td className="align-top py-1 text-slate-100 font-mono">
                            {String(value)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-800 flex justify-end bg-black/50 rounded-b-2xl">
              <button
                onClick={() => setModalModel(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors border border-slate-700"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
