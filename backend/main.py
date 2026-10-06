"""
AgroResilience - NASA-Powered Smart Crop Rotation Decision-Support Backend
Main FastAPI Application Entrypoint
"""

from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from crop_database import get_all_crops, get_crop_by_id
from nasa_service import fetch_nasa_earth_data
from recommendation_engine import generate_recommendations, calculate_rotation_metrics
from simulation_engine import simulate_custom_rotation_timeline, run_what_if_climate_scenario
from agro_ai import query_agro_ai
from geocoding_service import search_locations, PRESET_GLOBAL_LOCATIONS

app = FastAPI(
    title="AgroResilience API",
    description="NASA-Powered Smart Crop Rotation Decision-Support Platform",
    version="1.0.0"
)

# Enable CORS for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request Models
class FarmSetupRequest(BaseModel):
    latitude: float = 24.3745
    longitude: float = 88.6042
    location_name: str = "Rajshahi, Barind Tract, Bangladesh"
    farm_size_acres: float = 2.5
    soil_type: str = "Loamy"
    soil_info: Optional[Dict[str, Any]] = None
    water_availability: str = "Medium"
    farmer_priorities: List[str] = ["Improve soil health", "Save water"]

class CustomRotationRequest(BaseModel):
    crop_ids: List[str] = ["rice", "lentil", "mustard"]
    latitude: float = 24.3745
    longitude: float = 88.6042
    soil_type: str = "Loamy"
    water_availability: str = "Medium"
    farmer_priorities: List[str] = ["Improve soil health", "Save water"]

class WhatIfRequest(BaseModel):
    temp_delta_c: float = 1.0
    rainfall_delta_percent: float = -15.0
    water_reduction: bool = False
    latitude: float = 24.3745
    longitude: float = 88.6042
    soil_type: str = "Loamy"
    farmer_priorities: List[str] = ["Improve soil health", "Save water", "Reduce climate risk"]

class AgroAIRequest(BaseModel):
    question: str
    farm_context: Dict[str, Any] = {}
    language: str = "en"


@app.get("/api")
def read_root():
    return {
        "app": "AgroResilience",
        "description": "NASA-Powered Smart Crop Rotation Decision-Support Platform",
        "status": "online",
        "version": "1.0.0",
        "nasa_integration": "NASA POWER Agroclimatology (MERRA-2 / CERES)",
        "demo_endpoint": "/api/demo-farm"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "services": {
            "api": "active",
            "nasa_connector": "ready",
            "recommendation_engine": "operational",
            "simulation_engine": "operational",
            "agro_ai": "active"
        }
    }

@app.get("/api/crops")
def list_crops(category: Optional[str] = None, water_level: Optional[str] = None):
    all_crops = get_all_crops()
    if category:
        all_crops = [c for c in all_crops if category.lower() in c["category"].lower()]
    if water_level:
        all_crops = [c for c in all_crops if water_level.lower() == c["water_level"].lower()]
    return {
        "total": len(all_crops),
        "crops": all_crops
    }

@app.get("/api/crops/{crop_id}")
def get_crop(crop_id: str):
    crop = get_crop_by_id(crop_id)
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")
    return crop

@app.get("/api/nasa/earth-data")
async def get_nasa_data(
    lat: float = Query(24.3745, description="Latitude"),
    lon: float = Query(88.6042, description="Longitude"),
    location_name: str = Query("Rajshahi, Bangladesh")
):
    """
    Fetches real NASA POWER Earth observations for the requested point.
    """
    data = await fetch_nasa_earth_data(lat, lon, location_name)
    return data

@app.get("/api/locations")
async def find_locations(query: str = Query("Rajshahi", min_length=1)):
    """
    Searches global locations via presets and OpenStreetMap.
    """
    results = await search_locations(query)
    return {
        "query": query,
        "results": results
    }

@app.get("/api/locations/presets")
def get_preset_locations():
    return PRESET_GLOBAL_LOCATIONS

@app.post("/api/recommendations/generate")
async def recommend_rotations(payload: FarmSetupRequest):
    """
    Full decision support recommendation combining NASA data, soil physics,
    and multi-objective rotation optimization.
    """
    climate_data = await fetch_nasa_earth_data(payload.latitude, payload.longitude, payload.location_name)
    recommendations = generate_recommendations(
        climate_data=climate_data,
        soil_type=payload.soil_type,
        water_availability=payload.water_availability,
        farmer_priorities=payload.farmer_priorities
    )
    return {
        "farm_parameters": payload.model_dump(),
        "climate_observations": climate_data,
        "recommendations": recommendations
    }

@app.post("/api/simulation/custom-rotation")
async def simulate_custom(payload: CustomRotationRequest):
    """
    Simulates year-by-year trajectory for a user-constructed rotation sequence.
    """
    climate_data = await fetch_nasa_earth_data(payload.latitude, payload.longitude)
    result = simulate_custom_rotation_timeline(
        crop_ids=payload.crop_ids,
        climate_data=climate_data,
        soil_type=payload.soil_type,
        water_availability=payload.water_availability,
        farmer_priorities=payload.farmer_priorities
    )
    return result

@app.post("/api/simulation/what-if")
async def simulate_what_if(payload: WhatIfRequest):
    """
    Runs climate stress scenario testing (+1°C to +3°C, rainfall drops, drought shocks).
    """
    base_climate = await fetch_nasa_earth_data(payload.latitude, payload.longitude)
    scenario_result = run_what_if_climate_scenario(
        temp_delta_c=payload.temp_delta_c,
        rainfall_delta_percent=payload.rainfall_delta_percent,
        water_reduction=payload.water_reduction,
        base_climate_data=base_climate,
        soil_type=payload.soil_type,
        farmer_priorities=payload.farmer_priorities
    )
    return scenario_result

@app.post("/api/agro-ai")
def ask_agro_ai(payload: AgroAIRequest):
    """
    AgroAI Assistant providing both Simple Farmer answers and Detailed Scientific Explanations.
    """
    response = query_agro_ai(
        question=payload.question,
        farm_context=payload.farm_context,
        language=payload.language
    )
    return response

@app.get("/api/demo-farm")
async def get_demo_farm():
    """
    Prepares instant high-speed demo package for Bangladesh (Barind Tract).
    Enables users to explore every page and feature without entering any data.
    """
    demo_loc = PRESET_GLOBAL_LOCATIONS[0] # Rajshahi
    climate_data = await fetch_nasa_earth_data(demo_loc["latitude"], demo_loc["longitude"], demo_loc["name"])
    
    recom = generate_recommendations(
        climate_data=climate_data,
        soil_type="Clay",
        water_availability="Low",
        farmer_priorities=["Improve soil health", "Save water", "Reduce climate risk"]
    )
    
    timeline = simulate_custom_rotation_timeline(
        crop_ids=["rice", "lentil", "mustard"],
        climate_data=climate_data,
        soil_type="Clay",
        water_availability="Low",
        farmer_priorities=["Improve soil health", "Save water", "Reduce climate risk"]
    )

    return {
        "farm_profile": {
            "farm_name": "Demo Farm — Barind Tract, Bangladesh",
            "location_name": demo_loc["name"],
            "location_name_bn": demo_loc["name_bn"],
            "latitude": demo_loc["latitude"],
            "longitude": demo_loc["longitude"],
            "farm_size": "2.5 Acres (1.01 Hectares)",
            "soil_type": "Clay",
            "water_availability": "Low",
            "soil_health_score": 78,
            "resilience_score": 82,
            "priorities": ["Improve soil health", "Save water", "Reduce climate risk"]
        },
        "climate_observations": climate_data,
        "recommendations": recom,
        "rotation_timeline": timeline
    }

# Mount static frontend build if present
import os
from starlette.staticfiles import StaticFiles
from starlette.responses import FileResponse

dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_path, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))

