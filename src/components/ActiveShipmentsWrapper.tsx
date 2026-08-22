"use client";

import { useDisruption } from "@/contexts/DisruptionContext";
import type { DisruptionZone } from "@/data/demo";
import ActiveShipments from "@/components/ActiveShipments";
import { AlertTriangle } from "lucide-react";

const disruptionOptions: { value: DisruptionZone; label: string; color: string; activeColor: string }[] = [
  { value: "NONE", label: "No Disruption", color: "text-emerald-400", activeColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" },
  { value: "HORMUZ", label: "Hormuz Blockade", color: "text-rose-400", activeColor: "bg-rose-500/15 border-rose-500/30 text-rose-400" },
  { value: "RED_SEA", label: "Red Sea Threat", color: "text-amber-400", activeColor: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
];

export default function DisruptionAwareShipments() {
  const { disruption, setDisruption } = useDisruption();

  return (
    <div className="h-full overflow-y-auto p-5 sm:p-6 space-y-4">
      {/* Disruption Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-slate-500" />
          <span className="text-[12px] text-slate-400 font-medium">Disruption Scenario:</span>
        </div>
        <div className="flex gap-1.5">
          {disruptionOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDisruption(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                disruption === opt.value
                  ? opt.activeColor
                  : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              {opt.value !== "NONE" && <AlertTriangle className={`w-3 h-3 inline mr-1 ${disruption === opt.value ? opt.color : ""}`} />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <ActiveShipments disruption={disruption} />
    </div>
  );
}
