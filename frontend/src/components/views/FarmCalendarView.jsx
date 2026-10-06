import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Sprout,
  ArrowRight,
  Droplets,
  Thermometer
} from 'lucide-react';

export default function FarmCalendarView() {
  const { farmData, language } = useApp();

  const seasonalWindows = [
    {
      season: "Kharif-1 / Pre-Monsoon (Spring - Summer)",
      season_bn: "খরিপ-১ / প্রাক-বর্ষা (বসন্ত ও গ্রীষ্ম)",
      months: "March – June",
      weather: "Rising temperature (28–35°C), early convective storms.",
      recommendedCrops: [
        { name: "Mungbean (মুগ ডাল)", type: "Short catch pulse (65 days)", benefit: "Fixes nitrogen before monsoon" },
        { name: "Jute (পাট)", type: "Fiber cash crop", benefit: "Massive organic leaf fall restores soil" },
        { name: "Sesame (তিল)", type: "Drought-hardy oilseed", benefit: "Zero standing water needed" }
      ]
    },
    {
      season: "Kharif-2 / Monsoon (Summer - Autumn)",
      season_bn: "খরিপ-২ / বর্ষা মৌসুম",
      months: "July – October",
      weather: "Heavy rainfall (60–75% of annual rain), high humidity, warm (29–33°C).",
      recommendedCrops: [
        { name: "T. Aman Rice (আমন ধান)", type: "Rainfed staple cereal", benefit: "Utilizes abundant monsoon surface water" },
        { name: "Soybean (সয়াবিন)", type: "Upland legume", benefit: "Fixes up to 90 kg N/ha on ridges" },
        { name: "Cowpea (বরবটি)", type: "Cover crop legume", benefit: "Smothers monsoon weed flushes" }
      ]
    },
    {
      season: "Late Autumn Transition (Relay Window)",
      season_bn: "হেমন্ত রূপান্তর কাল",
      months: "October – November",
      weather: "Rapidly dropping topsoil moisture, pleasant sunny days.",
      recommendedCrops: [
        { name: "Blackgram Relay (মাষকলাই)", type: "Broadcast zero-till pulse", benefit: "Taps residual monsoon soil moisture" },
        { name: "Short Mustard (স্বল্পমেয়াদী সরিষা)", type: "75-day oilseed", benefit: "Harvested before winter wheat" }
      ]
    },
    {
      season: "Rabi / Winter Season",
      season_bn: "রবি / শীতকালীন মৌসুম",
      months: "November – February",
      weather: "Cool days (14–24°C), dry air, minimal rainfall, fog spells.",
      recommendedCrops: [
        { name: "Lentil (মসুর ডাল)", type: "Primary winter pulse", benefit: "Needs only 250mm water; adds nitrogen" },
        { name: "Wheat (গম)", type: "Cool-season cereal", benefit: "Staple grain; moderate water use" },
        { name: "Chickpea (ছোলা)", type: "Deep-rooted legume", benefit: "Thrives in dry Barind clay subsoil" },
        { name: "Mustard (সরিষা)", type: "Biofumigant oilseed", benefit: "Breaks nematode & root disease cycles" }
      ]
    }
  ];

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Seasonal Phenology Planner
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Seasonal Farm Calendar & Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Synchronize sowing and harvesting windows with NASA precipitation and thermal cycles.
          </p>
        </div>
      </div>

      {/* Seasonal Windows Timeline Cards */}
      <div className="space-y-4">
        {seasonalWindows.map((season, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                  0{idx + 1}
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {language === 'bn' ? season.season_bn : season.season}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {season.months}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                {season.weather}
              </p>
            </div>

            {/* Recommended Crops in this season */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {season.recommendedCrops.map((c, i) => (
                <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-900">{c.name}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{c.type}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                    ✓ {c.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

