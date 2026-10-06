import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  Sprout,
  Satellite,
  Compass,
  FileText,
  User,
  FlaskConical,
  ChevronDown,
  Menu,
  X,
  Search
} from 'lucide-react';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const {
    language,
    toggleLanguage,
    mode,
    toggleMode,
    activePage,
    setActivePage,
    farmData,
    loadDemoFarmAction,
    t
  } = useApp();

  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setActivePage('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  AgroResilience
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Satellite className="w-2.5 h-2.5 mr-1" />
                  NASA
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Smart Crop Rotation Decision Support
              </p>
            </div>
          </button>
        </div>

        {/* Center: Current Farm Location Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-700 max-w-sm border border-slate-200">
          <Compass className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate font-medium">
            {language === 'bn' && farmData.location_name_bn ? farmData.location_name_bn : farmData.location_name}
          </span>
          <span className="text-[10px] text-slate-400 shrink-0">
            ({farmData.latitude.toFixed(2)}°, {farmData.longitude.toFixed(2)}°)
          </span>
        </div>

        {/* Right: Mode Switcher, Language Toggle, Demo Presets & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Demo Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1"
            >
              <span>{t('tryDemo')}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                  Select Demonstration Farm
                </div>
                <button
                  onClick={() => {
                    loadDemoFarmAction('bangladesh');
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <div>
                    <p className="font-medium">Barind Tract, Bangladesh</p>
                    <p className="text-[10px] text-slate-500">Drought-prone clay, rice-pulse cycle</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    loadDemoFarmAction('usa');
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <div>
                    <p className="font-medium">Des Moines, Iowa, USA</p>
                    <p className="text-[10px] text-slate-500">Midwest corn-soybean grain belt</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    loadDemoFarmAction('kenya');
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center gap-2 text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <div>
                    <p className="font-medium">Rift Valley, Nakuru, Kenya</p>
                    <p className="text-[10px] text-slate-500">Semi-arid smallholder legume rotation</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mode Switcher: Farmer vs Research */}
          <button
            onClick={toggleMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              mode === 'farmer'
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                : 'bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100'
            }`}
            title="Toggle between Simple Farmer Mode and Advanced Research Mode"
          >
            {mode === 'farmer' ? (
              <>
                <span>🌾</span>
                <span className="hidden sm:inline">{t('farmerMode')}</span>
              </>
            ) : (
              <>
                <FlaskConical className="w-3.5 h-3.5 text-indigo-700" />
                <span className="hidden sm:inline">{t('researchMode')}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
            title="Toggle Language (English / বাংলা)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Dashboard Direct Button */}
          <button
            onClick={() => setActivePage('dashboard')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activePage === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <span>{t('nav.dashboard')}</span>
          </button>
        </div>

      </div>
    </header>
  );
}

