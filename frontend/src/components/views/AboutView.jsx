import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Satellite,
  Sprout,
  ShieldCheck,
  Globe,
  Heart,
  Layers,
  ArrowDown,
  Cpu,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function AboutView() {
  const { setActivePage, loadDemoFarmAction } = useApp();

  const presentationFlow = [
    {
      title: "1. NASA Earth Observations",
      desc: "Satellites (Terra, Aqua, SMAP, Landsat) continuously monitor Earth's temperature, surface wetness, and solar radiation from orbit.",
      icon: Satellite,
      badge: "Space Layer"
    },
    {
      title: "2. Climate & Environmental Signals",
      desc: "NASA POWER and MERRA-2 models synthesize raw satellite telemetry into calibrated agroclimatological indicators (T2M, PRECTOTCORR, GWETTOP).",
      icon: Globe,
      badge: "Data Processing"
    },
    {
      title: "3. Farm Condition Analysis",
      desc: "Local soil texture (clay, silt, sand), pH, water availability, and historical crop stress points are mapped onto the environmental envelope.",
      icon: Layers,
      badge: "Local Integration"
    },
    {
      title: "4. Crop Rotation Simulation",
      desc: "Multi-objective algorithms model 3-year and 4-year sequences, balancing nitrogen-fixing pulses, taproot alternations, and low-water crops.",
      icon: Cpu,
      badge: "Simulation Engine"
    },
    {
      title: "5. Resilient Farming Strategy",
      desc: "Farmers and agronomists receive 100% explainable, prioritized crop rotations that conserve groundwater and revitalize soil health.",
      icon: Sprout,
      badge: "Decision Delivery"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1.5">
          <Satellite className="w-3.5 h-3.5" />
          <span>NASA Space Apps Challenge Innovation</span>
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          How NASA Helps Farmers
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Bridging space-borne Earth observations with frontline agricultural decision-making to build climate-resilient farming communities worldwide.
        </p>
      </div>

      {/* Visual Pipeline Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
        <h3 className="font-extrabold text-base text-slate-900 text-center uppercase tracking-wider">
          NASA Earth Observation Decision Pipeline
        </h3>

        <div className="space-y-4 max-w-xl mx-auto">
          {presentationFlow.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="space-y-3">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {idx < presentationFlow.length - 1 && (
                  <div className="flex justify-center text-emerald-600">
                    <ArrowDown className="w-5 h-5 animate-bounce" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Vision & Global Commitment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>Global & Local Agricultural Impact</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            While designed to operate anywhere in the world through global NASA coordinates, AgroResilience is specifically optimized for vulnerable agroecological regions—such as the drought-prone Barind Tract in Bangladesh, the semi-arid Rift Valley in Kenya, and the groundwater-depleted plains of South Asia.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Ethical Science & Farmer Empowerment</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            AgroResilience does not replace professional agricultural extension officers. Instead, it provides explainable decision support, giving farmers and researchers the transparent scientific rationale behind every suggested rotation.
          </p>
        </div>
      </div>

      {/* Call to Action Bar */}
      <div className="rounded-3xl p-6 sm:p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-extrabold text-lg">Test the Platform Live</h4>
          <p className="text-xs text-slate-400">Launch the Barind Tract demonstration farm or input your own coordinates.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => loadDemoFarmAction('bangladesh')}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md"
          >
            Load Demo Farm
          </button>
          <button
            onClick={() => setActivePage('map')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all"
          >
            Explore Map
          </button>
        </div>
      </div>

    </div>
  );
}

