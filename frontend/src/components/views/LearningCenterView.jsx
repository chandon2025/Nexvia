import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  Layers,
  Droplets,
  Sprout,
  Satellite,
  HelpCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function LearningCenterView() {
  const { language } = useApp();
  const [explainMode, setExplainMode] = useState("farmer"); // "farmer" or "scientific"

  const topics = [
    {
      title: "Why does Crop Rotation matter so much?",
      title_bn: "শস্যাবর্তন কেন এত গুরুত্বপূর্ণ?",
      scientific: "Crop rotation disrupts specialized phytopathogen cycles and prevents specific nutrient depletion zones in the soil profile. Alternating deep-rooted and shallow-rooted taxa optimizes rhizosphere biological diversity and prevents subterranean plow-pan compaction.",
      farmer: "Just like eating only one kind of food makes you sick, growing the same crop in the same dirt year after year starves the soil! Changing crops lets the ground rest, confuses pests, and keeps your harvest strong.",
      icon: Sprout
    },
    {
      title: "How do Legumes make free natural fertilizer?",
      title_bn: "ডাল ফসল কীভাবে মাটিতে প্রাকৃতিক সার তৈরি করে?",
      scientific: "Fabaceae species form symbiotic endosymbiosis with Rhizobium bacteria within root nodules. Nitrogenase enzymes convert inert atmospheric dinitrogen (N2) into plant-bioavailable ammonium (NH4+), contributing 40–100 kg N/ha of biological nitrogen to the topsoil horizon.",
      farmer: "Legumes (like lentils, chickpeas, and beans) have tiny friendly root bugs that catch invisible fertilizer from the air and store it inside the dirt. When you plant grain afterwards, your crop eats that free fertilizer, cutting your urea bill!",
      icon: Layers
    },
    {
      title: "What is Soil Moisture & NASA SMAP Satellite Data?",
      title_bn: "মাটির আর্দ্রতা এবং নাসার SMAP উপগ্রহ কী?",
      scientific: "NASA's Soil Moisture Active Passive (SMAP) satellite utilizes an L-band microwave radiometer (1.4 GHz) to measure dielectric permittivity in the top 5 cm of soil, assimilated into MERRA-2 models to generate root-zone soil wetness proxies (0 to 1 dimensionless saturation).",
      farmer: "NASA satellites fly hundreds of kilometers up in space and send gentle radar waves to measure how much water is hidden inside your soil. It warns us weeks before a drought hits, so you can plant crops that don't need heavy water.",
      icon: Droplets
    },
    {
      title: "What is Vegetation Health (NDVI)?",
      title_bn: "গাছের স্বাস্থ্য এবং NDVI সূচক কী?",
      scientific: "The Normalized Difference Vegetation Index (NDVI = (NIR - Red) / (NIR + Red)) calculates the contrast between red chlorophyll absorption (0.66 μm) and near-infrared mesophyll cell scattering (0.86 μm) to quantify regional photosynthetically active canopy biomass.",
      farmer: "Healthy plants look deep green because they drink up sunshine! The satellite takes pictures of how green and bushy your fields are. If the greenness drops, it signals that crops are thirsty, stressed by heat, or under attack by pests.",
      icon: Satellite
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Agricultural Knowledge Academy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Learning Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Master the science of sustainable crop rotation and NASA Earth observation satellites.
          </p>
        </div>

        {/* Explain Like I'm a Farmer Toggle Button */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setExplainMode('farmer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              explainMode === 'farmer'
                ? 'bg-amber-100 text-amber-900 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>🌾</span>
            <span>Explain Like I'm a Farmer</span>
          </button>
          <button
            onClick={() => setExplainMode('scientific')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              explainMode === 'scientific'
                ? 'bg-indigo-100 text-indigo-900 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>🔬</span>
            <span>Scientific Terms</span>
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            {explainMode === 'farmer'
              ? 'Showing simple, real-world farmer explanations in practical plain language.'
              : 'Showing rigorous agronomic, satellite remote-sensing, and biochemical terminology.'}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
          Mode: {explainMode.toUpperCase()}
        </span>
      </div>

      {/* Educational Cards */}
      <div className="space-y-4">
        {topics.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Lesson 0{idx + 1}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {language === 'bn' ? t.title_bn : t.title}
                  </h3>
                </div>
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
                explainMode === 'farmer'
                  ? 'bg-amber-50/60 border border-amber-100 text-slate-800 font-medium'
                  : 'bg-indigo-50/60 border border-indigo-100 text-indigo-950 font-mono text-xs'
              }`}>
                {explainMode === 'farmer' ? t.farmer : t.scientific}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

