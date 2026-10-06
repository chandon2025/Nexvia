import React from 'react';
import { useApp } from '../../context/AppContext';
import ScoreGauge from '../common/ScoreGauge';
import {
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Sprout,
  ArrowRight,
  Droplets,
  Repeat
} from 'lucide-react';

export default function SoilHealthView() {
  const { farmData, recommendations, setActivePage, mode, language } = useApp();

  const bestMatch = recommendations?.best_match || {};
  const soilScore = bestMatch.sub_scores?.soil_health || 78;

  const soilInfo = farmData.soil_info || {
    ph: 6.5,
    organic_matter: "1.2%",
    nitrogen: "Medium",
    phosphorus: "Low",
    potassium: "Medium"
  };

  const soilDegradationFactors = [
    {
      title: "Continuous Monoculture Compaction",
      title_bn: "একফসলি চাষে মাটির শক্ত স্তর সৃষ্টি",
      desc: "Planting continuous flooded paddy puddles fine clay particles into an impermeable plow-pan layer, restricting root aeration.",
      impact: "-15 pts"
    },
    {
      title: "Organic Matter Depletion (<1.5%)",
      title_bn: "জৈব পদার্থের স্বল্পতা (১.৫% এর কম)",
      desc: "Removing all post-harvest straw and burning crop residues starves beneficial soil microbes and earthworms.",
      impact: "-12 pts"
    },
    {
      title: "Synthetic Nitrogen Acidification",
      title_bn: "অতিরিক্ত ইউরিয়া সারে মাটির ভারসাম্যহীনতা",
      desc: "Over-reliance on synthetic urea without organic manure reduces soil buffering capacity and beneficial mycorrhizal fungi.",
      impact: "-8 pts"
    }
  ];

  const improvementStrategies = [
    {
      title: "Integrate N-Fixing Legumes (Pulses)",
      title_bn: "ডাল জাতীয় শস্য অন্তর্ভুক্ত করুন",
      desc: "Planting Lentil, Chickpea, or Mungbean establishes root nodules with Rhizobium bacteria, injecting 40–80 kg/ha of biological nitrogen.",
      gain: "+18 pts"
    },
    {
      title: "Alternate Deep and Shallow Root Architecture",
      title_bn: "গভীর ও অগভীর মূলযুক্ত ফসল অদলবদল করুন",
      desc: "Rotating shallow rice roots with deep-taprooted crops (like Sunflower or Chickpea) punches natural aeration holes through dense subsoil.",
      gain: "+10 pts"
    },
    {
      title: "Incorporate Crop Biomass Mulch",
      title_bn: "ফসলের অবশিষ্টাংশ ও খড় মাটিতে মেশান",
      desc: "Leaving 30% of crop residues on the surface prevents direct sun baking, reduces water evaporation, and builds active soil carbon.",
      gain: "+8 pts"
    },
    {
      title: "Biofumigation with Brassicaceae",
      title_bn: "সরিষা জাতীয় ফসলের মাধ্যমে জৈব শোধন",
      desc: "Mustard and rapeseed root exudates naturally suppress soil nematodes and soil-borne fungal pathogens before the next grain crop.",
      gain: "+6 pts"
    }
  ];

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Regenerative Soil Assessment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Soil Health & Biological Score
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluating soil texture, microbial activity potential, organic carbon, and rotational recovery.
          </p>
        </div>

        <button
          onClick={() => setActivePage('builder')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Build Soil-Enhancing Rotation</span>
        </button>
      </div>

      {/* Main Soil Score Showcase Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <ScoreGauge
              score={soilScore}
              max={100}
              label="Soil Health Index"
              sublabel="0–100 Scale"
              size={150}
              strokeWidth={14}
            />
            <div className="space-y-1.5 max-w-sm">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {farmData.soil_type} Soil Profile
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                {soilScore >= 75 ? "Healthy & Biologically Active" : "Moderate — Soil Regeneration Recommended"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {mode === 'farmer'
                  ? 'Your soil score indicates good moisture holding ability. Adding pulses in winter will dramatically reduce fertilizer expenses!'
                  : `Model incorporates soil texture (${farmData.soil_type}), pH ${soilInfo.ph}, organic matter proxy ${soilInfo.organic_matter}, and rotational pathogen break factors.`}
              </p>
            </div>
          </div>

          {/* Quick Soil Diagnostics Pills */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-80 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Soil pH</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{soilInfo.ph}</p>
              <p className="text-[10px] text-emerald-600 font-semibold">Near Optimum</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Organic Matter</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{soilInfo.organic_matter}</p>
              <p className="text-[10px] text-amber-600 font-semibold">Needs Enrichment</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Available Nitrogen</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{soilInfo.nitrogen}</p>
              <p className="text-[10px] text-blue-600 font-semibold">Boost with Legumes</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Compaction Risk</p>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">Moderate</p>
              <p className="text-[10px] text-slate-500 font-semibold">Taproots Beneficial</p>
            </div>
          </div>

        </div>
      </div>

      {/* Explanatory Sections: Why Low? vs How to Improve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Why is my soil score low? */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900">
              Why might soil health score decline?
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Intensive crop production without rotational breaks drains soil biology through several known mechanisms:
          </p>

          <div className="space-y-3">
            {soilDegradationFactors.map((factor, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-rose-900">
                    {language === 'bn' ? factor.title_bn : factor.title}
                  </p>
                  <span className="text-[10px] font-mono font-bold text-rose-600">
                    {factor.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {factor.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How can I improve it? */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-base text-slate-900">
              How can I improve soil health sustainably?
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Sustainable agricultural rotations restore soil organic carbon without costly chemical inputs:
          </p>

          <div className="space-y-3">
            {improvementStrategies.map((strat, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-xs text-emerald-900">
                    {language === 'bn' ? strat.title_bn : strat.title}
                  </p>
                  <span className="text-[10px] font-mono font-bold text-emerald-600">
                    {strat.gain}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {strat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

