import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bar, Radar } from 'react-chartjs-2';
import '../../utils/chartSetup';
import {
  GitCompare,
  CheckCircle2,
  Trophy,
  Layers,
  Droplets,
  Sprout,
  ShieldCheck,
  Download
} from 'lucide-react';

export default function StrategyComparisonView() {
  const { recommendations, language } = useApp();

  const ranked = recommendations?.ranked_strategies || [
    {
      id: "strat_1",
      title: "AgroResilience Tri-Cycle (Rice → Lentil → Mustard)",
      crop_names: ["Rice (Paddy)", "Lentil", "Mustard / Rapeseed"],
      overall_score: 82.8,
      rank_badge: "🥇 Best Match",
      sub_scores: { soil_health: 78, water_efficiency: 85, climate_resilience: 88, crop_diversity: 80 }
    },
    {
      id: "strat_2",
      title: "Soil Regeneration Pulse-Oilseed (Wheat → Chickpea → Sunflower)",
      crop_names: ["Wheat", "Chickpea (Gram)", "Sunflower"],
      overall_score: 80.4,
      rank_badge: "🥈 Strong Alternative",
      sub_scores: { soil_health: 84, water_efficiency: 88, climate_resilience: 82, crop_diversity: 85 }
    },
    {
      id: "strat_3",
      title: "Staple-Protein Rotation (Rice → Wheat → Mungbean)",
      crop_names: ["Rice (Paddy)", "Wheat", "Mungbean (Green Gram)"],
      overall_score: 74.2,
      rank_badge: "🥉 Moderate Option",
      sub_scores: { soil_health: 72, water_efficiency: 74, climate_resilience: 76, crop_diversity: 70 }
    },
    {
      id: "strat_4",
      title: "Monoculture Reference (Rice → Rice → Rice)",
      crop_names: ["Rice (Paddy)", "Rice (Paddy)", "Rice (Paddy)"],
      overall_score: 46.5,
      rank_badge: "Baseline / High Risk",
      sub_scores: { soil_health: 32, water_efficiency: 22, climate_resilience: 48, crop_diversity: 15 }
    }
  ];

  const palette = ['#10b981', '#0284c7', '#f59e0b', '#f43f5e'];

  const barChartData = {
    labels: ['Soil Health', 'Water Efficiency', 'Climate Resilience', 'Crop Diversity', 'Overall Score'],
    datasets: ranked.map((s, idx) => ({
      label: s.title.split('(')[0].trim(),
      data: [
        s.sub_scores.soil_health,
        s.sub_scores.water_efficiency,
        s.sub_scores.climate_resilience,
        s.sub_scores.crop_diversity,
        s.overall_score
      ],
      backgroundColor: palette[idx % palette.length],
      borderRadius: 6
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Decision Matrix
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Compare Rotation Strategies
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Side-by-side indicator audit of recommended, alternative, and monoculture baseline pathways.
          </p>
        </div>
      </div>

      {/* 4 Strategy Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ranked.map((strat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {strat.rank_badge}
                </span>
                <span className="font-black text-lg text-slate-900">
                  {strat.overall_score}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-800 mt-2 line-clamp-2">
                {strat.title}
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {strat.crop_names?.join(" → ")}
            </p>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Multi-Attribute Score Distribution
        </h3>
        <div className="h-72 w-full">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 overflow-hidden">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Indicator Comparison Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-3 font-bold text-slate-500 uppercase">Indicator</th>
                {ranked.map((s, idx) => (
                  <th key={idx} className="p-3 font-bold text-slate-900">
                    <span className="block truncate max-w-[150px]">{s.title.split('(')[0]}</span>
                    <span className="text-[10px] font-semibold text-emerald-700">{s.rank_badge}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <tr>
                <td className="p-3 font-bold text-slate-600">Soil Health Score</td>
                {ranked.map((s, idx) => (
                  <td key={idx} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.sub_scores.soil_health}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-emerald-500" style={{ width: `${s.sub_scores.soil_health}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-600">Water Efficiency</td>
                {ranked.map((s, idx) => (
                  <td key={idx} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.sub_scores.water_efficiency}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-blue-500" style={{ width: `${s.sub_scores.water_efficiency}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-600">Climate Resilience</td>
                {ranked.map((s, idx) => (
                  <td key={idx} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.sub_scores.climate_resilience}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-amber-500" style={{ width: `${s.sub_scores.climate_resilience}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-600">Crop Diversity Index</td>
                {ranked.map((s, idx) => (
                  <td key={idx} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{s.sub_scores.crop_diversity}</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                        <div className="h-full bg-indigo-500" style={{ width: `${s.sub_scores.crop_diversity}%` }} />
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="bg-emerald-50/50 font-extrabold text-slate-900">
                <td className="p-3 text-emerald-950">Overall Resilience Score</td>
                {ranked.map((s, idx) => (
                  <td key={idx} className="p-3 text-sm text-emerald-800">
                    {s.overall_score} / 100
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

