import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { searchLocationsApi } from '../../services/api';
import {
  MapPin,
  Maximize2,
  Layers,
  FlaskConical,
  Droplets,
  Target,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Search,
  Check,
  Compass,
  Sparkles
} from 'lucide-react';

export default function FarmSetupWizard() {
  const { farmData, updateFarmData, setActivePage, language, t } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Local state for wizard form
  const [formData, setFormData] = useState({
    location_name: farmData.location_name || "Rajshahi, Barind Tract, Bangladesh",
    latitude: farmData.latitude || 24.3745,
    longitude: farmData.longitude || 88.6042,
    farm_size_val: farmData.farm_size_acres || 2.5,
    farm_size_unit: "acres", // acres or hectares
    soil_type: farmData.soil_type || "Loamy",
    soil_ph: farmData.soil_info?.ph || 6.5,
    organic_matter: farmData.soil_info?.organic_matter || "1.2%",
    nitrogen: farmData.soil_info?.nitrogen || "Medium",
    phosphorus: farmData.soil_info?.phosphorus || "Low",
    potassium: farmData.soil_info?.potassium || "Medium",
    water_availability: farmData.water_availability || "Medium",
    farmer_priorities: farmData.farmer_priorities || ["Improve soil health", "Save water"]
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search handler
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchLocationsApi(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectLocation = (loc) => {
    setFormData(prev => ({
      ...prev,
      location_name: loc.name,
      latitude: loc.latitude,
      longitude: loc.longitude,
      soil_type: loc.soil_type_default || prev.soil_type
    }));
    setSearchResults([]);
  };

  const priorityOptions = [
    { id: "Improve soil health", label: "Improve soil health", label_bn: "মাটির স্বাস্থ্য বৃদ্ধি", desc: "Regenerate organic matter & soil microbes" },
    { id: "Save water", label: "Save water", label_bn: "পানি সাশ্রয়", desc: "Minimize irrigation pump hours & aquifer draw" },
    { id: "Increase yield", label: "Increase yield", label_bn: "ফলন বৃদ্ধি", desc: "Maximize annual grain and biomass output" },
    { id: "Reduce climate risk", label: "Reduce climate risk", label_bn: "জলবায়ু ঝুঁকি হ্রাস", desc: "Shield crops against heat waves & erratic rain" },
    { id: "Reduce fertilizer requirement", label: "Reduce fertilizer requirement", label_bn: "রাসায়নিক সারের খরচ কমানো", desc: "Harness natural biological nitrogen fixation" },
    { id: "Improve biodiversity", label: "Improve biodiversity", label_bn: "ফসলের বৈচিত্র্য বৃদ্ধি", desc: "Rotate botanical families to break pest cycles" },
    { id: "Increase profitability", label: "Increase profitability", label_bn: "মুনাফা বৃদ্ধি", desc: "Balance high-value oilseeds, cash crops & pulses" },
    { id: "Sustainable farming", label: "Sustainable farming", label_bn: "টেকসই কৃষিকাজ", desc: "Preserve farm soil fertility for decades" }
  ];

  const togglePriority = (pId) => {
    setFormData(prev => {
      const exists = prev.farmer_priorities.includes(pId);
      if (exists) {
        return { ...prev, farmer_priorities: prev.farmer_priorities.filter(x => x !== pId) };
      } else {
        return { ...prev, farmer_priorities: [...prev.farmer_priorities, pId] };
      }
    });
  };

  const handleFinalSubmit = async () => {
    const finalAcres = formData.farm_size_unit === "hectares"
      ? formData.farm_size_val * 2.47105
      : formData.farm_size_val;

    await updateFarmData({
      location_name: formData.location_name,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      farm_size_acres: finalAcres,
      soil_type: formData.soil_type,
      soil_info: {
        ph: Number(formData.soil_ph),
        organic_matter: formData.organic_matter,
        nitrogen: formData.nitrogen,
        phosphorus: formData.phosphorus,
        potassium: formData.potassium
      },
      water_availability: formData.water_availability,
      farmer_priorities: formData.farmer_priorities
    });

    setActivePage('dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-6 pb-20 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Farm Setup Wizard • Step {currentStep} of {totalSteps}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Configure Your Farm Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          We combine your farm inputs with live NASA Earth observations to recommend optimal crop rotations.
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="flex items-center justify-between px-2">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => setCurrentStep(s)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s === currentStep
                  ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                  : s < currentStep
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {s < currentStep ? <Check className="w-4 h-4" /> : s}
            </button>
            {s < totalSteps && (
              <div
                className={`w-8 sm:w-16 h-1 mx-1 rounded-full transition-all ${
                  s < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Main Card Content by Step */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 min-h-[380px] flex flex-col justify-between">
        
        {/* STEP 1: LOCATION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-lg text-slate-900">Step 1 — Farm Location</h3>
            </div>
            <p className="text-xs text-slate-500">
              Search any place in the world or enter your latitude and longitude. NASA satellite data will be fetched for this location.
            </p>

            {/* Location Search Input */}
            <form onSubmit={handleLocationSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Rajshahi, Rangpur, Dhaka, Des Moines, Nakuru..."
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-2">Select Result</p>
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectLocation(res)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-xs text-slate-700 flex items-center justify-between"
                  >
                    <span className="font-medium truncate">{res.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      ({res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°)
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Currently Selected Location Info */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                Currently Selected Farm Location
              </span>
              <p className="font-extrabold text-slate-900 text-sm">
                {formData.location_name}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <label className="text-[11px] text-slate-500 font-medium">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 font-medium">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FARM SIZE */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-lg text-slate-900">Step 2 — Farm Size</h3>
            </div>
            <p className="text-xs text-slate-500">
              Specify your cultivated plot size to scale irrigation demand and multi-year economic yields.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Farm Area</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={formData.farm_size_val}
                  onChange={(e) => setFormData({ ...formData, farm_size_val: parseFloat(e.target.value) || 1 })}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 text-lg font-bold focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Unit of Measurement</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, farm_size_unit: "acres" })}
                    className={`py-3 rounded-xl font-bold text-xs border transition-all ${
                      formData.farm_size_unit === "acres"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Acres
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, farm_size_unit: "hectares" })}
                    className={`py-3 rounded-xl font-bold text-xs border transition-all ${
                      formData.farm_size_unit === "hectares"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Hectares
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
              Equivalent: {formData.farm_size_unit === "acres" 
                ? `${(formData.farm_size_val * 0.404686).toFixed(2)} Hectares (~${(formData.farm_size_val * 3.025).toFixed(1)} Bigha)` 
                : `${(formData.farm_size_val * 2.47105).toFixed(2)} Acres`}
            </div>
          </div>
        )}

        {/* STEP 3: SOIL TYPE */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-lg text-slate-900">Step 3 — Dominant Soil Texture</h3>
            </div>
            <p className="text-xs text-slate-500">
              Soil texture determines moisture infiltration, aeration, and nutrient retention capacity.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {[
                { type: "Loamy", title: "Loamy (দোআঁশ)", desc: "Balanced silt, sand, & clay. Ideal for most rotations." },
                { type: "Clay", title: "Clay (এঁটেল)", desc: "High water retention; prone to plow-pan compaction." },
                { type: "Sandy", title: "Sandy (বেলে)", desc: "High drainage; low water retention; needs ground cover." },
                { type: "Silty", title: "Silty (পলি)", desc: "Fine fertile sediment; prone to crusting when wet." },
                { type: "Mixed", title: "Mixed (মিশ্র)", desc: "Heterogeneous alluvial floodplain soils." },
                { type: "Unknown", title: "Not Sure", desc: "System uses regional NASA MERRA-2 defaults." }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setFormData({ ...formData, soil_type: item.type })}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    formData.soil_type === item.type
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 text-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="font-bold text-xs">{item.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: SOIL CHEMISTRY (OPTIONAL) */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900">Step 4 — Soil Testing Information (Optional)</h3>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                Can be skipped
              </span>
            </div>
            <p className="text-xs text-slate-500">
              If you have laboratory soil test values, provide them below. Otherwise, default benchmarks will be applied.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <label className="font-bold text-slate-700">Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="9.0"
                  value={formData.soil_ph}
                  onChange={(e) => setFormData({ ...formData, soil_ph: parseFloat(e.target.value) || 6.5 })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
                <span className="text-[10px] text-slate-400">Optimum: 6.0 - 7.5</span>
              </div>

              <div>
                <label className="font-bold text-slate-700">Organic Matter</label>
                <input
                  type="text"
                  value={formData.organic_matter}
                  onChange={(e) => setFormData({ ...formData, organic_matter: e.target.value })}
                  placeholder="e.g. 1.2%"
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 font-medium"
                />
                <span className="text-[10px] text-slate-400">Ideal: &gt; 2.0%</span>
              </div>

              <div>
                <label className="font-bold text-slate-700">Available Nitrogen (N)</label>
                <select
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Phosphorus (P)</label>
                <select
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Potassium (K)</label>
                <select
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: WATER AVAILABILITY */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-lg text-slate-900">Step 5 — Irrigation & Water Availability</h3>
            </div>
            <p className="text-xs text-slate-500">
              How readily available is irrigation water during the dry winter and pre-monsoon seasons?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { level: "Very Low", desc: "Strictly rainfed; severe dry-season deficit. Ground water is exhausted." },
                { level: "Low", desc: "Deep tube wells face declining water table; pumping is costly or rationed." },
                { level: "Medium", desc: "Reliable canal or shallow tube well irrigation with moderate supply." },
                { level: "High", desc: "Abundant surface water or perennial irrigation access year-round." }
              ].map((w) => (
                <button
                  key={w.level}
                  type="button"
                  onClick={() => setFormData({ ...formData, water_availability: w.level })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.water_availability === w.level
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200 text-slate-900"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">{w.level}</span>
                    {formData.water_availability === w.level && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{w.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: FARMER PRIORITIES */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-lg text-slate-900">Step 6 — Farmer Priorities & Goals</h3>
            </div>
            <p className="text-xs text-slate-500">
              Select one or more priorities. The recommendation algorithm dynamically shifts its scoring weights to match your goals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {priorityOptions.map((opt) => {
                const isSelected = formData.farmer_priorities.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => togglePriority(opt.id)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-slate-900"
                        : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isSelected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900">
                        {language === 'bn' ? opt.label_bn : opt.label}
                      </p>
                      <p className="text-[10px] text-slate-500">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Calculate Smart Recommendations</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

