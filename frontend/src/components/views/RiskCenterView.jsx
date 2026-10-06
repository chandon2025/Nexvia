import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Flame,
  SunMedium,
  Droplets,
  Layers,
  CloudRain,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export default function RiskCenterView() {
  const { farmData, climateData, language } = useApp();

  const ind = climateData?.indicators || {
    drought_code: "moderate",
    drought_risk: "Moderate",
    annual_rainfall_mm: 1420,
    soil_moisture_index: 0.44
  };

  const riskFactors = [
    {
      id: "drought",
      title: "Agricultural Drought & Moisture Deficit",
      title_bn: "কৃষি খরা ও আর্দ্রতা ঘাটতি",
      level: ind.drought_risk || "Moderate",
      badgeColor: ind.drought_code === 'low' ? 'emerald' : ind.drought_code === 'moderate' ? 'amber' : 'rose',
      icon: SunMedium,
      explanation: "Dry-season topsoil moisture drops below critical plant available water (PAW) thresholds during winter months.",
      contributingFactors: [
        "Unbalanced monsoon concentration where 75% of rain falls within 4 months",
        "High evaporative demand and low winter precipitation (<25mm/month)",
        "Over-reliance on high-water dry season crops"
      ],
      mitigation: "Adopt low-water pulses (Lentil, Chickpea) requiring <280mm total irrigation. Apply straw mulching to halt surface evaporation."
    },
    {
      id: "heat_stress",
      title: "Heat Stress & Terminal Flowering Spike",
      title_bn: "তাপজনিত চাপ ও ফুল ফোটার সময় অতিরিক্ত গরম",
      level: "Moderate",
      badgeColor: "amber",
      icon: Flame,
      explanation: "Late-spring temperatures exceeding 32°C during grain fill or flowering stages can trigger pollen sterility.",
      contributingFactors: [
        "Delayed winter sowing pushing grain filling into warm March temperatures",
        "Increasing trend in pre-monsoon heat wave days (NASA MERRA-2 trend)"
      ],
      mitigation: "Sow winter wheat and mustard strictly within the November 15–30 window. Select short-duration heat-tolerant varieties."
    },
    {
      id: "water_shortage",
      title: "Groundwater & Aquifer Overdraft",
      title_bn: "ভূগর্ভস্থ পানির স্তর হ্রাস ও সেচ সংকট",
      level: farmData.water_availability === "Low" ? "High" : "Moderate",
      badgeColor: farmData.water_availability === "Low" ? "orange" : "amber",
      icon: Droplets,
      explanation: "Deep tube wells face declining water tables due to intensive winter Boro rice pumping.",
      contributingFactors: [
        "Extraction exceeding natural monsoon recharge rate",
        "High electricity and diesel pumping operating expenses for farmers"
      ],
      mitigation: "Shift acreage from Boro rice to zero-till Mustard or Maize-Soybean rotations, decreasing irrigation needs by 60%."
    },
    {
      id: "soil_degradation",
      title: "Soil Compaction & Microbial Exhaustion",
      title_bn: "মাটির শক্ত স্তর গঠন ও উর্বরতা হ্রাস",
      level: "Moderate",
      badgeColor: "amber",
      icon: Layers,
      explanation: "Continuous wet puddling in heavy clay soil creates an impermeable hardpan at 15–20 cm depth.",
      contributingFactors: [
        "Repetitive cereal monoculture (Paddy–Paddy)",
        "Zero legume nitrogen-fixation in the cropping sequence",
        "Burning or total removal of crop residues"
      ],
      mitigation: "Rotate with taprooted legumes (Chickpea, Cowpea) or deep-rooted Sunflower to naturally break the subsoil pan."
    },
    {
      id: "excess_moisture",
      title: "Post-Monsoon Waterlogging Risk",
      title_bn: "বর্ষা পরবর্তী জলাবদ্ধতার ঝুঁকি",
      level: "Low",
      badgeColor: "emerald",
      icon: CloudRain,
      explanation: "Standing water in poorly drained clay depressions can cause root rot in young pulse seedlings.",
      contributingFactors: [
        "Unseasonal late-October torrential monsoon showers",
        "Inadequate field drainage channels"
      ],
      mitigation: "Construct raised beds for winter vegetables or broadcast relay pulses into maturing rice prior to final drain."
    },
    {
      id: "monoculture_risk",
      title: "Crop Diversity & Pest Cycle Accumulation",
      title_bn: "একফসলি চাষে পোকা ও ছত্রাকের বিস্তার",
      level: "Moderate",
      badgeColor: "amber",
      icon: Sprout,
      explanation: "Growing the same botanical family year after year accumulates species-specific root nematodes and fungal spores.",
      contributingFactors: [
        "Market familiarity favoring single-crop monoculture",
        "Lack of diversified seed access"
      ],
      mitigation: "Implement a 3-family rotation (Poaceae → Fabaceae → Brassicaceae) for natural biofumigation and biological balance."
    }
  ];

  const colorBadges = {
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    rose: "bg-rose-100 text-rose-800 border-rose-200"
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Risk Diagnostic Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Agricultural & Climate Risk Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Detect potential stress factors and access agronomic mitigation strategies for {farmData.location_name}.
          </p>
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {riskFactors.map((rf) => {
          const Icon = rf.icon;
          return (
            <div
              key={rf.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                        {language === 'bn' ? rf.title_bn : rf.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        NASA Climate & Soil Diagnostic
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      colorBadges[rf.badgeColor] || colorBadges.amber
                    }`}
                  >
                    {rf.level} Risk
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {rf.explanation}
                </p>

                {/* Contributing factors */}
                <div className="space-y-1 pt-1 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Main Contributing Drivers:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {rf.contributingFactors.map((cf, i) => (
                      <li key={i}>{cf}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Mitigation Strategy Box */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mitigation Action:</span>
                </p>
                <p className="text-[11px] leading-relaxed text-emerald-800">
                  {rf.mitigation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

