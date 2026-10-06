import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { simulateWhatIfApi } from '../../services/api';
import {
  FlaskConical,
  Flame,
  CloudRain,
  Droplets,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Info
} from 'lucide-react';

export default function WhatIfSimulatorView() {
  const { farmData, language } = useApp();

  const [tempDelta, setTempDelta] = useState(1.5);
  const [rainDelta, setRainDelta] = useState(-20.0);
  const [waterCrisis, setWaterCrisis] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function runSim() {
      setLoading(true);
      const res = await simulateWhatIfApi({
        temp_delta_c: tempDelta,
        rainfall_delta_percent: rainDelta,
        water_reduction: waterCrisis,
        latitude: farmData.latitude,
        longitude: farmData.longitude,
        soil_type: farmData.soil_type,
        farmer_priorities: farmData.farmer_priorities
      });
      if (res) {
        setSimulationData(res);
      }
      setLoading(false);
    }
    runSim();
  }, [tempDelta, rainDelta, waterCrisis, farmData]);

  const winner = simulationData?.most_resilient_strategy;
  const strategies = simulationData?.strategy_evaluations || [];

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Climate Stress Laboratory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            What-If? Climate Stress Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Model how future heatwaves, precipitation deficits, and groundwater crises impact crop rotation survival.
          </p>
        </div>

        <button
          onClick={() => {
            setTempDelta(0);
            setRainDelta(0);
            setWaterCrisis(false);
          }}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Current Baseline</span>
        </button>
      </div>

      {/* Interactive Scenario Control Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-amber-600" />
          <span>Configure Stress Parameters</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Temperature Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Temperature Shift:</span>
              </span>
              <span className="font-mono font-bold text-sm text-orange-600">
                {tempDelta >= 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="3.5"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(parseFloat(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0°C (Baseline)</span>
              <span>+1.5°C (IPCC 2030)</span>
              <span>+3.5°C (Extreme)</span>
            </div>
          </div>

          {/* Rainfall Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-sky-500" />
                <span>Rainfall Anomaly:</span>
              </span>
              <span className="font-mono font-bold text-sm text-sky-600">
                {rainDelta >= 0 ? `+${rainDelta}%` : `${rainDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-35"
              max="25"
              step="5"
              value={rainDelta}
              onChange={(e) => setRainDelta(parseFloat(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-35% (Severe Dry)</span>
              <span>0% (Normal)</span>
              <span>+25% (Wet Surge)</span>
            </div>
          </div>

          {/* Groundwater Shortage Toggle */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>Groundwater / Tube Well Crisis:</span>
            </span>
            <button
              type="button"
              onClick={() => setWaterCrisis(!waterCrisis)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs border transition-all ${
                waterCrisis
                  ? "bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {waterCrisis ? "🔴 Water Shortage Active" : "Normal Irrigation Supply"}
            </button>
            <p className="text-[10px] text-slate-400">
              Simulates restricted diesel pumping or acute seasonal aquifer drawdown.
            </p>
          </div>

        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 italic">
          * Note: This is an exploratory agroclimatological scenario simulation, not a deterministic weather forecast.
        </p>
      </div>

      {/* Simulation Result Champion Banner */}
      {winner && (
        <div className="rounded-3xl p-6 sm:p-7 bg-emerald-900 text-white shadow-xl space-y-3 border border-emerald-800">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Optimal Resilient Strategy Under This Scenario</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-white">
                {winner.strategy_name}
              </h3>
              <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
                {simulationData?.scenario_summary}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-4xl font-extrabold text-emerald-400">
                {winner.overall_score}
              </span>
              <span className="text-xs text-emerald-200"> /100</span>
              <p className="text-[11px] font-bold text-emerald-300 mt-1">High Stress Resistance</p>
            </div>
          </div>
        </div>
      )}

      {/* Strategies Stress Performance Grid */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider">
          Strategy Resilience Matrix Under Stress
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {strat.strategy_name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    {strat.crop_names.join(" → ")}
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  strat.risk_color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                  strat.risk_color === 'amber' ? 'bg-amber-100 text-amber-800' :
                  strat.risk_color === 'orange' ? 'bg-orange-100 text-orange-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {strat.risk_badge}
                </span>
              </div>

              {/* Progress Meters */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Resilience</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{strat.climate_resilience}/100</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Water Eff.</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{strat.water_efficiency}/100</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Overall</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{strat.overall_score}/100</p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                {strat.verdict}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

