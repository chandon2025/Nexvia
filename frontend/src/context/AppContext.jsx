import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';
import {
  fetchDemoFarm,
  fetchCrops,
  fetchNasaData,
  generateRecommendationsApi,
  fallbackDemoData
} from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en'); // 'en' or 'bn'
  const [mode, setMode] = useState('farmer'); // 'farmer' (simple) or 'research' (advanced)
  const [activePage, setActivePage] = useState('landing');
  const [loading, setLoading] = useState(false);

  // Farm state initialized with Barind Bangladesh demo
  const [farmData, setFarmData] = useState({
    location_name: "Rajshahi, Barind Tract, Bangladesh",
    location_name_bn: "রাজশাহী, বরেন্দ্র অঞ্চল, বাংলাদেশ",
    latitude: 24.3745,
    longitude: 88.6042,
    farm_size_acres: 2.5,
    soil_type: "Clay",
    soil_info: {
      ph: 6.5,
      organic_matter: "1.2%",
      nitrogen: "Medium",
      phosphorus: "Low",
      potassium: "Medium"
    },
    water_availability: "Low",
    farmer_priorities: ["Improve soil health", "Save water", "Reduce climate risk"]
  });

  const [climateData, setClimateData] = useState(fallbackDemoData.climate_observations);
  const [recommendations, setRecommendations] = useState(fallbackDemoData.recommendations);
  const [cropsList, setCropsList] = useState([]);

  // Load initial data and crops on mount
  useEffect(() => {
    async function initData() {
      setLoading(true);
      try {
        const [demo, crops] = await Promise.all([fetchDemoFarm(), fetchCrops()]);
        if (demo && demo.climate_observations) {
          setClimateData(demo.climate_observations);
          setRecommendations(demo.recommendations);
          if (demo.farm_profile) {
            setFarmData(prev => ({
              ...prev,
              location_name: demo.farm_profile.location_name,
              latitude: demo.farm_profile.latitude,
              longitude: demo.farm_profile.longitude,
              soil_type: demo.farm_profile.soil_type,
              water_availability: demo.farm_profile.water_availability
            }));
          }
        }
        if (crops && crops.length > 0) {
          setCropsList(crops);
        }
      } catch (e) {
        console.error("Initialization error:", e);
      } finally {
        setLoading(false);
      }
    }
    initData();
  }, []);

  // Language & Mode toggles
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'bn' : 'en'));
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'farmer' ? 'research' : 'farmer'));
  };

  // Translation helper function
  const t = (key) => {
    const keys = key.split('.');
    let curr = translations[language] || translations.en;
    for (const k of keys) {
      if (curr && curr[k] !== undefined) {
        curr = curr[k];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fbK of keys) {
          if (fallback && fallback[fbK] !== undefined) fallback = fallback[fbK];
          else return key;
        }
        return fallback;
      }
    }
    return curr;
  };

  // Re-generate recommendations when farm parameters change
  const updateFarmData = async (newData) => {
    setLoading(true);
    const updated = { ...farmData, ...newData };
    setFarmData(updated);

    try {
      // 1. Fetch updated NASA data for new coordinates
      const nasa = await fetchNasaData(updated.latitude, updated.longitude, updated.location_name);
      setClimateData(nasa);

      // 2. Generate updated recommendations
      const rec = await generateRecommendationsApi(updated);
      if (rec && rec.recommendations) {
        setRecommendations(rec.recommendations);
      }
    } catch (e) {
      console.error("Update farm error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Instant demo farm load
  const loadDemoFarmAction = async (regionPreset = "bangladesh") => {
    setLoading(true);
    let target = {
      location_name: "Rajshahi, Barind Tract, Bangladesh",
      location_name_bn: "রাজশাহী, বরেন্দ্র অঞ্চল, বাংলাদেশ",
      latitude: 24.3745,
      longitude: 88.6042,
      farm_size_acres: 2.5,
      soil_type: "Clay",
      water_availability: "Low",
      farmer_priorities: ["Improve soil health", "Save water", "Reduce climate risk"]
    };

    if (regionPreset === "usa") {
      target = {
        location_name: "Des Moines, Iowa, USA",
        location_name_bn: "ডেময়েন, আইওয়া, যুক্তরাষ্ট্র",
        latitude: 41.5868,
        longitude: -93.6250,
        farm_size_acres: 120.0,
        soil_type: "Loamy",
        water_availability: "High",
        farmer_priorities: ["Increase yield", "Improve soil health", "Sustainable farming"]
      };
    } else if (regionPreset === "kenya") {
      target = {
        location_name: "Nakuru, Rift Valley, Kenya",
        location_name_bn: "নাকুরু, রিফ্ট ভ্যালি, কেনিয়া",
        latitude: -0.3031,
        longitude: 36.0800,
        farm_size_acres: 4.0,
        soil_type: "Loamy",
        water_availability: "Medium",
        farmer_priorities: ["Save water", "Improve soil health", "Reduce climate risk"]
      };
    }

    await updateFarmData(target);
    setActivePage('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        mode,
        setMode,
        toggleMode,
        activePage,
        setActivePage,
        farmData,
        updateFarmData,
        climateData,
        recommendations,
        cropsList,
        loading,
        loadDemoFarmAction,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

