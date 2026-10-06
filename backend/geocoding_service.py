"""
AgroResilience - Geocoding & Global Locations Service
Provides instant lookup for major agricultural regions globally and in Bangladesh,
as well as dynamic reverse geocoding and search for any place in the world.
"""

import httpx
from typing import List, Dict, Any

PRESET_GLOBAL_LOCATIONS = [
    {
        "name": "Rajshahi, Barind Tract, Bangladesh",
        "name_bn": "রাজশাহী, বরেন্দ্র অঞ্চল, বাংলাদেশ",
        "country": "Bangladesh",
        "latitude": 24.3745,
        "longitude": 88.6042,
        "region_type": "Drought-prone High Barind Tract",
        "soil_type_default": "Clay",
        "description": "High Barind clay terrain with groundwater depletion and severe dry-season stress."
    },
    {
        "name": "Rangpur, Northern Plains, Bangladesh",
        "name_bn": "রংপুর, উত্তর সমভূমি, বাংলাদেশ",
        "country": "Bangladesh",
        "latitude": 25.7439,
        "longitude": 89.2752,
        "region_type": "Teesta River Alluvial Floodplain",
        "soil_type_default": "Loamy",
        "description": "Sandy-loam alluvial plain known for potato, rice, and winter oilseed cultivation."
    },
    {
        "name": "Jessore (Jashore), Bangladesh",
        "name_bn": "যশোর, দক্ষিণ-পশ্চিম সমভূমি, বাংলাদেশ",
        "country": "Bangladesh",
        "latitude": 23.1664,
        "longitude": 89.2081,
        "region_type": "Ganges Deltaic Alluvium",
        "soil_type_default": "Loamy",
        "description": "Major pulse, vegetable, and flower production center with loamy fertile soil."
    },
    {
        "name": "Mymensingh, Old Brahmaputra Floodplain, Bangladesh",
        "name_bn": "ময়মনসিংহ, পুরাতন ব্রহ্মপুত্র প্লাবনভূমি",
        "country": "Bangladesh",
        "latitude": 24.7471,
        "longitude": 90.4203,
        "region_type": "Alluvial Floodplain",
        "soil_type_default": "Silty",
        "description": "High-yielding rice and vegetable belt with fertile silty loam."
    },
    {
        "name": "Ludhiana, Punjab, India",
        "name_bn": "লুধিয়ানা, পাঞ্জাব, ভারত",
        "country": "India",
        "latitude": 30.9010,
        "longitude": 75.8573,
        "region_type": "Indo-Gangetic Intensive Agricultural Plain",
        "soil_type_default": "Loamy",
        "description": "Heart of the Green Revolution facing acute groundwater overdraft from continuous rice-wheat."
    },
    {
        "name": "Des Moines, Iowa, USA",
        "name_bn": "ডেময়েন, আইওয়া, যুক্তরাষ্ট্র",
        "country": "USA",
        "latitude": 41.5868,
        "longitude": -93.6250,
        "region_type": "US Corn-Soybean Belt",
        "soil_type_default": "Loamy",
        "description": "Highly productive prairie mollisols with intense corn and soybean rotation."
    },
    {
        "name": "Fresno, Central Valley, California, USA",
        "name_bn": "ফ্রেসনো, সেন্ট্রাল ভ্যালি, ক্যালিফোর্নিয়া, যুক্তরাষ্ট্র",
        "country": "USA",
        "latitude": 36.7468,
        "longitude": -119.7726,
        "region_type": "Semi-Arid Irrigated Valley",
        "soil_type_default": "Loamy",
        "description": "Intensive irrigated horticulture vulnerable to chronic multi-year Western droughts."
    },
    {
        "name": "Nakuru, Rift Valley, Kenya",
        "name_bn": "নাকুরু, রিফ্ট ভ্যালি, কেনিয়া",
        "country": "Kenya",
        "latitude": -0.3031,
        "longitude": 36.0800,
        "region_type": "East African Highland Agroecological Zone",
        "soil_type_default": "Volcanic / Loamy",
        "description": "Highland agricultural hub alternating maize, beans, and pyrethrum with variable bimodal rains."
    },
    {
        "name": "Cordoba, Pampas Agricultural Region, Argentina",
        "name_bn": "কর্ডোবা, পম্পাস, আর্জেন্টিনা",
        "country": "Argentina",
        "latitude": -31.4201,
        "longitude": -64.1888,
        "region_type": "Temperate Pampas Grasslands",
        "soil_type_default": "Loamy",
        "description": "Major global breadbasket for soybean, maize, and wheat rotation under changing climate trends."
    }
]

async def search_locations(query: str) -> List[Dict[str, Any]]:
    """
    Searches preset database first for instant sub-millisecond response,
    then queries OpenStreetMap Nominatim for any global query.
    """
    q_clean = query.strip().lower()
    matches = []

    # 1. Check presets
    for p in PRESET_GLOBAL_LOCATIONS:
        if q_clean in p["name"].lower() or q_clean in p.get("country", "").lower():
            matches.append(p)

    if matches:
        return matches

    # 2. Query Nominatim for global coverage
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=5&addressdetails=1"
        headers = {"User-Agent": "AgroResilience-NASA-App/1.0"}
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                results = resp.json()
                for r in results:
                    matches.append({
                        "name": r.get("display_name", query),
                        "name_bn": r.get("display_name", query),
                        "country": r.get("address", {}).get("country", ""),
                        "latitude": float(r.get("lat")),
                        "longitude": float(r.get("lon")),
                        "region_type": r.get("type", "Agricultural/Geographical region"),
                        "soil_type_default": "Loamy",
                        "description": f"Global geographical location at Lat: {float(r.get('lat')):.3f}, Lon: {float(r.get('lon')):.3f}"
                    })
    except Exception:
        pass

    # If still empty, return Rajshahi default
    return matches or [PRESET_GLOBAL_LOCATIONS[0]]

