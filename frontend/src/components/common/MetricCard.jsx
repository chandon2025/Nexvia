import React from 'react';
import { useApp } from '../../context/AppContext';

export default function MetricCard({
  icon: Icon,
  title,
  value,
  unit = "",
  statusText,
  statusColor = "emerald", // emerald, amber, red, blue, slate
  simpleFarmerText,
  researchDataset,
  researchResolution = "0.5° (~50km)",
  onClick
}) {
  const { mode } = useApp();

  const colorStyles = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200"
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-emerald-300' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
        </div>

        {statusText && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              colorStyles[statusColor] || colorStyles.slate
            }`}
          >
            {statusText}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>

      {/* Mode-Specific Insight */}
      <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
        {mode === 'farmer' ? (
          <p className="text-slate-600 line-clamp-2 leading-relaxed">
            {simpleFarmerText || "Conditions are within normal seasonal range."}
          </p>
        ) : (
          <div className="text-[11px] text-slate-500 space-y-0.5">
            <p className="font-mono text-slate-600 truncate">
              {researchDataset || "NASA POWER Climatology (MERRA-2)"}
            </p>
            <p className="text-[10px] text-slate-400">
              Spatial Grid: {researchResolution}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

