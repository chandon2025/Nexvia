import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bar } from 'react-chartjs-2';
import '../../utils/chartSetup';
import {
  Activity,
  Layers,
  Droplets,
  Sprout,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight
} from 'lucide-react';

export default function RotationSimulatorView() {
  const { farmData, setActivePage, language } = useApp();

  const strategies = [
    {
      id: "strat_a",
      name: "Strategy A: Continuous Rice Monoculture",
      name_bn: "কৌশল ক: অবিচ্ছিন্ন ধান একফসলি",
      crops: ["Rice (Paddy)", "Rice (Paddy)", "Rice (Paddy)"],
      soil_health: 38,
      water_efficiency: 28,
      water_demand_mm: 1200,
      climate_resilience: 45,
      risk_level: "High Risk (🔴)",
      risk_color: "rose",
      sustainability: 35,
      priority_match: 40,
      verdict: "High groundwater extraction, plow-pan compaction, and persistent stem borer pest carryover."
    },
    {
      id: "strat_b",
      name: "Strategy B: AgroResilience Tri-Cycle",
      name_bn: "কৌশল খ: এগ্রোরিজিলিয়েন্স ত্রি-চক্র",
      crops: ["Rice (Paddy)", "Lentil", "Mustard / Rapeseed"],
      soil_health: 84,
      water_efficiency: 88,
      water_demand_mm: 573,
      climate_resilience: 88,
      risk_level: "Low Risk (🟢)",
      risk_color: "emerald",
      sustainability: 86,
      priority_match: 92,
      verdict: "Substantial groundwater savings, biological nitrogen fixation (+60 kg N/ha), and natural biofumigation."
    },
    {
      id: "strat_c",
      name: "Strategy C: Staple-Pulse Intensive",
      name_bn: "কৌশল গ: খাদ্যশস্য ও ডাল মিশ্রণ",
      crops: ["Rice (Paddy)", "Wheat", "Lentil"],
      soil_health: 74,
      water_efficiency: 72,
      water_demand_mm: 643,
      climate_resilience: 76,
      risk_level: "Moderate Risk (🟡)",
      risk_color: "amber",
      sustainability: 72,
      priority_match: 78,
      verdict: "Balanced food security with winter grain and pulse; vulnerable to late-winter heat stress."
    }
  ];

  const [activeStrategy, setActiveStrategy] = useState(strategies[1]);

  const barChartData = {
    labels: ['Soil Health', 'Water Efficiency', 'Climate Resilience', 'Sustainability'],
    datasets: strategies.map((s, idx) => ({
      label: s.name.split(':')[0],
      data: [s.soil_health, s.water_efficiency, s.climate_resilience, s.sustainability],
      backgroundColor: idx === 0 ? '#f43f5e' : idx === 1 ? '#10b981' : '#f59e0b',
      borderRadius: 6
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: { padding: 8 }
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
            Multi-Strategy Simulation Lab
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Rotation Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare Monoculture vs Traditional Cereal vs AgroResilience Resilient Strategy under normal conditions.
          </p>
        </div>

        <button
          onClick={() => setActivePage('whatif')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Stress-Test under Climate Shocks →</span>
        </button>
      </div>

      {/* 3 Strategy Selectable Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {strategies.map((strat) => {
          const isSelected = activeStrategy.id === strat.id;
          return (
            <div
              key={strat.id}
              onClick={() => setActiveStrategy(strat)}
              className={`rounded-3xl p-6 border transition-all cursor-pointer space-y-4 ${
                isSelected
                  ? "bg-white border-emerald-500 ring-2 ring-emerald-200 shadow-md"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {strat.name.split(':')[0]}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  strat.risk_color === 'rose' ? 'bg-rose-100 text-rose-800' :
                  strat.risk_color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {strat.risk_level}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                {language === 'bn' ? strat.name_bn : strat.name}
              </h3>

              {/* Crop Path */}
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span>{strat.crops[0]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{strat.crops[1]}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{strat.crops[2]}</span>
              </div>

              {/* Key Indicators Mini Table */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-600">
                <div className="flex justify-between p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">Soil Health:</span>
                  <span className="font-bold">{strat.soil_health}/100</span>
                </div>
                <div className="flex justify-between p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">Water Req:</span>
                  <span className="font-bold">{strat.water_demand_mm} mm</span>
                </div>
                <div className="flex justify-between p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">Resilience:</span>
                  <span className="font-bold">{strat.climate_resilience}/100</span>
                </div>
                <div className="flex justify-between p-1.5 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">Sustainability:</span>
                  <span className="font-bold">{strat.sustainability}/100</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                {strat.verdict}
              </p>
            </div>
          );
        })}
      </div>

      {/* Comparison Chart & Detailed Focus */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
            Comparative Metric Performance
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Scores normalized across 0–100 scale
          </span>
        </div>

        <div className="h-64 w-full">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </div>

    </div>
  );
}

