import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Satellite,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Thermometer,
  Layers,
  Sparkles,
  BarChart3,
  Cpu,
  CheckCircle2,
  Compass,
  FileText
} from 'lucide-react';

export default function LandingView() {
  const { setActivePage, loadDemoFarmAction, t, language } = useApp();

  const workflowSteps = [
    {
      title: "NASA Earth Observations",
      title_bn: "নাসা আর্থ অবজারভেশন",
      desc: "Live surface temperature, precipitation, and soil moisture indices.",
      icon: Satellite,
      color: "blue"
    },
    {
      title: "Farm & Soil Profile",
      title_bn: "খামার ও মাটির তথ্য",
      desc: "Local soil texture, chemistry, farm size, and water availability.",
      icon: Layers,
      color: "amber"
    },
    {
      title: "Climate Analysis",
      title_bn: "জলবায়ু বিশ্লেষণ",
      desc: "Multi-decadal climatology trends and drought risk evaluation.",
      icon: Thermometer,
      color: "emerald"
    },
    {
      title: "Crop Intelligence",
      title_bn: "ফসল বুদ্ধিমত্তা",
      desc: "20+ crop agronomic profiles, water requirements, and disease break cycles.",
      icon: Sprout,
      color: "teal"
    },
    {
      title: "Rotation Simulation",
      title_bn: "শস্যাবর্তন সিমুলেশন",
      desc: "Multi-year rotation modeling under normal and climate shock scenarios.",
      icon: Cpu,
      color: "indigo"
    },
    {
      title: "Smart Recommendation",
      title_bn: "স্মার্ট সুপারিশ",
      desc: "Transparent, ranked decisions with 100% explainable reasons.",
      icon: Sparkles,
      color: "emerald"
    }
  ];

  const features = [
    {
      icon: Satellite,
      title: "NASA Earth Observations",
      title_bn: "নাসা উপগ্রহ পর্যবেক্ষণ",
      desc: "Harness NASA POWER and MERRA-2 assimilation datasets for precision weather and agroclimatological indicators."
    },
    {
      icon: Droplets,
      title: "Groundwater Conservation",
      title_bn: "ভূগর্ভস্থ পানি সংরক্ষণ",
      desc: "Identifies rotations that reduce irrigation demands by 40-70% compared to continuous flooded paddy."
    },
    {
      icon: Layers,
      title: "Soil Health Regeneration",
      title_bn: "মাটির উর্বরতা পুনরুজ্জীবন",
      desc: "Calculates biological nitrogen fixation from legumes and interrupts soil-borne fungal pathogens."
    },
    {
      icon: Cpu,
      title: "What-If Climate Simulator",
      title_bn: "হোয়াট-ইফ জলবায়ু সিমুলেটর",
      desc: "Stress-test crop strategies against +1°C to +3°C heatwaves and -20% rainfall drought scenarios."
    },
    {
      icon: Sparkles,
      title: "AgroAI Contextual Assistant",
      title_bn: "এগ্রো-এআই বুদ্ধিমত্তা",
      desc: "Get instant advice tailored to your exact soil type and weather in both Simple Farmer and Research formats."
    },
    {
      icon: FileText,
      title: "Downloadable Farm Reports",
      title_bn: "ডাউনলোডযোগ্য খামার প্রতিবেদন",
      desc: "Generate comprehensive, audit-ready PDF farm resilience reports with complete scientific provenance."
    }
  ];

  return (
    <div className="space-y-16 py-6 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-8 sm:p-14 shadow-xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Satellite className="w-3.5 h-3.5" />
            <span>NASA Space Apps Decision-Support Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t('landing.heroTitle')}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            {t('landing.heroSubtitle')}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActivePage('setup')}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <span>{t('landing.btnExplore')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => loadDemoFarmAction('bangladesh')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{t('landing.btnDemo')}</span>
            </button>

            <button
              onClick={() => setActivePage('learning')}
              className="px-5 py-3 rounded-xl text-slate-300 hover:text-white font-semibold text-sm transition-all"
            >
              {t('landing.btnHowItWorks')} →
            </button>
          </div>

          {/* Quick Metrics Badges */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-700/60 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Data Provenance</p>
              <p className="text-white font-bold text-sm sm:text-base mt-0.5">NASA POWER API</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Global Coverage</p>
              <p className="text-white font-bold text-sm sm:text-base mt-0.5">0.5° Resolution</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Crop Database</p>
              <p className="text-white font-bold text-sm sm:text-base mt-0.5">20+ Agronomic Models</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Scoring Engine</p>
              <p className="text-white font-bold text-sm sm:text-base mt-0.5">100% Explainable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('landing.workflowTitle')}
          </h2>
          <p className="text-sm text-slate-600">
            From Earth observation satellites orbiting 700km above Earth down to root-zone soil bacteria.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    Step 0{idx + 1}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {language === 'bn' ? step.title_bn : step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Key Platform Capabilities
          </h2>
          <p className="text-sm text-slate-600">
            Engineered to empower smallholders, agronomists, and researchers with scientific decision support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {language === 'bn' ? feat.title_bn : feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demonstration Call to Action */}
      <section className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6 border border-slate-800 shadow-xl">
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Explore Better Crop Rotations?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Start by inspecting the pre-configured Bangladesh Barind Tract demo farm, or input your own coordinates anywhere in the world.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => loadDemoFarmAction('bangladesh')}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <Sprout className="w-4 h-4" />
            <span>Launch Interactive Demo</span>
          </button>
          <button
            onClick={() => setActivePage('setup')}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Configure Custom Farm</span>
          </button>
        </div>
      </section>

    </div>
  );
}

