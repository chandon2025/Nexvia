import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Calculator,
  Satellite,
  ShieldCheck,
  AlertCircle,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function DataMethodologyView() {
  const { farmData, recommendations } = useApp();

  const bestMatch = recommendations?.best_match || {};
  const weights = bestMatch.weights_used || {
    soil_health: 25.0,
    water_efficiency: 20.0,
    climate_resilience: 20.0,
    crop_diversity: 15.0,
    nutrient_balance: 10.0,
    farmer_priority_match: 10.0
  };

  const nasaDatasets = [
    {
      name: "NASA POWER Agroclimatology (MERRA-2)",
      parameter: "T2M (Air Temperature at 2m), PRECTOTCORR (Precipitation)",
      temporal: "Daily & 30-Year Climatological Normals",
      resolution: "0.5° Latitude × 0.5° Longitude (~50 km)",
      role: "Assesses seasonal growing degree days, thermal stress, and annual precipitation budgets."
    },
    {
      name: "NASA SMAP / GMAO Soil Wetness (GWETTOP / GWETROOT)",
      parameter: "Topsoil and Root-Zone Wetness Index (0.0 to 1.0)",
      temporal: "Daily / Monthly Assimilated Climatology",
      resolution: "0.5° Grid",
      role: "Identifies dry-season root-zone moisture depletion and informs relay sowing timing."
    },
    {
      name: "MODIS / VIIRS Terra-Aqua Satellite Imagery",
      parameter: "Normalized Difference Vegetation Index (NDVI)",
      temporal: "16-day Composite",
      resolution: "250m – 500m Native, aggregated regionally",
      role: "Validates seasonal vegetative vigor and local crop phenology curves."
    },
    {
      name: "CERES Solar Irradiance Archive",
      parameter: "ALLSKY_SFC_SW_DWN (Surface Downward Solar Radiation, MJ/m²/day)",
      temporal: "Multi-year Climatology",
      resolution: "1.0° Grid (POWER interpolated to 0.5°)",
      role: "Quantifies solar photosynthetic potential for biomass accumulation."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Scientific Transparency & Open Data
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Data Sources, Scoring Algorithm & Methodology
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete disclosure of data provenance, multi-attribute decision formulas, dynamic weighting, and uncertainties.
        </p>
      </div>

      {/* NASA Data Provenance Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Satellite className="w-5 h-5 text-blue-600" />
          <h3 className="font-extrabold text-base text-slate-900">
            1. NASA Earth Observation Data Sources
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          All environmental measurements originate from officially published NASA Earth observation archives:
        </p>

        <div className="space-y-3">
          {nasaDatasets.map((ds, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-extrabold text-slate-900 text-sm">{ds.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold shrink-0">
                  {ds.resolution}
                </span>
              </div>
              <p className="text-slate-600"><strong className="text-slate-700">Observed Variables:</strong> {ds.parameter}</p>
              <p className="text-slate-500 text-[11px]"><strong className="text-slate-700">Application in Decision Engine:</strong> {ds.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Transparent Scoring Formula */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900">
            2. Multi-Objective Recommendation Algorithm
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The AgroResilience decision engine evaluates candidate crop sequences across six distinct agronomic dimensions. The Overall Resilience Score is calculated using a dynamic multi-attribute utility function:
        </p>

        {/* Math KaTeX Formula Display */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
          <p className="text-emerald-400 font-bold">// Overall Score Formulation:</p>
          <p className="text-slate-200">
            Overall Score = (Soil Health × {weights.soil_health}%) + (Water Efficiency × {weights.water_efficiency}%) + (Climate Resilience × {weights.climate_resilience}%) + (Crop Diversity × {weights.crop_diversity}%) + (Nutrient Balance × {weights.nutrient_balance}%) + (Priority Match × {weights.farmer_priority_match}%)
          </p>
        </div>

        {/* Dynamic Weight Shifting Explanation */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Dynamic Weight Personalization:</span>
          </p>
          <p className="text-[11px] leading-relaxed text-emerald-800">
            When a farmer prioritizes <strong>Water Conservation</strong>, the water efficiency weight automatically scales up from 20% to {weights.water_efficiency}%. When <strong>Soil Health</strong> is selected, the soil score weight increases to {weights.soil_health}%. This guarantees that recommendations reflect individual farm realities.
          </p>
        </div>
      </div>

      {/* Uncertainty & Limitations Disclosure */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-amber-700">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-extrabold text-base text-slate-900">
            3. Scientific Uncertainty & Spatial Limitations
          </h3>
        </div>
        <ul className="list-disc list-inside space-y-2 leading-relaxed">
          <li>
            <strong>Spatial Resolution Limitation:</strong> NASA POWER data has a 0.5° (~50 km) grid resolution. Microclimatic variations (e.g. frost pockets, local river fog) may differ slightly from grid averages.
          </li>
          <li>
            <strong>Soil Test Ground-Truthing:</strong> In the absence of laboratory soil tests, regional FAO soil texture approximations are used. Farmers are encouraged to input exact soil test pH and organic matter values in the Farm Setup Wizard.
          </li>
          <li>
            <strong>Biological Complexity:</strong> Pests, unseasonal hail, and sudden seed germination failures cannot be forecasted by multi-decadal climatology. System outputs are advisory decision-support models, never guarantees.
          </li>
        </ul>
      </div>

    </div>
  );
}

