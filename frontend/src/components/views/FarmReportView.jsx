import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Printer,
  Download,
  Satellite,
  ShieldCheck,
  Sprout,
  Layers,
  Droplets,
  Calendar,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function FarmReportView() {
  const { farmData, climateData, recommendations, language } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const bestMatch = recommendations?.best_match || {
    title: "AgroResilience Tri-Cycle (Rice → Lentil → Mustard)",
    crop_names: ["Rice (Paddy)", "Lentil", "Mustard / Rapeseed"],
    overall_score: 82.8,
    sub_scores: { soil_health: 78, water_efficiency: 85, climate_resilience: 88, crop_diversity: 80 }
  };

  const ind = climateData?.indicators || {
    mean_temperature_c: 25.8,
    annual_rainfall_mm: 1420.5,
    soil_moisture_index: 0.44,
    vegetation_ndvi_index: 0.56,
    drought_risk: "Moderate"
  };

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 space-y-6">
      
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex items-center justify-between no-print">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Document Generation
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Official Farm Resilience Report
          </h2>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Download PDF / Print</span>
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-8 text-slate-800 printable-document">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                AgroResilience Advisory Report
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              NASA Earth Observations & Agricultural Decision Support
            </p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p className="font-mono font-bold text-slate-800">
              REPORT REF: AGRO-{Math.round(farmData.latitude * 100)}-{Math.round(farmData.longitude * 100)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Generated: October 2026 • Valid for 12 Months
            </p>
          </div>
        </div>

        {/* Section 1: Farm & Location Metadata */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
            1. Farm & Geolocation Profile
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Location</p>
              <p className="font-bold text-slate-800 mt-0.5 truncate">{farmData.location_name}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Coordinates</p>
              <p className="font-mono font-bold text-slate-800 mt-0.5">
                {farmData.latitude.toFixed(2)}°N, {farmData.longitude.toFixed(2)}°E
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Farm Area</p>
              <p className="font-bold text-slate-800 mt-0.5">{farmData.farm_size_acres} Acres</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Soil Texture</p>
              <p className="font-bold text-slate-800 mt-0.5">{farmData.soil_type} Soil</p>
            </div>
          </div>
        </div>

        {/* Section 2: NASA Environmental Observations */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
            2. NASA Earth Observation Climatology
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Mean Temperature</p>
              <p className="font-bold text-slate-800 mt-0.5">{ind.mean_temperature_c}°C</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Annual Precipitation</p>
              <p className="font-bold text-slate-800 mt-0.5">{ind.annual_rainfall_mm} mm</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Soil Wetness (SMAP)</p>
              <p className="font-bold text-slate-800 mt-0.5">{(ind.soil_moisture_index * 100).toFixed(0)}% Saturation</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-bold text-[10px] uppercase">Drought Severity</p>
              <p className="font-bold text-amber-700 mt-0.5">{ind.drought_risk}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Recommended Rotation Strategy */}
        <div className="space-y-4 p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 uppercase">
                Primary Scientific Recommendation
              </span>
              <h3 className="text-lg font-black text-emerald-950 mt-1">
                {bestMatch.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-800">{bestMatch.overall_score}</span>
              <span className="text-xs text-emerald-600"> / 100</span>
              <p className="text-[10px] text-emerald-700 font-semibold">Resilience Score</p>
            </div>
          </div>

          {/* Crop Sequence Flow */}
          <div className="grid grid-cols-3 gap-3">
            {(bestMatch.crop_names || ["Rice", "Lentil", "Mustard"]).map((crop, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Year 0{idx + 1}</span>
                <p className="font-extrabold text-xs text-slate-800 mt-0.5 truncate">{crop}</p>
                <span className="text-[10px] text-emerald-700 font-medium">
                  {idx === 0 ? "Staple Cereal" : idx === 1 ? "N-Fixing Pulse" : "Biofumigant Oilseed"}
                </span>
              </div>
            ))}
          </div>

          {/* Rationale Bullet Points */}
          <div className="space-y-1.5 text-xs text-emerald-950 pt-2">
            <p className="font-bold">Decision Rationale & Benefits:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Cuts seasonal groundwater extraction by over 50% compared to continuous flood-irrigated paddy.</li>
              <li>Pulse nodulation injects 40–70 kg N/ha of organic nitrogen directly into the root zone.</li>
              <li>Rotating 3 botanical families interrupts persistent fungal spore vectors and cyst nematodes.</li>
            </ul>
          </div>
        </div>

        {/* Section 4: Alternative Strategies Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
            4. Alternative Evaluated Pathways
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2">Strategy</th>
                  <th className="py-2">Crops</th>
                  <th className="py-2">Water Eff.</th>
                  <th className="py-2">Resilience</th>
                  <th className="py-2">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(recommendations?.ranked_strategies || []).slice(1, 4).map((s, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-bold">{s.title.split('(')[0]}</td>
                    <td className="py-2.5 text-slate-500">{s.crop_names?.join(" → ")}</td>
                    <td className="py-2.5">{s.sub_scores?.water_efficiency}/100</td>
                    <td className="py-2.5">{s.sub_scores?.climate_resilience}/100</td>
                    <td className="py-2.5 font-bold text-slate-900">{s.overall_score}/100</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Scientific Provenance & Disclaimers */}
        <div className="border-t border-slate-200 pt-6 text-[11px] text-slate-500 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Scientific Provenance & Limitations</span>
          </div>
          <p className="leading-relaxed">
            Data sourced from NASA Langley Research Center POWER Project (Agroclimatology MERRA-2 and CERES models, 0.5° spatial resolution). Recommendation algorithms synthesize multi-criteria decision matrices, Shannon-Wiener botanical diversity indices, and FAO Irrigation and Drainage Paper 56 crop water requirements.
          </p>
          <p className="text-[10px] text-slate-400 italic">
            Disclaimer: AgroResilience provides advisory decision support. Local microclimate variations, pest outbreaks, and seed viability require ongoing consultation with certified regional agricultural officers.
          </p>
        </div>

      </div>

    </div>
  );
}

