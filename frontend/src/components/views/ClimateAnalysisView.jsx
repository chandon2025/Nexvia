import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Line, Bar } from 'react-chartjs-2';
import '../../utils/chartSetup';
import {
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  SunMedium,
  Satellite,
  Info,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function ClimateAnalysisView() {
  const { climateData, mode, language, t } = useApp();

  const [activeChart, setActiveChart] = useState('all'); // 'all', 'temp', 'rain', 'moisture', 'ndvi'

  const indicators = climateData?.indicators || {
    mean_temperature_c: 25.8,
    annual_rainfall_mm: 1420.5,
    soil_moisture_index: 0.44,
    vegetation_ndvi_index: 0.56,
    drought_risk: "Moderate",
    drought_code: "moderate"
  };

  const monthly = climateData?.monthly_trends || {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    temperature_c: [18.2, 21.4, 26.8, 30.2, 31.0, 30.1, 29.4, 29.2, 28.9, 27.1, 23.3, 19.5],
    precipitation_mm: [11.2, 18.5, 32.1, 74.0, 168.4, 284.0, 320.5, 295.2, 185.0, 68.2, 12.4, 5.0],
    soil_moisture: [0.32, 0.28, 0.24, 0.35, 0.52, 0.78, 0.84, 0.82, 0.68, 0.48, 0.38, 0.34],
    ndvi_vegetation: [0.46, 0.42, 0.38, 0.44, 0.58, 0.72, 0.78, 0.76, 0.68, 0.54, 0.50, 0.48]
  };

  // Temperature Chart Data
  const tempData = {
    labels: monthly.months,
    datasets: [
      {
        label: 'Air Temp at 2m (°C)',
        data: monthly.temperature_c,
        borderColor: '#ea580c',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        tension: 0.35,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  // Rainfall Chart Data
  const rainData = {
    labels: monthly.months,
    datasets: [
      {
        label: 'Monthly Precipitation (mm)',
        data: monthly.precipitation_mm,
        backgroundColor: '#0284c7',
        borderRadius: 6
      }
    ]
  };

  // Soil Moisture Chart Data
  const moistureData = {
    labels: monthly.months,
    datasets: [
      {
        label: 'Topsoil Wetness Index (0 - 1.0)',
        data: monthly.soil_moisture,
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        tension: 0.35,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  // NDVI Vegetation Trend
  const ndviData = {
    labels: monthly.months,
    datasets: [
      {
        label: 'Vegetation Health Index (NDVI)',
        data: monthly.ndvi_vegetation,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        tension: 0.35,
        fill: true,
        pointRadius: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
      tooltip: { padding: 8 }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f1f5f9' } }
    }
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Satellite className="w-3.5 h-3.5" />
            <span>NASA POWER Climatology & MERRA-2 Assimilation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Climate & Agroclimatological Analysis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Multi-decadal satellite Earth observation trends for {climateData?.location_name || "Active Farm"}.
          </p>
        </div>

        {/* Drought Risk Indicator Pill */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <SunMedium className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Agricultural Drought Risk
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${
                indicators.drought_code === 'low' ? 'bg-emerald-500' :
                indicators.drought_code === 'moderate' ? 'bg-amber-500' :
                indicators.drought_code === 'high' ? 'bg-orange-500' : 'bg-rose-500'
              }`} />
              <span className="font-extrabold text-sm text-slate-800">
                {indicators.drought_risk}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Climate Summary Alert Box */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-slate-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-bold text-amber-900">
            Agroclimatological Diagnostic Summary:
          </p>
          <p className="text-slate-700">
            "Recent environmental observations show strong summer monsoon concentration ({indicators.annual_rainfall_mm} mm annual total) followed by sharp topsoil moisture depletion below 30% from November through March. A water-efficient legume or oilseed winter rotation drastically cuts groundwater pumping risk while capturing residual soil moisture."
          </p>
          <p className="text-[11px] text-slate-500 font-medium pt-1">
            ⚠️ <em>Data transparency note:</em> Observed historical figures reflect satellite climatology. Rotational recommendations are decision models, not biological guarantees.
          </p>
        </div>
      </div>

      {/* 4 Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Temperature Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-sm text-slate-800">
                1. Monthly Air Temperature at 2m (T2M)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Annual Mean: {indicators.mean_temperature_c}°C
            </span>
          </div>
          <div className="h-60 w-full">
            <Line data={tempData} options={chartOptions} />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Peak summer temperatures reach ~31°C in May-June. Sowing winter wheat or pulses must avoid late-spring terminal heat spells.
          </p>
        </div>

        {/* 2. Rainfall Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-sm text-slate-800">
                2. Monthly Precipitation Budget (PRECTOTCORR)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Total: {indicators.annual_rainfall_mm} mm
            </span>
          </div>
          <div className="h-60 w-full">
            <Bar data={rainData} options={chartOptions} />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Over 75% of precipitation is delivered in the monsoon window. Rainfed crops thrive in summer, while dry-season crops require minimal-water planning.
          </p>
        </div>

        {/* 3. Soil Moisture Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-800">
                3. Soil Moisture Dynamic (SMAP / GWETTOP Proxy)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Index: 0.0 to 1.0 Saturation
            </span>
          </div>
          <div className="h-60 w-full">
            <Line data={moistureData} options={chartOptions} />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Soil moisture drops steadily after October. Sowing relay pulses (such as Blackgram or Lentil) directly into standing rice utilizes residual topsoil water without tilling losses.
          </p>
        </div>

        {/* 4. Vegetation Health Trend (NDVI) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-green-600" />
              <h3 className="font-bold text-sm text-slate-800">
                4. Normalized Difference Vegetation Index (NDVI)
              </h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Peak: 0.78 (August)
            </span>
          </div>
          <div className="h-60 w-full">
            <Line data={ndviData} options={chartOptions} />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            NDVI quantifies photosynthetic chlorophyll absorption. Green canopy peaks during monsoon paddy and maintains moderate levels during winter cropping.
          </p>
        </div>

      </div>

      {/* Data Source Transparency Box */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Info className="w-4 h-4 text-slate-500" />
          <span>NASA Data Provenance & Methodology</span>
        </div>
        <p className="text-[11px]">
          Observations derived from NASA Prediction of Worldwide Energy Resources (POWER) project climatological archive, assimilating Goddard Earth Observing System (GEOS) MERRA-2 meteorological analyses and CERES solar irradiance observations at 0.5° x 0.5° spatial resolution.
        </p>
      </div>

    </div>
  );
}

