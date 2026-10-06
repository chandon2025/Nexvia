import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Droplets,
  Thermometer,
  Layers,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  GitCompare,
  X,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function CropExplorerView() {
  const { cropsList, language } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWater, setSelectedWater] = useState("all");
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Compare mode state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Categories list
  const categories = ["all", "Cereal", "Legume", "Oilseed", "Cash Crop", "Vegetable"];

  // Filter crops
  const filteredCrops = cropsList.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.bangla_name && crop.bangla_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      crop.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || crop.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesWater =
      selectedWater === "all" || crop.water_level.toLowerCase() === selectedWater.toLowerCase();

    return matchesSearch && matchesCategory && matchesWater;
  });

  const toggleCompare = (crop) => {
    if (compareList.some(c => c.id === crop.id)) {
      setCompareList(compareList.filter(c => c.id !== crop.id));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, crop]);
      } else {
        alert("You can compare up to 3 crops simultaneously.");
      }
    }
  };

  return (
    <div className="space-y-8 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Agronomic Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Crop Explorer & Botanical Database
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Search 20+ crops with comprehensive water, thermal, soil, and rotational characteristics.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <GitCompare className="w-4 h-4 text-emerald-400" />
            <span>Compare ({compareList.length} crops)</span>
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop by English name, বাংলা নাম, or scientific name..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Water Need Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase hidden lg:inline">Water:</span>
          {["all", "Low", "Medium", "High"].map((w) => (
            <button
              key={w}
              onClick={() => setSelectedWater(w)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedWater === w
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {w === "all" ? "All" : w}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map((crop) => {
          const isComparing = compareList.some(c => c.id === crop.id);
          return (
            <div
              key={crop.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {crop.category} • {crop.family}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">
                      {crop.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-700">
                      {crop.bangla_name}
                    </p>
                    <p className="text-[11px] italic text-slate-400">
                      {crop.scientific_name}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      crop.water_level === 'Low'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : crop.water_level === 'Medium'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {crop.water_level} Water
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {language === 'bn' ? crop.description_bn : crop.description_en}
                </p>

                {/* Quick Attributes */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] border-t border-slate-100 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{crop.water_requirement_mm} mm/season</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{crop.optimal_temp}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>pH {crop.soil_ph_range[0]} - {crop.soil_ph_range[1]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{crop.is_nitrogen_fixer ? "N-Fixing Legume" : "Non-Fixer"}</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSelectedCrop(crop)}
                  className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                >
                  View Full Agronomy
                </button>
                <button
                  onClick={() => toggleCompare(crop)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isComparing
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                  title="Add to side-by-side comparison"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CROP DETAIL MODAL */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  {selectedCrop.category} • Family: {selectedCrop.family}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedCrop.name} ({selectedCrop.bangla_name})
                </h3>
                <p className="text-xs italic text-slate-400">
                  {selectedCrop.scientific_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'bn' ? selectedCrop.description_bn : selectedCrop.description_en}
            </p>

            {/* Agronomic Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Water Requirement</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCrop.water_requirement_mm} mm</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Optimal Temp</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCrop.optimal_temp}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Root Profile</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCrop.root_depth}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Drought Resilience</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCrop.drought_tolerance}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Flood Tolerance</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCrop.flood_tolerance}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Growing Season</span>
                <p className="font-bold text-slate-800 mt-0.5">{selectedCrop.growing_season}</p>
              </div>
            </div>

            {/* Rotational Benefits & Risks */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rotation & Soil Health Benefits:</span>
                </p>
                <p className="text-emerald-800 mt-1 leading-relaxed">
                  {selectedCrop.rotation_benefits}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Agronomic Vulnerabilities & Considerations:</span>
                </p>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  {selectedCrop.potential_risks}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CROP COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Crop Side-by-Side Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Compare water footprint, root depth, biological nitrogen fixation, and climate resilience.
                </p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 font-bold text-slate-400 uppercase">Parameter</th>
                    {compareList.map((c) => (
                      <th key={c.id} className="p-3 font-extrabold text-slate-900 text-sm">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Botanical Family</td>
                    {compareList.map(c => <td key={c.id} className="p-3 font-mono">{c.family}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Water Demand</td>
                    {compareList.map(c => <td key={c.id} className="p-3 font-bold text-blue-700">{c.water_requirement_mm} mm</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">N-Fixation</td>
                    {compareList.map(c => <td key={c.id} className="p-3 font-bold text-emerald-700">{c.is_nitrogen_fixer ? "Yes (Legume)" : "No"}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Drought Tolerance</td>
                    {compareList.map(c => <td key={c.id} className="p-3">{c.drought_tolerance}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Root Architecture</td>
                    {compareList.map(c => <td key={c.id} className="p-3">{c.root_depth}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Optimal Temp</td>
                    {compareList.map(c => <td key={c.id} className="p-3">{c.optimal_temp}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-500">Rotation Benefit</td>
                    {compareList.map(c => <td key={c.id} className="p-3 leading-snug">{c.rotation_benefits}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => setCompareList([])}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Clear comparison list
              </button>
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

