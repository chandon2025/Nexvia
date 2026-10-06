import React from 'react';
import { useApp } from '../../context/AppContext';
import ScoreGauge from '../common/ScoreGauge';
import {
  Leaf,
  Sparkles,
  TrendingUp,
  Droplets,
  Layers,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function SustainabilityView() {
  const { farmData, recommendations, setActivePage } = useApp();

  const currentScore = 64;
  const potentialScore = 84;
  const delta = potentialScore - currentScore;

  const sustainabilityPillars = [
    {
      pillar: "Groundwater Conservation & Evapotranspiration",
      current: 48,
      potential: 85,
      desc: "Replacing dry-season flooded paddy with pulses cuts water pumping hours by over 50%."
    },
    {
      pillar: "Soil Organic Carbon & Microbial Diversity",
      current: 55,
      potential: 82,
      desc: "Legume root exudates and crop residue retention build humic carbon and fungal mycorrhizae."
    },
    {
      pillar: "Synthetic Nitrogen Replacement",
      current: 60,
      potential: 88,
      desc: "Biological nitrogen fixation from pulses adds 40-70 kg N/ha, shrinking synthetic urea dependency."
    },
    {
      pillar: "Botanical Family Pathogen Break",
      current: 45,
      potential: 90,
      desc: "Rotating Poaceae with Fabaceae and Brassicaceae interrupts soil nematode and fungal spore cycles."
    }
  ];

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Long-Term Farm Sustainability
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Farm Sustainability & Regeneration Index
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Projected trajectory comparing your current baseline against the recommended crop rotation sequence.
          </p>
        </div>
      </div>

      {/* Before vs After Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 text-center">
          
          {/* Current Score */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Current Baseline Farm
            </span>
            <ScoreGauge
              score={currentScore}
              max={100}
              label="Current Score"
              sublabel="Traditional System"
              size={140}
              strokeWidth={12}
            />
            <p className="text-xs text-slate-500 max-w-xs">
              Based on historical monoculture pressure and water extraction.
            </p>
          </div>

          {/* Transformation Arrow */}
          <div className="flex flex-col items-center text-emerald-600 space-y-1">
            <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              +{delta} pts Potential
            </span>
            <ArrowRight className="w-8 h-8 hidden md:block" />
            <span className="text-[10px] font-semibold text-slate-400">
              Rotational Transition
            </span>
          </div>

          {/* Potential Score */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Potential with Recommended Rotation
            </span>
            <ScoreGauge
              score={potentialScore}
              max={100}
              label="Potential Score"
              sublabel="AgroResilience Rotation"
              size={140}
              strokeWidth={12}
            />
            <p className="text-xs text-slate-500 max-w-xs">
              Estimated trajectory after adopting diversified legume-oilseed rotation.
            </p>
          </div>

        </div>

        {/* Note on potential improvement */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="leading-relaxed">
            <strong>Scientific Integrity Statement:</strong> All projected increases are expressed as <em>“potential improvement based on ecological modeling”</em>. Actual outcomes depend on seasonal rainfall timing, soil microbial inoculation, and timely agronomic management.
          </p>
        </div>
      </div>

      {/* Sustainability Pillars Breakdown */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Pillar-by-Pillar Environmental Impact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sustainabilityPillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-xs text-slate-900 leading-snug">
                  {p.pillar}
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                  {p.current} → {p.potential} pts
                </span>
              </div>

              {/* Progress Bar Dual */}
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="bg-slate-400 h-full" style={{ width: `${p.current}%` }} title="Current" />
                  <div className="bg-emerald-500 h-full" style={{ width: `${p.potential - p.current}%` }} title="Potential Gain" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Current: {p.current}%</span>
                  <span className="text-emerald-700 font-bold">Potential: {p.potential}%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

