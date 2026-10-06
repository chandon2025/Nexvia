import React from 'react';
import { useApp } from '../../context/AppContext';
import ScoreGauge from '../common/ScoreGauge';
import MetricCard from '../common/MetricCard';
import {
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  Layers,
  Waves,
  SunMedium,
  Globe2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Repeat,
  FlaskConical,
  Bot,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import '../../utils/chartSetup';

export default function DashboardView() {
  const {
    farmData,
    climateData,
    recommendations,
    setActivePage,
    mode,
    language,
    t
  } = useApp();

  const indicators = climateData?.indicators || {
    mean_temperature_c: 25.8,
    annual_rainfall_mm: 1420.5,
    soil_moisture_index: 0.44,
    vegetation_ndvi_index: 0.56,
    drought_risk: "Moderate",
    drought_code: "moderate"
  };

  const bestMatch = recommendations?.best_match || {
    title: "AgroResilience Tri-Cycle (Rice → Lentil → Mustard)",
    title_bn: "এগ্রোরিজিলিয়েন্স ত্রি-চক্র (ধান → মসুর → সরিষা)",
    crop_names: ["Rice (Paddy)", "Lentil", "Mustard / Rapeseed"],
    overall_score: 82.8,
    confidence_score: 88,
    sub_scores: {
      soil_health: 78,
      water_efficiency: 85,
      climate_resilience: 88,
      crop_diversity: 80,
      drought_resilience: 79
    }
  };

  const subScores = bestMatch.sub_scores || {
    soil_health: 78,
    water_efficiency: 85,
    climate_resilience: 88,
    crop_diversity: 80,
    drought_resilience: 79
  };

  // Mini Temperature & Rain Preview Chart
  const monthly = climateData?.monthly_trends || {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    temperature_c: [18, 21, 26, 30, 31, 30, 29, 29, 28, 27, 23, 19],
    precipitation_mm: [10, 18, 30, 75, 170, 290, 320, 290, 180, 70, 12, 5]
  };

  const chartData = {
    labels: monthly.months,
    datasets: [
      {
        label: 'Temp (°C)',
        data: monthly.temperature_c,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        yAxisID: 'y',
        tension: 0.35,
        fill: true
      },
      {
        label: 'Precipitation (mm)',
        data: monthly.precipitation_mm,
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.2)',
        yAxisID: 'y1',
        tension: 0.35,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 10, font: { size: 10 } }
      },
      tooltip: {
        padding: 8
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: '°C', font: { size: 10 } },
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 9 } }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: { display: true, text: 'mm', font: { size: 10 } },
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 9 } }
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner: Farm Resilience Score & Score Breakdown */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Main Resilience Score Gauge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <ScoreGauge
              score={bestMatch.overall_score || 82}
              max={100}
              label={t('dashboard.overallScoreTitle')}
              sublabel="NASA-Calibrated Resilience"
              size={150}
              strokeWidth={14}
            />
            <div className="space-y-1.5 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Optimal Decision Envelope</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {farmData.location_name}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {mode === 'farmer'
                  ? 'Your farm has strong resilience potential! Adding legumes and oilseeds protects against dry spells.'
                  : `Model evaluated against NASA POWER 30-year climatology normals at Lat ${farmData.latitude.toFixed(2)}°, Lon ${farmData.longitude.toFixed(2)}°.`}
              </p>
            </div>
          </div>

          {/* Individual Sub-Scores Bar Array */}
          <div className="w-full lg:w-96 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t('dashboard.soilHealth')}</span>
              <span className="text-emerald-700">{subScores.soil_health} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${subScores.soil_health}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t('dashboard.waterEfficiency')}</span>
              <span className="text-blue-700">{subScores.water_efficiency} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${subScores.water_efficiency}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t('dashboard.climateResilience')}</span>
              <span className="text-teal-700">{subScores.climate_resilience} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full transition-all duration-700" style={{ width: `${subScores.climate_resilience}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t('dashboard.cropDiversity')}</span>
              <span className="text-indigo-700">{subScores.crop_diversity} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${subScores.crop_diversity}%` }} />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t('dashboard.droughtResilience')}</span>
              <span className="text-amber-700">{subScores.drought_resilience || 79} / 100</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${subScores.drought_resilience || 79}%` }} />
            </div>
          </div>

        </div>
      </section>

      {/* 8 Dashboard Environmental & Agricultural Metric Cards */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Environmental & Farm Indicators
          </h3>
          <span className="text-[11px] font-medium text-slate-500">
            Source: NASA POWER MERRA-2
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Thermometer}
            title={t('dashboard.tempCard')}
            value={`${indicators.mean_temperature_c}`}
            unit="°C"
            statusText={indicators.mean_temperature_c > 28 ? "High Heat" : "Normal"}
            statusColor={indicators.mean_temperature_c > 28 ? "amber" : "emerald"}
            simpleFarmerText="Average temperature suitable for warm-season cereals and cool winter pulses."
            researchDataset="NASA POWER 2m Temperature (T2M)"
            onClick={() => setActivePage('climate')}
          />

          <MetricCard
            icon={CloudRain}
            title={t('dashboard.rainCard')}
            value={`${indicators.annual_rainfall_mm}`}
            unit="mm/yr"
            statusText={indicators.annual_rainfall_mm < 800 ? "Deficit" : "Abundant"}
            statusColor={indicators.annual_rainfall_mm < 800 ? "amber" : "blue"}
            simpleFarmerText="Concentrated monsoon rain followed by dry winter months requiring moisture conservation."
            researchDataset="NASA POWER Precipitation (PRECTOTCORR)"
            onClick={() => setActivePage('climate')}
          />

          <MetricCard
            icon={Droplets}
            title={t('dashboard.moistureCard')}
            value={`${(indicators.soil_moisture_index * 100).toFixed(0)}%`}
            unit="saturation"
            statusText={indicators.soil_moisture_index < 0.35 ? "Dry Topsoil" : "Adequate"}
            statusColor={indicators.soil_moisture_index < 0.35 ? "red" : "emerald"}
            simpleFarmerText="Soil has moderate moisture; winter pulse sowing must occur right after paddy harvest."
            researchDataset="NASA SMAP / MERRA-2 Topsoil Wetness (GWETTOP)"
            onClick={() => setActivePage('soil')}
          />

          <MetricCard
            icon={Sprout}
            title={t('dashboard.vegCard')}
            value={`${indicators.vegetation_ndvi_index.toFixed(2)}`}
            unit="NDVI"
            statusText="Vigorous Canopy"
            statusColor="emerald"
            simpleFarmerText="Vegetation health is green and healthy across the local agricultural zone."
            researchDataset="MODIS / VIIRS Normalized Difference Veg. Index"
            onClick={() => setActivePage('climate')}
          />

          <MetricCard
            icon={Layers}
            title={t('dashboard.soilHealth')}
            value={`${subScores.soil_health}`}
            unit="/100"
            statusText={farmData.soil_type + " Soil"}
            statusColor="emerald"
            simpleFarmerText="Clay soil retains moisture well, but benefits from deep-root crops to avoid compaction."
            researchDataset="Soil Organic Matter & Physical Health Index"
            onClick={() => setActivePage('soil')}
          />

          <MetricCard
            icon={Waves}
            title={t('dashboard.waterAvailCard')}
            value={farmData.water_availability}
            unit="Supply"
            statusText={farmData.water_availability === "Low" ? "Water Constraint" : "Adequate"}
            statusColor={farmData.water_availability === "Low" ? "amber" : "blue"}
            simpleFarmerText="Low dry-season water supply makes replacing Boro rice with pulses highly advantageous."
            researchDataset="Local Irrigation & Aquifer Drawdown Parameter"
            onClick={() => setActivePage('setup')}
          />

          <MetricCard
            icon={SunMedium}
            title={t('dashboard.droughtRiskCard')}
            value={indicators.drought_risk}
            statusText={indicators.drought_risk}
            statusColor={indicators.drought_code === "high" || indicators.drought_code === "severe" ? "red" : "amber"}
            simpleFarmerText="Moderate dry-season drought risk. Avoid monoculture to minimize loss."
            researchDataset="Palmer Hydrological Drought Severity Index"
            onClick={() => setActivePage('risk')}
          />

          <MetricCard
            icon={Globe2}
            title={t('dashboard.climateRiskCard')}
            value="Low-Moderate"
            statusText="Managed Risk"
            statusColor="emerald"
            simpleFarmerText="Rotational diversification keeps overall climate risk manageable."
            researchDataset="CMIP6 Climate Variability Model"
            onClick={() => setActivePage('whatif')}
          />
        </div>
      </section>

      {/* Middle Section: Recommended Rotation Hero Card + Mini Climate Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Rotation Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {bestMatch.rank_badge || "🥇 Best Match"}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {language === 'bn' && bestMatch.title_bn ? bestMatch.title_bn : bestMatch.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-700">
                {bestMatch.overall_score || 82.8}
              </span>
              <span className="text-xs text-slate-400"> /100</span>
              <p className="text-[10px] text-slate-400 font-medium">Confidence: 88%</p>
            </div>
          </div>

          {/* Crop Sequence Flow */}
          <div className="grid grid-cols-3 gap-3">
            {(bestMatch.crop_names || ["Rice", "Lentil", "Mustard"]).map((cName, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Year {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-extrabold text-slate-800 truncate">
                  {cName}
                </p>
                <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {idx === 0 ? "Staple Cereal" : idx === 1 ? "N-Fixing Pulse" : "Oilseed Biofumigant"}
                </span>
              </div>
            ))}
          </div>

          {/* Explainability reasons */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('dashboard.whyRecommended')}</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {(recommendations?.why_recommended || [
                "Lowers average annual crop water demand by ~50% compared to continuous paddy.",
                "Legumes naturally fix 50-70 kg N/ha, cutting chemical fertilizer costs.",
                "Rotating 3 plant families disrupts root nematodes and fungal spore persistence."
              ]).slice(0, 3).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap gap-3 border-t border-slate-100">
            <button
              onClick={() => setActivePage('builder')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>Customize Rotation</span>
            </button>
            <button
              onClick={() => setActivePage('whatif')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
              <span>Stress-Test Climate</span>
            </button>
            <button
              onClick={() => setActivePage('agroai')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>Ask AgroAI</span>
            </button>
          </div>
        </div>

        {/* Mini Climate Climatology Card (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Annual Climatology
              </h4>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">
                NASA POWER
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Monthly Temperature vs Rainfall normals
            </p>
          </div>

          <div className="h-44 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>

          <button
            onClick={() => setActivePage('climate')}
            className="mt-4 w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Explore Full Climate Trends</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

    </div>
  );
}

