import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { searchLocationsApi, fetchNasaData } from '../../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import {
  Search,
  MapPin,
  Satellite,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  SunMedium,
  Check,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';

// Custom modern SVG marker icon for Leaflet
const modernMarkerIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div style="
      background-color: #10b981;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="background-color: white; width: 6px; height: 6px; border-radius: 50%;"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function InteractiveMapView() {
  const { farmData, climateData, updateFarmData, language } = useApp();

  const [mapType, setMapType] = useState('satellite'); // 'satellite' or 'street'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingNasa, setLoadingNasa] = useState(false);

  const [currentCoord, setCurrentCoord] = useState({
    lat: farmData.latitude || 24.3745,
    lng: farmData.longitude || 88.6042,
    name: farmData.location_name || "Active Farm Pin"
  });

  const [liveClimate, setLiveClimate] = useState(climateData);

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const res = await searchLocationsApi(searchQuery);
    setSearchResults(res);
    setIsSearching(false);
  };

  const handleSelectSearchResult = async (loc) => {
    setCurrentCoord({
      lat: loc.latitude,
      lng: loc.longitude,
      name: loc.name
    });
    setSearchResults([]);
    setSearchQuery('');
    await fetchLiveNasaPoint(loc.latitude, loc.longitude, loc.name);
  };

  const handleMapClick = async (lat, lng) => {
    const locName = `Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`;
    setCurrentCoord({ lat, lng, name: locName });
    await fetchLiveNasaPoint(lat, lng, locName);
  };

  const fetchLiveNasaPoint = async (lat, lng, name) => {
    setLoadingNasa(true);
    const nasa = await fetchNasaData(lat, lng, name);
    if (nasa) {
      setLiveClimate(nasa);
    }
    setLoadingNasa(false);
  };

  const applyAsActiveFarm = async () => {
    await updateFarmData({
      location_name: currentCoord.name,
      latitude: currentCoord.lat,
      longitude: currentCoord.lng
    });
    alert(`Farm location successfully updated to ${currentCoord.name}!`);
  };

  const ind = liveClimate?.indicators || {
    mean_temperature_c: 25.8,
    annual_rainfall_mm: 1420.5,
    soil_moisture_index: 0.44,
    vegetation_ndvi_index: 0.56,
    drought_risk: "Moderate"
  };

  return (
    <div className="space-y-6 py-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Global GIS & Earth Observations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Interactive Global Satellite Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click anywhere on Earth or search any city to retrieve real NASA POWER meteorological and soil wetness data.
          </p>
        </div>

        {/* Satellite vs Street Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setMapType('satellite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapType === 'satellite' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Satellite View
          </button>
          <button
            onClick={() => setMapType('street')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapType === 'street' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Street View
          </button>
        </div>
      </div>

      {/* Global Location Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find any place on Earth (e.g., Rajshahi, Rangpur, Des Moines, Nakuru, Punjab, Cordoba)..."
              className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {isSearching ? "Searching..." : "Find Location"}
          </button>
        </form>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute top-14 left-0 right-0 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 space-y-1">
            {searchResults.map((res, i) => (
              <button
                key={i}
                onClick={() => handleSelectSearchResult(res)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-xs text-slate-800 flex items-center justify-between"
              >
                <div className="truncate">
                  <p className="font-bold truncate">{res.name}</p>
                  <p className="text-[10px] text-slate-400">{res.country || "Global Region"}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                  {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map + Live Earth Readout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Leaflet Map (2 Cols) */}
        <div className="lg:col-span-2 h-[480px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-xs relative">
          <MapContainer
            center={[currentCoord.lat, currentCoord.lng]}
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            {mapType === 'satellite' ? (
              <TileLayer
                attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
            ) : (
              <TileLayer
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            )}

            <Marker position={[currentCoord.lat, currentCoord.lng]} icon={modernMarkerIcon}>
              <Popup>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900">{currentCoord.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Lat: {currentCoord.lat.toFixed(4)}, Lon: {currentCoord.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>

            <MapClickHandler onLocationSelect={handleMapClick} />
          </MapContainer>

          {/* Quick Pin Instruction Overlay */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-[11px] font-medium shadow-md pointer-events-none">
            📍 Click anywhere on the map to inspect NASA Earth data
          </div>
        </div>

        {/* Right: NASA Data Point Readout (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Point Readout
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                0.5° (~50km) Grid
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900 truncate">
                {currentCoord.name}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                {currentCoord.lat.toFixed(4)}°N, {currentCoord.lng.toFixed(4)}°E
              </p>
            </div>

            {/* Readout Metrics Cards */}
            <div className="space-y-2.5 text-xs">
              
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <span className="font-bold text-slate-700">2m Surface Temp:</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {loadingNasa ? "..." : `${ind.mean_temperature_c}°C`}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-sky-500" />
                  <span className="font-bold text-slate-700">Annual Rainfall:</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {loadingNasa ? "..." : `${ind.annual_rainfall_mm} mm`}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-slate-700">Topsoil Saturation:</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {loadingNasa ? "..." : `${(ind.soil_moisture_index * 100).toFixed(0)}%`}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-slate-700">Vegetation NDVI:</span>
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {loadingNasa ? "..." : ind.vegetation_ndvi_index.toFixed(2)}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SunMedium className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-700">Drought Vulnerability:</span>
                </div>
                <span className="font-bold text-amber-700">
                  {loadingNasa ? "..." : ind.drought_risk}
                </span>
              </div>

            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={applyAsActiveFarm}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Set as My Active Farm</span>
          </button>

        </div>

      </div>

    </div>
  );
}

