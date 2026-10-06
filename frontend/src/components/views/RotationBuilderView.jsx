import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateCustomRotationApi } from '../../services/api';
import { Bar, Radar } from 'react-chartjs-2';
import '../../utils/chartSetup';
import {
  Repeat,
  Sparkles,
  Layers,
  Droplets,
  Sprout,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function RotationBuilderView() {
  const { cropsList, farmData, climateData, language } = useApp();

  const [selectedCrops, setSelectedCrops] = useState(["rice", "lentil", "mustard", "wheat"]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Run calculation when crops change
  useEffect(() => {
    async function calculate() {
      setLoading(true);
      const res = await simulateCustomRotationApi({
        crop_ids: selectedCrops,
        latitude: farmData.latitude,
        longitude: farmData.longitude,
        soil_type: farmData.soil_type,
        water_availability: farmData.water_availability,
        farmer_priorities: farmData.farmer_priorities
      });
      if (res) {
        setSimulationResult(res);
      }
      setLoading(false);
    }
    calculate();
  }, [selectedCrops, farmData]);

  const handleCropChange = (yearIndex, cropId) => {
    const updated = [...selectedCrops];
    updated[yearIndex] = cropId;
    setSelectedCrops(updated);
  };

  const metrics = simulationResult?.summary_metrics || {};
  const subScores = metrics.sub_scores || {
    soil_health: 78,
    water_efficiency: 82,
    climate_resilience: 80,
    crop_diversity: 85,
    nutrient_balance: 75
  };

  // Bar Chart of Metrics
  const barChartData = {
    labels: [
      'Soil Health',
      'Water Efficiency',
      'Climate Resilience',
      'Crop Diversity',
      'Nutrient Balance'
    ],
    datasets: [
      {
        label: 'Score (out of 100)',
        data: [
          subScores.soil_health,
          subScores.water_efficiency,
          subScores.climate_resilience,
          subScores.crop_diversity,
          subScores.nutrient_balance
        ],
        backgroundColor: [
          '#10b981', // emerald
          '#0284c7', // blue
          '#f59e0b', // amber
          '#6366f1', // indigo
          '#14b8a6'  // teal
        ],
        borderRadius: 8
      }
    ]
  };

  // Radar Chart
  const radarChartData = {
    labels: [
      'Soil Health',
      'Water Efficiency',
      'Climate Resilience',
      'Crop Diversity',
      'Nutrient Balance',
      'Drought Defense'
    ],
    datasets: [
      {
        label: 'Custom Rotation Signature',
        data: [
          subScores.soil_health,
          subScores.water_efficiency,
          subScores.climate_resilience,
          subScores.crop_diversity,
          subScores.nutrient_balance,
          subScores.drought_resilience || 80
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { padding: 8 }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } }
    }
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 25, display: false },
        grid: { color: '#e2e8f0' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Interactive Decision Builder
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Build Your Own Crop Rotation Sequence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select crops for Year 1 through Year 4. The system calculates soil dynamics and water footprints in real-time.
          </p>
        </div>

        <button
          onClick={() => setSelectedCrops(["rice", "lentil", "mustard", "wheat"])}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Balanced Sequence</span>
        </button>
      </div>

      {/* 4-Year Crop Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((yearIdx) => {
          const currentCropId = selectedCrops[yearIdx];
          const cropObj = cropsList.find(c => c.id === currentCropId) || {};
          return (
            <div
              key={yearIdx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                  Year {yearIdx + 1}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {cropObj.category || "Crop"}
                </span>
              </div>

              {/* Crop Selector Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Selected Crop</label>
                <select
                  value={currentCropId}
                  onChange={(e) => handleCropChange(yearIdx, e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {cropsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.bangla_name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop Quick Attributes */}
              <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Water Demand:</span>
                  <span className="font-semibold text-blue-700">{cropObj.water_requirement_mm || 400} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">N-Fixation:</span>
                  <span className={`font-semibold ${cropObj.is_nitrogen_fixer ? "text-emerald-700" : "text-slate-500"}`}>
                    {cropObj.is_nitrogen_fixer ? "✓ Yes (Legume)" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Family:</span>
                  <span className="font-mono text-slate-500">{cropObj.family || "Poaceae"}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Dynamic Results & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Overall Score Card (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dynamic Rotation Score
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-emerald-700 tracking-tight">
                {metrics.overall_score || 80.5}
              </span>
              <span className="text-sm text-slate-400 font-bold">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Dynamically calculated against {farmData.soil_type} soil and {farmData.water_availability.toLowerCase()} water availability in {farmData.location_name}.
            </p>
          </div>

          {/* Quick Warnings / Strengths */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {metrics.overall_score >= 78 ? (
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span>Balanced sequence! Nitrogen fixation and root alternations protect soil vitality.</span>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-xl text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span>High resource drag. Consider replacing one heavy feeder with a legume or oilseed.</span>
              </div>
            )}

            <div className="text-[11px] text-slate-400 pt-1">
              Estimated Average Water: {metrics.agronomic_summary?.average_water_demand_mm || 520} mm/season
            </div>
          </div>
        </div>

        {/* Center: Component Bar Chart (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Component Score Breakdown
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">0–100 Scale</span>
          </div>
          <div className="h-56 w-full">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Right: Radar Chart (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Resilience Radar
            </h4>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              Multi-Attribute
            </span>
          </div>
          <div className="h-56 w-full">
            <Radar data={radarChartData} options={radarOptions} />
          </div>
        </div>

      </div>

    </div>
  );
}

