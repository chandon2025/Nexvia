# 🌱 AgroResilience
### *NASA-Powered Smart Crop Rotation Decision-Support Platform*

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-Earth%20Observations-0b3d91.svg)](https://power.larc.nasa.gov/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-61dafb.svg)](https://react.dev)
[![Chart.js](https://img.shields.io/badge/Visualizations-Chart.js-ff6384.svg)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**AgroResilience** is a real-world, full-stack decision-support web application that empowers smallholder farmers, agronomists, agricultural extension officers, researchers, and policymakers to design climate-resilient, water-efficient, and soil-regenerating crop rotation sequences using **NASA Earth observations**, local soil physics, and agronomic intelligence.

---

## 🌟 Key Highlights & Innovations

1. **Real NASA Earth Observation Integration**:
   - Queries live **NASA POWER API** (Prediction Of Worldwide Energy Resources) for 0.5° × 0.5° (~50km) agroclimatology data anywhere on Earth without requiring an API key.
   - Observes **Air & Surface Temperature at 2m (T2M)**, **Corrected Precipitation (PRECTOTCORR)**, **Topsoil/Root-Zone Moisture Index (GWETTOP/SMAP proxy)**, and **Solar Irradiance (ALLSKY_SFC_SW_DWN)**.
   - Scientifically calibrated local fallbacks for continuous operation with zero broken states, clearly indicating provenance.

2. **Dual Experience Modes**:
   - 🌾 **Simple Farmer Mode**: High-contrast large controls, plain language, intuitive icons, practical recommendations, and *"Explain Like I'm a Farmer"* translation of complex scientific concepts.
   - 🔬 **Advanced Research Mode**: Multi-decadal trend charts, statistical distributions, Shannon-Wiener crop diversity indices, botanical family breaks, dataset names, and spatial resolutions.

3. **Dual Language Support**:
   - 🌐 **English** and **বাংলা (Bengali)** with natural, idiomatic agricultural terminology tailored for Bangladeshi farmers and global users.

4. **100% Explainable Recommendation Engine**:
   - Multi-criteria decision engine evaluating Soil Health (25%), Water Efficiency (20%), Climate Resilience (20%), Crop Diversity (15%), Nutrient Balance (10%), and Farmer Priority Match (10%).
   - Weights dynamically rebalance based on farmer goals (*Water Conservation*, *Soil Health*, *Climate Risk*, *Yield*).
   - Generates 3–5 explicit reasons (*"Why are we recommending this?"*) and *"Things to Consider"*.

5. **Global Interactive Satellite Map**:
   - Worldwide Leaflet satellite and street map layers.
   - Instant geocoding search for any city or village on Earth.
   - Click-to-pin anywhere on Earth with immediate NASA Earth observation readouts.

6. **What-If Climate Stress Simulator**:
   - Interactive sliders for temperature shifts (+1°C to +3.5°C), precipitation changes (-35% to +25%), and groundwater crisis scenarios.
   - Automatically stress-tests multiple strategies and identifies the most resilient champion.

7. **AgroAI Contextual Assistant**:
   - Context-aware chatbot providing dual-format answers (*🌾 Simple Farmer Answer* vs *🔬 Scientific Explanation*) grounded in the user's active farm parameters and NASA data.

---

## 🏗️ Architecture

```text
                    USER
                      ↓
              React.js Frontend
                      ↓
           Tailwind CSS + Chart.js + Leaflet
                      ↓
             Python + FastAPI
                ↙          ↘
       NASA Earth Data     Agronomic Database (20+ Crops)
        (NASA POWER)       (Soil, Water, N-Fixation, Families)
                ↘          ↙
          Data Processing Pipeline
                 ↓
      Recommendation Engine (Dynamic Weights)
                 ↓
       Crop Rotation Simulation (1 to 4 Years)
                 ↓
        Smart Recommendation + AgroAI
                 ↓
       Interactive Web Dashboard & Printable PDF
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ (for frontend development)

### Launch Full-Stack Application (One Command)
Run the launcher from the project root:
```bash
python run_app.py
```
This starts the unified FastAPI server and automatically opens **http://127.0.0.1:8000** in your default browser.

### Development Mode (Concurrent Frontend & Backend)
1. **Start Backend API**:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --port 8000
   ```
2. **Start Frontend Dev Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open **http://localhost:5173** (Vite proxies all `/api` calls to `localhost:8000`).

---

## 📑 19 Integrated Application Views

| View | Purpose & Functionality |
|---|---|
| **1. Landing Page** | Hero, NASA Earth observation workflow, key capabilities, demo quick launcher. |
| **2. Dashboard** | Farm Resilience Score (82/100), 8 environmental indicators, recommended rotation preview. |
| **3. Farm Setup Wizard** | 6-step guided setup: Location search, farm size, soil texture, soil chemistry, water availability, priorities. |
| **4. Climate Analysis** | Interactive Chart.js temperature, rainfall, soil wetness, and NDVI vegetation trends with drought gauge. |
| **5. Soil Health System** | Soil health gauge (0–100), degradation cause analysis, and biological regeneration recommendations. |
| **6. Crop Explorer** | 20+ crop database with search, category filters, water requirement tags, and side-by-side comparison. |
| **7. Rotation Builder** | 4-year rotation builder with dynamic Chart.js recalculation of soil health, water demand, and diversity. |
| **8. Rotation Simulator** | Compares Monoculture vs Traditional vs AgroResilience Tri-Cycle. |
| **9. What-If Simulator** | Simulates +1°C to +3.5°C heatwaves, rainfall deficits, and water shortages. |
| **10. Strategy Comparison** | Multi-attribute comparison table with grouped bar charts and progress meters for up to 4 strategies. |
| **11. Interactive Map** | Worldwide Leaflet satellite/street maps, global geocoding, click-to-pin, and live NASA climate queries. |
| **12. AgroAI Assistant** | AI assistant offering dual-mode simple and scientific explanations with quick question chips. |
| **13. Seasonal Farm Planner** | Kharif/Rabi/Boro or Spring/Summer/Autumn/Winter calendar with sowing and harvesting windows. |
| **14. Sustainability Score** | Current Farm (64/100) vs Potential with rotation (84/100) with environmental pillar breakdown. |
| **15. Risk Center** | 6 agricultural risk diagnostic cards with contributing factors and concrete mitigation actions. |
| **16. Farm Reports** | Official executive farm report with NASA data provenance, full rotation plan, and printable PDF export. |
| **17. Learning Center** | Educational lessons with interactive *"Explain Like I'm a Farmer"* plain language toggle. |
| **18. Data & Methodology** | Complete transparency on NASA POWER, MODIS, SMAP, mathematical scoring formulas, and spatial limits. |
| **19. About & NASA Workflow** | *"How NASA Helps Farmers"* 5-step visual workflow and NASA Space Apps Challenge presentation. |

---

## 🛰️ NASA Earth Observation Provenance

- **NASA POWER Project**: Agroclimatology Climatology API (GMAO MERRA-2 assimilation & CERES solar irradiance, 0.5° × 0.5° global grid).
- **NASA SMAP**: Soil Moisture Active Passive radar radiometer topsoil wetness index proxy.
- **MODIS / VIIRS**: Normalized Difference Vegetation Index (NDVI) tracking vegetation canopy greenness.

---

## ⚖️ Scientific & Ethical Disclaimer

AgroResilience is an advisory decision-support system designed to assist farmers, agricultural students, extension officers, and researchers. It does not replace local agronomic expertise or certified government extension services.

